import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import methodOverride from 'method-override';
import cors, { CorsOptions } from 'cors';

const app = express();

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',          // Local development
  'https://sushil-dev.onrender.com' // Production placeholder - UPDATE THIS
];

const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: false }));

// Augment express-session with a custom property
declare module 'express-session' {
  interface SessionData {
    isAuthenticated?: boolean;
  }
}

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'super-secret-key-change-in-prod',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  await registerRoutes(app);
  const server = createServer(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  // In production, Express serves the built frontend assets
  if (process.env.NODE_ENV === 'production') {
    // Construct an absolute path to the client's build directory
    // This is more robust for different deployment environments
    const clientBuildPath = path.join(process.cwd(), 'client', 'dist');

    app.use(express.static(clientBuildPath));

    // For any other route, serve the index.html file to let React Router handle it
    app.get('*', (req, res) => {
      res.sendFile(path.join(clientBuildPath, 'index.html'));
    });
  } else {
    // In development, Vite handles the frontend
    await setupVite(app, server);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // Render provides the port via an environment variable
  const port = process.env.PORT || 5000;
  server.listen(port, () => {
    log(`Server is running on port ${port}`);
  });
})();
