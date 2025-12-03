import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy,
  Timestamp,
  addDoc
} from 'firebase/firestore';
import { db } from '../firebase.config';
import { Project } from '../types';
import { SkillData } from './dataManager';

// Collection names
const COLLECTIONS = {
  PROJECTS: 'projects',
  SKILLS: 'skills',
  RATINGS: 'ratings',
  CONFIG: 'config',
};

// ===== Admin Config =====

export const getAdminPassword = async (): Promise<string | null> => {
  try {
    const configRef = doc(db, COLLECTIONS.CONFIG, 'admin');
    const configDoc = await getDoc(configRef);
    
    if (configDoc.exists()) {
      return configDoc.data().password || null;
    }
    return null;
  } catch (error) {
    console.error('Error fetching admin password:', error);
    return null;
  }
};

// ===== Projects =====

export const getProjectsFromFirebase = async (): Promise<Project[]> => {
  try {
    const projectsCol = collection(db, COLLECTIONS.PROJECTS);
    const projectsQuery = query(projectsCol, orderBy('id', 'asc'));
    const projectSnapshot = await getDocs(projectsQuery);
    return projectSnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.data().id,
    })) as Project[];
  } catch (error) {
    console.error('Error fetching projects from Firebase:', error);
    return [];
  }
};

export const saveProjectToFirebase = async (project: Project): Promise<void> => {
  try {
    const projectRef = doc(db, COLLECTIONS.PROJECTS, project.id.toString());
    // Exclude thumbnail and screenshots from Firebase storage
    const { image, screenshots, ...projectData } = project;
    await setDoc(projectRef, {
      ...projectData,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error saving project to Firebase:', error);
    throw error;
  }
};

export const updateProjectInFirebase = async (id: number, updatedProject: Project): Promise<void> => {
  try {
    const projectRef = doc(db, COLLECTIONS.PROJECTS, id.toString());
    // Exclude thumbnail and screenshots from Firebase storage
    const { image, screenshots, ...projectData } = updatedProject;
    await updateDoc(projectRef, {
      ...projectData,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating project in Firebase:', error);
    throw error;
  }
};

export const deleteProjectFromFirebase = async (id: number): Promise<void> => {
  try {
    const projectRef = doc(db, COLLECTIONS.PROJECTS, id.toString());
    await deleteDoc(projectRef);
  } catch (error) {
    console.error('Error deleting project from Firebase:', error);
    throw error;
  }
};

// ===== Skills =====

export const getSkillsFromFirebase = async (): Promise<SkillData[]> => {
  try {
    const skillsCol = collection(db, COLLECTIONS.SKILLS);
    const skillSnapshot = await getDocs(skillsCol);
    return skillSnapshot.docs.map(doc => doc.data()) as SkillData[];
  } catch (error) {
    console.error('Error fetching skills from Firebase:', error);
    return [];
  }
};

export const saveSkillToFirebase = async (skill: SkillData): Promise<void> => {
  try {
    const skillRef = doc(db, COLLECTIONS.SKILLS, skill.name);
    await setDoc(skillRef, {
      ...skill,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error saving skill to Firebase:', error);
    throw error;
  }
};

export const updateSkillInFirebase = async (name: string, updatedSkill: SkillData): Promise<void> => {
  try {
    const skillRef = doc(db, COLLECTIONS.SKILLS, name);
    await updateDoc(skillRef, {
      ...updatedSkill,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating skill in Firebase:', error);
    throw error;
  }
};

export const deleteSkillFromFirebase = async (name: string): Promise<void> => {
  try {
    const skillRef = doc(db, COLLECTIONS.SKILLS, name);
    await deleteDoc(skillRef);
  } catch (error) {
    console.error('Error deleting skill from Firebase:', error);
    throw error;
  }
};

// ===== Ratings =====

interface RatingData {
  totalRatings: number;
  sumOfRatings: number;
  lastUpdated: Timestamp;
}

export const getRatingsFromFirebase = async (): Promise<{ totalRatings: number; sumOfRatings: number }> => {
  try {
    const ratingsRef = doc(db, COLLECTIONS.RATINGS, 'portfolio_ratings');
    const ratingsDoc = await getDoc(ratingsRef);
    
    if (ratingsDoc.exists()) {
      const data = ratingsDoc.data() as RatingData;
      return {
        totalRatings: data.totalRatings || 0,
        sumOfRatings: data.sumOfRatings || 0,
      };
    }
    
    return { totalRatings: 0, sumOfRatings: 0 };
  } catch (error) {
    console.error('Error fetching ratings from Firebase:', error);
    return { totalRatings: 0, sumOfRatings: 0 };
  }
};

export const saveRatingToFirebase = async (newRating: number): Promise<{ totalRatings: number; sumOfRatings: number }> => {
  try {
    const ratingsRef = doc(db, COLLECTIONS.RATINGS, 'portfolio_ratings');
    const ratingsDoc = await getDoc(ratingsRef);
    
    let newData: RatingData;
    
    if (ratingsDoc.exists()) {
      const currentData = ratingsDoc.data() as RatingData;
      newData = {
        totalRatings: currentData.totalRatings + 1,
        sumOfRatings: currentData.sumOfRatings + newRating,
        lastUpdated: Timestamp.now(),
      };
    } else {
      newData = {
        totalRatings: 1,
        sumOfRatings: newRating,
        lastUpdated: Timestamp.now(),
      };
    }
    
    await setDoc(ratingsRef, newData);
    
    return {
      totalRatings: newData.totalRatings,
      sumOfRatings: newData.sumOfRatings,
    };
  } catch (error) {
    console.error('Error saving rating to Firebase:', error);
    throw error;
  }
};

// ===== Sync with localStorage =====

export const syncProjectsToFirebase = async (projects: Project[]): Promise<void> => {
  try {
    const promises = projects.map(project => saveProjectToFirebase(project));
    await Promise.all(promises);
  } catch (error) {
    console.error('Error syncing projects to Firebase:', error);
    throw error;
  }
};

export const syncSkillsToFirebase = async (skills: SkillData[]): Promise<void> => {
  try {
    const promises = skills.map(skill => saveSkillToFirebase(skill));
    await Promise.all(promises);
  } catch (error) {
    console.error('Error syncing skills to Firebase:', error);
    throw error;
  }
};
