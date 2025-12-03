import React from 'react';

export interface Project {
  id: number;
  title: string;
  description: string;
  longDescription?: string;
  features?: string[];
  challenges?: string;
  image: string;
  screenshots?: string[];
  tech: string[];
  status?: 'Completed' | 'In Progress' | 'Maintenance';
  liveLink: string;
  codeLink: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: React.ElementType;
}

export interface NavItem {
  label: string;
  href: string;
}