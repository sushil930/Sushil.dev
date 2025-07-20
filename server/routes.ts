import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { Contact, Project, Rating } from "@shared/schema";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(1, "Message is required"),
});

const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  image: z.string().url("Invalid image URL"),
  liveUrl: z.string().url("Invalid live URL").optional().or(z.literal('')), // Allow empty string for optional URL
  githubUrl: z.string().url("Invalid GitHub URL").optional().or(z.literal('')), // Allow empty string for optional URL
  codeUrl: z.string().url("Invalid code URL").optional().or(z.literal('')), // Allow empty string for optional URL
  fullDescription: z.string().optional().or(z.literal('')), // Allow empty string for optional description
  technologies: z.array(z.string()).optional(),
  features: z.array(z.string()).optional(),
  challenges: z.array(z.string()).optional(),
  images: z.array(z.string().url("Invalid image URL")).optional(),
  demoVideo: z.string().url("Invalid demo video URL").optional().or(z.literal('')), // Allow empty string for optional URL
  category: z.string().optional().or(z.literal('')), // Allow empty string for optional category
  duration: z.string().optional().or(z.literal('')), // Allow empty string for optional duration
  team: z.string().optional().or(z.literal('')), // Allow empty string for optional team
  status: z.string().optional().or(z.literal('')), // Allow empty string for optional status
});

const ratingSchema = z.object({
  rating: z.number().int().min(1).max(5),
});


const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// Authentication middleware
const isAuthenticated = (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => {
  if (req.session.isAuthenticated) {
    return next();
  }
  res.status(401).json({ success: false, message: 'Unauthorized' });
};

export async function registerRoutes(app: Express): Promise<Express> {
  // Contact form submission
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = contactSchema.parse(req.body);
      const contact = await storage.createContact(validatedData);
      
      res.json({ 
        success: true, 
        message: "Message sent successfully!",
        id: contact.id 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid form data",
          errors: error.errors 
        });
      }
      
      console.error("Contact form error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Internal server error" 
      });
    }
  });

  // Get all contacts (for admin purposes)
  app.get("/api/contacts", async (req, res) => {
    try {
      const contacts = await storage.getAllContacts();
      res.json(contacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      res.status(500).json({ 
        success: false, 
        message: "Internal server error" 
      });
    }
  });

  // Get all projects
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getAllProjects();
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ 
        success: false, 
        message: "Internal server error" 
      });
    }
  });

  // Get project by ID
  app.get("/api/projects/:id", async (req, res) => {
    try {
      const id = req.params.id;


      const project = await storage.getProject(id);
      if (!project) {
        return res.status(404).json({ 
          success: false, 
          message: "Project not found" 
        });
      }

      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ 
        success: false, 
        message: "Internal server error" 
      });
    }
  });

  // Login
  app.post("/api/login", (req, res) => {
    const { password } = req.body;

    // Debugging: Check if the environment variable is loaded.
    console.log('ADMIN_PASSWORD variable exists:', !!process.env.ADMIN_PASSWORD);
    console.log('ADMIN_PASSWORD length:', process.env.ADMIN_PASSWORD?.length || 0);
    console.log('Received password length:', req.body.password?.length || 0);

    if (password === ADMIN_PASSWORD) {
      req.session.isAuthenticated = true;
      res.json({ success: true, message: 'Login successful' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid password' });
    }
  });

  // Logout
  app.post("/api/logout", (req, res) => {
    req.session.destroy(err => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Could not log out.' });
      }
      res.clearCookie('connect.sid'); // The default session cookie name
      res.json({ success: true, message: 'Logout successful' });
    });
  });

  // Create project (now protected)
  app.post("/api/projects", isAuthenticated, async (req, res) => {
    try {
      const validatedData = projectSchema.parse(req.body);
      const project = await storage.createProject(validatedData);
      
      res.json({ 
        success: true, 
        message: "Project created successfully!",
        id: project.id 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid project data",
          errors: error.errors 
        });
      }
      
      console.error("Project creation error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Internal server error" 
      });
    }
  });

  // Delete project (protected)
  app.delete("/api/projects/:id", isAuthenticated, async (req, res) => {
    try {
      const id = req.params.id;
      await storage.deleteProject(id);
      res.status(200).json({ success: true, message: "Project deleted successfully" });
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  // Update project (protected)
  app.put("/api/projects/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = projectSchema.partial().safeParse(req.body);

      if (!validatedData.success) {
        return res.status(400).json({ error: 'Invalid project data.', details: validatedData.error.flatten() });
      }

      const updatedProject = await storage.updateProject(id, validatedData.data);
      res.json(updatedProject);
    } catch (error) {
      console.error('Error updating project:', error);
      if (error instanceof Error && error.message.includes('not found')) {
        return res.status(404).json({ error: 'Project not found.' });
      }
      res.status(500).json({ error: 'Failed to update project.' });
    }
  });

  // Create rating
  app.post("/api/ratings", async (req, res) => {
    try {
      const validatedData = ratingSchema.parse(req.body);
      
      const ipAddress = req.ip;
      if (!ipAddress) {
        return res.status(500).json({ success: false, message: "Could not determine IP address" });
      }

      const hasRated = await storage.hasUserRated(ipAddress);
      if (hasRated) {
        return res.status(409).json({ success: false, message: "You have already rated in the last 24 hours." });
      }

      const rating = await storage.createRating({ ...validatedData, ipAddress });

      res.json({
        success: true,
        message: "Rating submitted successfully!",
        id: rating.id,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, message: "Invalid rating data", errors: error.errors });
      }
      console.error("Rating submission error:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  // Get rating stats
  app.get("/api/ratings/stats", async (req, res) => {
    try {
      const stats = await storage.getRatingStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching rating stats:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  return app;
}
