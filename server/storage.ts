import { users, contacts, projects, type User, type InsertUser, type Contact, type InsertContact, type Project, type InsertProject } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createContact(contact: InsertContact): Promise<Contact>;
  getAllContacts(): Promise<Contact[]>;
  createProject(project: InsertProject): Promise<Project>;
  getAllProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private contacts: Map<number, Contact>;
  private projects: Map<number, Project>;
  currentId: number;
  currentContactId: number;
  currentProjectId: number;

  constructor() {
    this.users = new Map();
    this.contacts = new Map();
    this.projects = new Map();
    this.currentId = 1;
    this.currentContactId = 1;
    this.currentProjectId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = this.currentContactId++;
    const contact: Contact = { 
      ...insertContact, 
      id, 
      createdAt: new Date() 
    };
    this.contacts.set(id, contact);
    return contact;
  }

  async getAllContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values());
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.currentProjectId++;
    const project: Project = { 
      ...insertProject, 
      id, 
      createdAt: new Date(),
      // Ensure all fields have proper null values instead of undefined
      liveUrl: insertProject.liveUrl || null,
      githubUrl: insertProject.githubUrl || null,
      codeUrl: insertProject.codeUrl || null,
      fullDescription: insertProject.fullDescription || null,
      technologies: insertProject.technologies || null,
      features: insertProject.features || null,
      challenges: insertProject.challenges || null,
      images: insertProject.images || null,
      demoVideo: insertProject.demoVideo || null,
      category: insertProject.category || null,
      duration: insertProject.duration || null,
      team: insertProject.team || null,
      status: insertProject.status || null,
    };
    this.projects.set(id, project);
    return project;
  }

  async getAllProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }
}

export const storage = new MemStorage();
