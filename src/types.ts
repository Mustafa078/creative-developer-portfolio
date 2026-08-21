export interface ServiceItem {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  icon: string;
  accentColor: string;
  tags: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  image: string;
  tags: string[];
  year: string;
  featured: boolean;
  liveUrl?: string;
  githubUrl?: string;
  metrics?: { label: string; value: string }[];
  keyFeatures?: string[];
}

export interface SkillItem {
  id: string;
  name: string;
  level: number; // 0 to 100
  category: 'frontend' | 'backend' | 'tools' | 'core';
  icon: string;
  color: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  type: string;
  period: string;
  isCurrent?: boolean;
  description: string;
  technologies: string[];
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
  handle: string;
}

export interface PersonalInfo {
  name: string;
  greeting: string;
  titlePrefix: string;
  titleHighlight: string;
  titleSuffix: string;
  tagline: string;
  bio: string;
  email: string;
  location: string;
  status: string;
  avatar: string;
  resumeUrl: string;
}
