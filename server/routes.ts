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

  // Create project
  app.post("/api/projects", async (req, res) => {
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
        return res.status(403).json({ success: false, message: "You have already rated in the last 24 hours." });
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
