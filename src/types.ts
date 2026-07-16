/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Personal {
  name: string;
  role: string;
  bio: string;
  location: string;
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  twitter: string;
  avatar: string;
  resume?: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  link: string;
  image: string;
}

export interface Skill {
  category: string;
  list: string[];
}

export type ThemeType = 'slate' | 'amber' | 'emerald' | 'indigo' | 'rose';

export interface ThemeColors {
  bg: string;
  text: string;
  heading: string;
  primary: string;
  primaryHover: string;
  accent: string;
  cardBg: string;
  borderColor: string;
  badgeBg: string;
  badgeText: string;
}

export interface PortfolioData {
  personal: Personal;
  experiences: Experience[];
  projects: Project[];
  skills: Skill[];
  theme: ThemeType;
  themeMode?: 'light' | 'dark';
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: string;
}
