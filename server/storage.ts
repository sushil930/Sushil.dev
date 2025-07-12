import { db } from "./db";
import { User, Contact, Project, Rating } from "@shared/schema";
import { FieldValue } from 'firebase-admin/firestore'; // For server timestamps and array operations

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: Omit<User, 'id'>): Promise<User>;
  createContact(contact: Omit<Contact, 'id' | 'createdAt'>): Promise<Contact>;
  getAllContacts(): Promise<Contact[]>;
  createProject(project: Omit<Project, 'id' | 'createdAt'>): Promise<Project>;
  getAllProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createRating(rating: Omit<Rating, 'id' | 'createdAt'>): Promise<Rating>;
  getRatingStats(): Promise<{ totalRatings: number; averageRating: number }>;
  hasUserRated(ipAddress: string): Promise<boolean>;
}

export class FirestoreStorage implements IStorage {
  private usersCollection = db.collection('users');
  private contactsCollection = db.collection('contacts');
  private projectsCollection = db.collection('projects');
  private ratingsCollection = db.collection('ratings');

  async getUser(id: string): Promise<User | undefined> {
    const doc = await this.usersCollection.doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() as Omit<User, 'id'> } : undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const snapshot = await this.usersCollection.where('username', '==', username).limit(1).get();
    if (snapshot.empty) {
      return undefined;
    }
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() as Omit<User, 'id'> };
  }

  async createUser(user: Omit<User, 'id'>): Promise<User> {
    const docRef = await this.usersCollection.add(user);
    return { id: docRef.id, ...user };
  }

  async createContact(contact: Omit<Contact, 'id' | 'createdAt'>): Promise<Contact> {
    const docRef = await this.contactsCollection.add({
      ...contact,
      createdAt: FieldValue.serverTimestamp(),
    });
    const newContact: Contact = { id: docRef.id, ...contact, createdAt: new Date() }; // createdAt will be updated on read
    return newContact;
  }

  async getAllContacts(): Promise<Contact[]> {
    const snapshot = await this.contactsCollection.orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as Omit<Contact, 'id'>, createdAt: (doc.data().createdAt as any)?.toDate() || new Date() }));
  }

  async createProject(project: Omit<Project, 'id' | 'createdAt'>): Promise<Project> {
    const docRef = await this.projectsCollection.add({
      ...project,
      createdAt: FieldValue.serverTimestamp(),
    });
    const newProject: Project = { id: docRef.id, ...project, createdAt: new Date() }; // createdAt will be updated on read
    return newProject;
  }

  async getAllProjects(): Promise<Project[]> {
    const snapshot = await this.projectsCollection.orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as Omit<Project, 'id'>, createdAt: (doc.data().createdAt as any)?.toDate() || new Date() }));
  }

  async getProject(id: string): Promise<Project | undefined> {
    const doc = await this.projectsCollection.doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() as Omit<Project, 'id'>, createdAt: (doc.data()?.createdAt as any)?.toDate() || new Date() } : undefined;
  }

  async createRating(rating: Omit<Rating, 'id' | 'createdAt'>): Promise<Rating> {
    const docRef = await this.ratingsCollection.add({
      ...rating,
      createdAt: FieldValue.serverTimestamp(),
    });
    const newRating: Rating = { id: docRef.id, ...rating, createdAt: new Date() }; // createdAt will be updated on read
    return newRating;
  }

  async getRatingStats(): Promise<{ totalRatings: number; averageRating: number }> {
    const snapshot = await this.ratingsCollection.get();
    let totalRatingSum = 0;
    snapshot.docs.forEach(doc => {
      totalRatingSum += (doc.data() as Rating).rating;
    });
    const totalRatings = snapshot.size;
    const averageRating = totalRatings > 0 ? totalRatingSum / totalRatings : 0;
    return { totalRatings, averageRating };
  }

  async hasUserRated(ipAddress: string): Promise<boolean> {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const snapshot = await this.ratingsCollection
      .where('ipAddress', '==', ipAddress)
      .where('createdAt', '>', twentyFourHoursAgo)
      .limit(1)
      .get();
    return !snapshot.empty;
  }
}

export const storage: IStorage = new FirestoreStorage();
