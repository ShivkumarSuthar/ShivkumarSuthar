export type TabType = 'home' | 'cv' | 'portfolio' | 'recommendations' | 'code-samples';

export interface SkillItem {
  id: string;
  name: string;
  category: 'core' | 'frontend' | 'backend' | 'state' | 'database' | 'devops' | 'tools';
  isCurrentPrimary?: boolean;
  yearsOrDepth?: string;
  description?: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  isCurrent?: boolean;
  type: 'Full-time' | 'Contract' | 'Client Engagement';
  badgeText?: string;
  overview: string;
  responsibilities: string[];
  techStack: string[];
  projectLink?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Full-Stack' | 'Frontend & 3D' | 'Enterprise & Tools' | 'Personal';
  timeframe: string;
  status: 'Production' | 'Live' | 'In Progress';
  overview: string;
  problemStatement?: string;
  solution?: string;
  keyFeatures: string[];
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  metrics?: string[];
  clientOrOrg?: string;
}

export interface RecommendationItem {
  id: string;
  author: string;
  role: string;
  company: string;
  relationship: string;
  date: string;
  testimonial: string;
  avatarInitials: string;
}

export interface CodeSampleItem {
  id: string;
  title: string;
  category: string;
  description: string;
  language: string;
  code: string;
  takeaways: string[];
}
