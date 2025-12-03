import { Project } from '../types';
import { getProjects } from '../utils/dataManager';

export const projects: Project[] = getProjects() || [];

