import { Project } from '../types';
import {
  getProjectsFromFirebase,
  saveProjectToFirebase,
  updateProjectInFirebase,
  deleteProjectFromFirebase,
  getSkillsFromFirebase,
  saveSkillToFirebase,
  updateSkillInFirebase,
  deleteSkillFromFirebase,
} from './firebaseService';

const STORAGE_KEYS = {
  PROJECTS: 'portfolio_projects',
  SKILLS: 'portfolio_skills',
};

export interface SkillData {
  name: string;
  level: number;
  category: string;
  icon: string;
  color: string;
  barColor: string;
}

// Projects Management
export const getProjects = async (): Promise<Project[]> => {
  if (typeof window === 'undefined') return [];
  
  try {
    // Try to get from Firebase first
    const firebaseProjects = await getProjectsFromFirebase();
    
    if (firebaseProjects.length > 0) {
      // Save to localStorage for offline backup, but trust Firebase as source of truth
      saveProjectsToLocalStorage(firebaseProjects);
      return firebaseProjects;
    }
    
    // Fallback to localStorage
    return getProjectsFromLocalStorage() || [];
  } catch (error) {
    console.error('Error getting projects, falling back to localStorage:', error);
    return getProjectsFromLocalStorage() || [];
  }
};

const getProjectsFromLocalStorage = (): Project[] | null => {
  const stored = localStorage.getItem(STORAGE_KEYS.PROJECTS);
  if (!stored) return null;

  const projects = JSON.parse(stored);
  // Migration for old data structure
  return projects.map((p: any) => ({
    ...p,
    tech: p.tech || p.tags || [],
    codeLink: p.codeLink || p.github || '',
    liveLink: p.liveLink || p.live || '',
    id: typeof p.id === 'string' ? (Number(p.id) || Date.now()) : p.id
  }));
};

const saveProjectsToLocalStorage = (projects: Project[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
};

export const saveProjects = async (projects: Project[]): Promise<void> => {
  if (typeof window === 'undefined') return;
  
  // Save to localStorage
  saveProjectsToLocalStorage(projects);
  
  // Save to Firebase (full data)
  try {
    for (const project of projects) {
      await saveProjectToFirebase(project);
    }
  } catch (error) {
    console.error('Error saving projects to Firebase:', error);
  }
};

export const addProject = async (project: Project): Promise<void> => {
  const projects = await getProjects();
  projects.push(project);
  
  // Save to localStorage
  saveProjectsToLocalStorage(projects);
  
  // Save to Firebase
  try {
    await saveProjectToFirebase(project);
  } catch (error) {
    console.error('Error adding project to Firebase:', error);
  }
};

export const updateProject = async (id: number, updatedProject: Project): Promise<void> => {
  const projects = await getProjects();
  const index = projects.findIndex(p => p.id === id);
  if (index !== -1) {
    projects[index] = updatedProject;
    
    // Save to localStorage
    saveProjectsToLocalStorage(projects);
    
    // Update in Firebase
    try {
      await updateProjectInFirebase(id, updatedProject);
    } catch (error) {
      console.error('Error updating project in Firebase:', error);
    }
  }
};

export const deleteProject = async (id: number): Promise<void> => {
  const projects = await getProjects();
  const filtered = projects.filter(p => p.id !== id);
  
  // Save to localStorage
  saveProjectsToLocalStorage(filtered);
  
  // Delete from Firebase
  try {
    await deleteProjectFromFirebase(id);
  } catch (error) {
    console.error('Error deleting project from Firebase:', error);
  }
};

// Skills Management
export const getSkills = async (): Promise<SkillData[]> => {
  if (typeof window === 'undefined') return [];
  
  try {
    // Try to get from Firebase first
    const firebaseSkills = await getSkillsFromFirebase();
    
    if (firebaseSkills.length > 0) {
      // Cache in localStorage
      saveSkillsToLocalStorage(firebaseSkills);
      return firebaseSkills;
    }
    
    // Fallback to localStorage
    return getSkillsFromLocalStorage() || [];
  } catch (error) {
    console.error('Error getting skills, falling back to localStorage:', error);
    return getSkillsFromLocalStorage() || [];
  }
};

const getSkillsFromLocalStorage = (): SkillData[] | null => {
  const stored = localStorage.getItem(STORAGE_KEYS.SKILLS);
  return stored ? JSON.parse(stored) : null;
};

const saveSkillsToLocalStorage = (skills: SkillData[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(skills));
};

export const saveSkills = async (skills: SkillData[]): Promise<void> => {
  if (typeof window === 'undefined') return;
  
  // Save to localStorage
  saveSkillsToLocalStorage(skills);
  
  // Save to Firebase
  try {
    for (const skill of skills) {
      await saveSkillToFirebase(skill);
    }
  } catch (error) {
    console.error('Error saving skills to Firebase:', error);
  }
};

export const addSkill = async (skill: SkillData): Promise<void> => {
  const skills = await getSkills();
  skills.push(skill);
  
  // Save to localStorage
  saveSkillsToLocalStorage(skills);
  
  // Save to Firebase
  try {
    await saveSkillToFirebase(skill);
  } catch (error) {
    console.error('Error adding skill to Firebase:', error);
  }
};

export const updateSkill = async (name: string, updatedSkill: SkillData): Promise<void> => {
  const skills = await getSkills();
  const index = skills.findIndex(s => s.name === name);
  if (index !== -1) {
    skills[index] = updatedSkill;
    
    // Save to localStorage
    saveSkillsToLocalStorage(skills);
    
    // Update in Firebase
    try {
      await updateSkillInFirebase(name, updatedSkill);
    } catch (error) {
      console.error('Error updating skill in Firebase:', error);
    }
  }
};

export const deleteSkill = async (name: string): Promise<void> => {
  const skills = await getSkills();
  const filtered = skills.filter(s => s.name !== name);
  
  // Save to localStorage
  saveSkillsToLocalStorage(filtered);
  
  // Delete from Firebase
  try {
    await deleteSkillFromFirebase(name);
  } catch (error) {
    console.error('Error deleting skill from Firebase:', error);
  }
};

// Initialize with defaults if empty
export const initializeData = async (defaultProjects: Project[], defaultSkills: SkillData[]): Promise<void> => {
  const projects = await getProjects();
  const skills = await getSkills();
  
  if (!projects || projects.length === 0) {
    await saveProjects(defaultProjects);
  }
  if (!skills || skills.length === 0) {
    await saveSkills(defaultSkills);
  }
};
