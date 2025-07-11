import { z } from "zod";

export interface ProjectCard {
  id: number;
  title: string;
  description: string;
  image: string;
  liveUrl?: string;
  githubUrl?: string;
  codeUrl?: string; // Keeping this for backward compatibility
}

export interface Skill {
  name: string;
  level: number;
}

export interface Achievement {
  icon: string;
  title: string;
  description: string;
  color: string;
}

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type ContactFormData = z.infer<typeof contactSchema>;
