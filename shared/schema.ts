// Define TypeScript interfaces for Firestore document structures

export interface User {
  id?: string; // Firestore document ID
  username: string;
  password: string;
}

export interface Contact {
  id?: string;
  name: string;
  email: string;
  message: string;
  createdAt: Date;
}

export interface Project {
  id?: string;
  title: string;
  description: string;
  image: string;
  liveUrl?: string;
  githubUrl?: string;
  codeUrl?: string;
  fullDescription?: string;
  technologies?: string[];
  features?: string[];
  challenges?: string[];
  images?: string[];
  demoVideo?: string;
  category?: string;
  duration?: string;
  team?: string;
  status?: string;
  createdAt: Date;
}

export interface Rating {
  id?: string;
  rating: number;
  ipAddress: string;
  createdAt: Date;
}
