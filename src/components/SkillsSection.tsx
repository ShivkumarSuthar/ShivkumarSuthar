import React, { useState } from 'react';

interface BarSkill {
  name: string;
  years: number;
  maxYears: number;
  highlight?: boolean;
}

const CURRENT_BAR_SKILLS: BarSkill[] = [
  { name: 'JavaScript', years: 3.5, maxYears: 4 },
  { name: 'React.js', years: 3.5, maxYears: 4 },
  { name: 'HTML5 / CSS3', years: 3.5, maxYears: 4 },
  { name: 'TypeScript', years: 3.2, maxYears: 4 },
  { name: 'Next.js', years: 3.2, maxYears: 4 },
  { name: 'RESTful APIs', years: 3.2, maxYears: 4 },
  { name: 'Tailwind CSS', years: 3.0, maxYears: 4 },
  { name: 'Redux Toolkit', years: 3.0, maxYears: 4 },
  { name: 'Core Web Vitals', years: 3.0, maxYears: 4 },
  { name: 'Node.js', years: 2.8, maxYears: 4 },
  { name: 'TanStack Query', years: 2.5, maxYears: 4 },
  { name: 'Zustand', years: 2.5, maxYears: 4 },
  { name: 'MongoDB', years: 2.5, maxYears: 4 },
  { name: 'Git & GitHub', years: 3.5, maxYears: 4 },
  { name: 'Three.js / 3D', years: 1.8, maxYears: 4 },
  { name: 'Docker', years: 1.8, maxYears: 4 },
];

interface OtherSkill {
  name: string;
  category: string;
  icon: React.ReactNode;
}

// Brand SVG Mini Icons matching the exact aesthetic
const TechIcons = {
  NextJS: (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="#000000" />
      <text x="12" y="16" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="sans-serif">N</text>
    </svg>
  ),
  ReactJS: (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="#20232A" />
      <ellipse cx="12" cy="12" rx="7.5" ry="3" stroke="#61DAFB" strokeWidth="1.2" fill="none" />
      <ellipse cx="12" cy="12" rx="7.5" ry="3" stroke="#61DAFB" strokeWidth="1.2" fill="none" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="7.5" ry="3" stroke="#61DAFB" strokeWidth="1.2" fill="none" transform="rotate(120 12 12)" />
      <circle cx="12" cy="12" r="1.5" fill="#61DAFB" />
    </svg>
  ),
  TypeScript: (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="2" width="20" height="20" rx="3" fill="#3178C6" />
      <text x="12" y="15" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold" fontFamily="sans-serif">TS</text>
    </svg>
  ),
  JavaScript: (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="2" width="20" height="20" rx="3" fill="#F7DF1E" />
      <text x="12" y="15" textAnchor="middle" fill="#000000" fontSize="9" fontWeight="900" fontFamily="sans-serif">JS</text>
    </svg>
  ),
  ReduxToolkit: (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="#764ABC" />
      <circle cx="12" cy="12" r="4" fill="#FFFFFF" />
      <path d="M12 4A8 8 0 0 1 20 12" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  Zustand: (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="2" width="20" height="20" rx="4" fill="#443E38" />
      <text x="12" y="15" textAnchor="middle" fill="#F3A446" fontSize="11" fontWeight="bold" fontFamily="sans-serif">Z</text>
    </svg>
  ),
  Tanstack: (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="#1F2937" />
      <circle cx="12" cy="12" r="6" stroke="#EF4444" strokeWidth="2" fill="none" />
      <circle cx="12" cy="12" r="2.5" fill="#EF4444" />
    </svg>
  ),
  ReactRouter: (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="#CA4245" />
      <path d="M8 8V16M16 8V12M8 12H16" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  ReactHookForm: (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="#EC5990" />
      <path d="M7 12L10 15L17 8" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  ContextAPI: (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="#0EA5E9" />
      <circle cx="12" cy="8" r="2" fill="#FFFFFF" />
      <circle cx="7" cy="16" r="2" fill="#FFFFFF" />
      <circle cx="17" cy="16" r="2" fill="#FFFFFF" />
      <path d="M12 10L7 14M12 10L17 14" stroke="#FFFFFF" strokeWidth="1.5" />
    </svg>
  ),
  VueJS: (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="#42B883" />
      <polygon points="12,18 4,6 7.5,6 12,13 16.5,6 20,6" fill="#35495E" />
      <polygon points="12,14 6.5,6 9,6 12,10.5 15,6 17.5,6" fill="#FFFFFF" />
    </svg>
  ),
  AsyncAwait: (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="2" width="20" height="20" rx="3" fill="#F7DF1E" />
      <text x="12" y="16" textAnchor="middle" fill="#000000" fontSize="9" fontWeight="900" fontFamily="sans-serif">JS</text>
    </svg>
  ),
  Tailwind: (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="2" width="20" height="20" rx="4" fill="#06B6D4" />
      <path d="M12 7c-2 0-3.5 1-4 3 1-1 2-1.5 3-1 1 .5 1.5 1.5 2.5 2.5 1 1 2 2 4.5 2 2 0 3.5-1 4-3-1 1-2 1.5-3 1-1-.5-1.5-1.5-2.5-2.5C15 8 14 7 12 7zm-5 5c-2 0-3.5 1-4 3 1-1 2-1.5 3-1 1 .5 1.5 1.5 2.5 2.5 1 1 2 2 4.5 2 2 0 3.5-1 4-3-1 1-2 1.5-3 1-1-.5-1.5-1.5-2.5-2.5C10 13 9 12 7 12z" fill="#FFFFFF" />
    </svg>
  ),
  MUI: (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="2" width="20" height="20" rx="4" fill="#007FFF" />
      <path d="M7 7L12 12L17 7V17H14V11L12 13L10 11V17H7V7Z" fill="#FFFFFF" />
    </svg>
  ),
  StyledComponents: (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="2" width="20" height="20" rx="4" fill="#DB7093" />
      <path d="M12 4L16 14L8 14Z" fill="#FFFFFF" />
    </svg>
  ),
  Flexbox: (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="2" width="20" height="20" rx="3" fill="#1572B6" />
      <rect x="5" y="6" width="4" height="12" rx="1" fill="#FFFFFF" />
      <rect x="11" y="6" width="4" height="12" rx="1" fill="#FFFFFF" />
      <rect x="17" y="6" width="2" height="12" rx="1" fill="#FFFFFF" />
    </svg>
  ),
  CSSGrid: (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="2" width="20" height="20" rx="3" fill="#7C3AED" />
      <rect x="5" y="5" width="6" height="6" rx="1" fill="#FFFFFF" />
      <rect x="13" y="5" width="6" height="6" rx="1" fill="#FFFFFF" />
      <rect x="5" y="13" width="6" height="6" rx="1" fill="#FFFFFF" />
      <rect x="13" y="13" width="6" height="6" rx="1" fill="#FFFFFF" />
    </svg>
  ),
  ThreeJS: (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="#000000" />
      <polygon points="12,5 18,17 6,17" stroke="#FFFFFF" strokeWidth="1.5" fill="none" />
      <line x1="12" y1="5" x2="12" y2="17" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="1 1" />
    </svg>
  ),
  BabylonJS: (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="2" width="20" height="20" rx="4" fill="#BB464B" />
      <polygon points="12,5 18,8.5 18,15.5 12,19 6,15.5 6,8.5" stroke="#FFFFFF" strokeWidth="1.8" fill="none" />
    </svg>
  ),
  GSAP: (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="2" width="20" height="20" rx="4" fill="#88CE02" />
      <path d="M13 5L7 13H12L11 19L17 11H12L13 5Z" fill="#000000" />
    </svg>
  ),
  FramerMotion: (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="#0055FF" />
      <polygon points="6,6 18,6 12,12" fill="#FFFFFF" />
      <polygon points="6,12 12,12 18,18 6,18" fill="#FFFFFF" />
    </svg>
  ),
  LottieJS: (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="#00DDB3" />
      <path d="M8 8L16 16M16 8L8 16" stroke="#000000" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  ),
  Responsive: (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="2" width="20" height="20" rx="3" fill="#2C3E50" />
      <rect x="4" y="5" width="10" height="8" rx="1" stroke="#FFFFFF" strokeWidth="1.2" fill="none" />
      <rect x="13" y="9" width="7" height="10" rx="1" fill="#FFFFFF" />
    </svg>
  ),
  NodeJS: (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="2" width="20" height="20" rx="4" fill="#339933" />
      <text x="12" y="15" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="bold" fontFamily="sans-serif">Node</text>
    </svg>
  ),
  ExpressJS: (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="#000000" />
      <text x="12" y="15" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold" fontFamily="sans-serif">ex</text>
    </svg>
  ),
  RestAPI: (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="2" width="20" height="20" rx="3" fill="#008080" />
      <text x="12" y="15" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="bold" fontFamily="sans-serif">API</text>
    </svg>
  ),
  MongoDB: (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="2" width="20" height="20" rx="4" fill="#13AA52" />
      <path d="M12 4C12 4 8 9 8 13C8 16 10 18 12 19C14 18 16 16 16 13C16 9 12 4 12 4Z" fill="#FFFFFF" />
    </svg>
  ),
  MySQL: (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="2" width="20" height="20" rx="4" fill="#00758F" />
      <text x="12" y="15" textAnchor="middle" fill="#F29111" fontSize="8" fontWeight="bold" fontFamily="sans-serif">SQL</text>
    </svg>
  ),
  Mongoose: (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="#880000" />
      <text x="12" y="15" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="bold" fontFamily="sans-serif">ODM</text>
    </svg>
  ),
  Axios: (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="#5A29E4" />
      <path d="M8 8L16 16M16 8L8 16" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  Fetch: (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="2" width="20" height="20" rx="3" fill="#F7DF1E" />
      <text x="12" y="15" textAnchor="middle" fill="#000000" fontSize="8" fontWeight="bold" fontFamily="sans-serif">HTTP</text>
    </svg>
  ),
  JWT: (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="2" width="20" height="20" rx="4" fill="#D63AFF" />
      <path d="M12 6L16 10L14 12L12 10L10 12L8 10L12 6Z" fill="#FFFFFF" />
    </svg>
  ),
  JSON: (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="2" width="20" height="20" rx="3" fill="#F59E0B" />
      <text x="12" y="15" textAnchor="middle" fill="#000000" fontSize="9" fontWeight="bold" fontFamily="monospace">&#123; &#125;</text>
    </svg>
  ),
  Git: (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="#F05032" />
      <path d="M15 11a2 2 0 1 0-1.7 1h-.6l-2.4 2.4a2 2 0 1 0 1.4 1.4L14 13.5v-.8a2 2 0 0 0 1-1.7z" fill="#FFFFFF" />
    </svg>
  ),
  Github: (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="#24292E" />
      <path d="M12 6C8.686 6 6 8.686 6 12C6 14.652 7.72 16.9 10.1 17.69C10.4 17.75 10.51 17.56 10.51 17.4C10.51 17.26 10.5 16.74 10.5 16.23C9 16.5 8.64 15.65 8.52 15.31C8.45 15.13 8.14 14.56 7.87 14.41C7.65 14.29 7.33 14 7.86 13.99C8.35 13.98 8.7 14.44 8.82 14.63C9.38 15.58 10.28 15.31 10.63 15.15C10.69 14.74 10.85 14.46 11.03 14.3C9.64 14.14 8.19 13.6 8.19 11.2C8.19 10.52 8.43 9.96 8.83 9.52C8.76 9.36 8.55 8.72 8.9 7.86C8.9 7.86 9.42 7.69 10.6 8.49C11.1 8.35 11.62 8.28 12.14 8.28C12.66 8.28 13.18 8.35 13.68 8.49C14.86 7.69 15.38 7.86 15.38 7.86C15.73 8.72 15.52 9.36 15.45 9.52C15.85 9.96 16.09 10.52 16.09 11.2C16.09 13.61 14.63 14.14 13.24 14.3C13.47 14.5 13.67 14.89 13.67 15.5C13.67 16.37 13.66 17.07 13.66 17.4C13.66 17.56 13.77 17.76 14.08 17.69C16.46 16.9 18.18 14.65 18.18 12C18.18 8.686 15.494 6 12 6Z" fill="#FFFFFF" />
    </svg>
  ),
  Docker: (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="2" width="20" height="20" rx="4" fill="#2496ED" />
      <text x="12" y="15" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="bold" fontFamily="sans-serif">DOC</text>
    </svg>
  ),
  Vite: (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="#646CFF" />
      <polygon points="12,4 6,14 11,14 10,20 18,10 13,10" fill="#FFD62E" />
    </svg>
  ),
  Webpack: (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="2" width="20" height="20" rx="4" fill="#1C78C0" />
      <polygon points="12,5 18,8.5 18,15.5 12,19 6,15.5 6,8.5" stroke="#FFFFFF" strokeWidth="1.8" fill="none" />
    </svg>
  ),
  NPM: (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="2" width="20" height="20" rx="2" fill="#CB3837" />
      <text x="12" y="15" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="900" fontFamily="sans-serif">npm</text>
    </svg>
  ),
  Postman: (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="#FF6C37" />
      <path d="M7 12L17 7L12 17L11 13L7 12Z" fill="#FFFFFF" />
    </svg>
  ),
  JIRA: (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="2" width="20" height="20" rx="4" fill="#0052CC" />
      <path d="M12 6L16 10L12 14L8 10L12 6Z" fill="#FFFFFF" />
      <path d="M12 12L16 16L12 20L8 16L12 12Z" fill="#2684FF" />
    </svg>
  ),
  Vercel: (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="#000000" />
      <polygon points="12,6 18,17 6,17" fill="#FFFFFF" />
    </svg>
  ),
  CoreWebVitals: (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="#4285F4" />
      <path d="M13 5L7 13H12L11 19L17 11H12L13 5Z" fill="#FBBC05" />
    </svg>
  ),
  VeevaVault: (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="2" width="20" height="20" rx="4" fill="#F89C1E" />
      <text x="12" y="15" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold" fontFamily="sans-serif">V</text>
    </svg>
  ),
};

// 4 Columns with Shivkumar Suthar's related skills only (11 items each)
const COLUMN_1_SKILLS: OtherSkill[] = [
  { name: 'Next.js', category: 'Framework', icon: TechIcons.NextJS },
  { name: 'React.js', category: 'Library', icon: TechIcons.ReactJS },
  { name: 'TypeScript', category: 'Language', icon: TechIcons.TypeScript },
  { name: 'JavaScript (ES6+)', category: 'Language', icon: TechIcons.JavaScript },
  { name: 'Redux Toolkit', category: 'State', icon: TechIcons.ReduxToolkit },
  { name: 'Zustand', category: 'State', icon: TechIcons.Zustand },
  { name: 'TanStack Query', category: 'Data', icon: TechIcons.Tanstack },
  { name: 'React Router', category: 'Routing', icon: TechIcons.ReactRouter },
  { name: 'React Hook Form', category: 'Forms', icon: TechIcons.ReactHookForm },
  { name: 'Context API', category: 'State', icon: TechIcons.ContextAPI },
  { name: 'Vue.js', category: 'Frontend', icon: TechIcons.VueJS },
];

const COLUMN_2_SKILLS: OtherSkill[] = [
  { name: 'Tailwind CSS', category: 'CSS', icon: TechIcons.Tailwind },
  { name: 'Material UI (MUI)', category: 'UI', icon: TechIcons.MUI },
  { name: 'Styled Components', category: 'CSS', icon: TechIcons.StyledComponents },
  { name: 'CSS3 / Flexbox', category: 'CSS', icon: TechIcons.Flexbox },
  { name: 'CSS Grid', category: 'CSS', icon: TechIcons.CSSGrid },
  { name: 'Three.js (WebGL)', category: '3D', icon: TechIcons.ThreeJS },
  { name: 'Babylon.js', category: '3D', icon: TechIcons.BabylonJS },
  { name: 'GSAP Animations', category: 'Animation', icon: TechIcons.GSAP },
  { name: 'Framer Motion', category: 'Animation', icon: TechIcons.FramerMotion },
  { name: 'Lottie JS', category: 'Motion', icon: TechIcons.LottieJS },
  { name: 'Responsive Design', category: 'Layout', icon: TechIcons.Responsive },
];

const COLUMN_3_SKILLS: OtherSkill[] = [
  { name: 'Node.js', category: 'Backend', icon: TechIcons.NodeJS },
  { name: 'Express.js', category: 'Backend', icon: TechIcons.ExpressJS },
  { name: 'RESTful APIs', category: 'API', icon: TechIcons.RestAPI },
  { name: 'MongoDB', category: 'Database', icon: TechIcons.MongoDB },
  { name: 'MySQL / SQL', category: 'Database', icon: TechIcons.MySQL },
  { name: 'Mongoose ODM', category: 'Database', icon: TechIcons.Mongoose },
  { name: 'Axios', category: 'Networking', icon: TechIcons.Axios },
  { name: 'Fetch API', category: 'Networking', icon: TechIcons.Fetch },
  { name: 'Async / Await', category: 'Core JS', icon: TechIcons.AsyncAwait },
  { name: 'JWT Auth', category: 'Security', icon: TechIcons.JWT },
  { name: 'JSON Serialization', category: 'Data', icon: TechIcons.JSON },
];

const COLUMN_4_SKILLS: OtherSkill[] = [
  { name: 'Git', category: 'VCS', icon: TechIcons.Git },
  { name: 'GitHub', category: 'VCS', icon: TechIcons.Github },
  { name: 'Docker', category: 'DevOps', icon: TechIcons.Docker },
  { name: 'Vite', category: 'Tooling', icon: TechIcons.Vite },
  { name: 'Webpack', category: 'Bundler', icon: TechIcons.Webpack },
  { name: 'NPM', category: 'Package', icon: TechIcons.NPM },
  { name: 'Postman', category: 'Testing', icon: TechIcons.Postman },
  { name: 'JIRA', category: 'Agile', icon: TechIcons.JIRA },
  { name: 'Vercel', category: 'Deployment', icon: TechIcons.Vercel },
  { name: 'Core Web Vitals', category: 'Perf', icon: TechIcons.CoreWebVitals },
  { name: 'Veeva & e-Wizard', category: 'Enterprise', icon: TechIcons.VeevaVault },
];

export const SkillsSection: React.FC = () => {
  const [hoveredSkill, setHoveredSkill] = useState<BarSkill | null>(null);

  return (
    <section id="skills-matrix-section" className="space-y-4">
      {/* Outer Cohesive Surface matching blueprint layout */}
      <div
        id="skills-matrix-card"
        className="p-5 sm:p-7 md:p-8 rounded-none sm:rounded-xl bg-[#ffffff]/20 border border-white/40 shadow-sm transition-all backdrop-blur-sm"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* =========================================================================
              LEFT COLUMN: Currently coding with (Horizontal Bar Chart)
             ========================================================================= */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <h3 className="text-base sm:text-[15px] font-bold text-[var(--text-main)] mb-5 tracking-tight">
                Currently coding with (as of August 2026)
              </h3>

              {/* Chart Body with Vertical Grid Lines */}
              <div className="relative pt-1 pb-2">
                {/* Vertical Grid Background Lines */}
                <div className="absolute inset-0 left-24 sm:left-28 right-4 pointer-events-none flex justify-between">
                  <div className="w-[1px] h-full bg-[var(--border-subtle)]"></div>
                  <div className="w-[1px] h-full bg-[var(--border-subtle)]/70 border-r border-dashed border-[var(--border-subtle)]"></div>
                  <div className="w-[1px] h-full bg-[var(--border-subtle)]"></div>
                </div>

                {/* Bars Stack */}
                <div className="space-y-1.5 sm:space-y-2 relative z-10">
                  {CURRENT_BAR_SKILLS.map((skill) => {
                    const percentage = (skill.years / skill.maxYears) * 100;
                    const isHovered = hoveredSkill?.name === skill.name;

                    return (
                      <div
                        key={skill.name}
                        onMouseEnter={() => setHoveredSkill(skill)}
                        onMouseLeave={() => setHoveredSkill(null)}
                        className="group flex items-center text-xs cursor-pointer py-0.5"
                      >
                        {/* Y-Axis Label */}
                        <div className="w-24 sm:w-28 text-right pr-3 font-medium text-[var(--text-muted)] group-hover:text-[var(--text-main)] transition-colors truncate">
                          {skill.name}
                        </div>

                        {/* Bar Track & Fill with Rounded Right End */}
                        <div className="flex-1 h-5 sm:h-5.5 relative flex items-center">
                          <div
                            className="h-full rounded-r-md transition-all duration-300 flex items-center justify-end pr-2"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: isHovered ? '#2563eb' : '#38bdf8',
                              opacity: 1,
                              boxShadow: isHovered ? '0 2px 8px rgba(37, 99, 235, 0.4)' : 'none',
                            }}
                          >
                            {isHovered && (
                              <span className="text-[10px] font-bold text-[#1f1f1f] tracking-tight leading-none whitespace-nowrap drop-shadow-xs">
                                {skill.years}y
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom X-Axis Axis & Labels */}
                <div className="pt-3 mt-2 border-t border-[var(--border-subtle)] flex items-end justify-between text-xs text-[var(--text-muted)]">
                  {/* Bottom-left icon (Mountain / Curve distribution icon) */}
                  <div className="flex items-center gap-1 pl-1 text-[var(--text-subtle)]" title="Experience distribution">
                    <svg className="w-8 h-4 text-[#38bdf8]" viewBox="0 0 32 16" fill="none">
                      <path
                        d="M2 14C6 14 8 2 12 2C16 2 18 10 22 10C26 10 28 14 30 14"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 2C16 2 18 10 22 10"
                        stroke="#2563eb"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>

                  {/* X-Axis Numbers and Label */}
                  <div className="flex-1 pl-12 pr-4">
                    <div className="flex justify-between font-mono text-[11px] mb-1 text-[var(--text-muted)]">
                      <span>0</span>
                      <span>2</span>
                      <span>4</span>
                    </div>
                    <div className="text-center font-medium text-[11px] text-[var(--text-subtle)]">
                      Years experience
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================================
              RIGHT COLUMN: Other coding experience (4-Column Grid)
             ========================================================================= */}
          <div className="lg:col-span-7 lg:border-l lg:border-[var(--border-subtle)] lg:pl-8">
            <h3 className="text-base sm:text-lg font-bold text-[var(--text-main)] mb-5 tracking-tight">
              Other coding experience
            </h3>

            {/* 4-column items list matching exact 4-column arrangement */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-2 text-xs">
              {/* Column 1 */}
              <div className="space-y-2">
                {COLUMN_1_SKILLS.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center gap-3 py-1.5 transition-all group cursor-default"
                    title={`${item.name} (${item.category})`}
                  >
                    {item.icon}
                    <span className="font-medium text-[#475569] text-sm group-hover:text-[#0284c7] transition-colors truncate">
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>

              {/* Column 2 */}
              <div className="space-y-2">
                {COLUMN_2_SKILLS.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center gap-3 py-1.5 transition-all group cursor-default"
                    title={`${item.name} (${item.category})`}
                  >
                    {item.icon}
                    <span className="font-medium text-[#475569] text-sm group-hover:text-[#0284c7] transition-colors truncate">
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>

              {/* Column 3 */}
              <div className="space-y-2">
                {COLUMN_3_SKILLS.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center gap-3 py-1.5 transition-all group cursor-default"
                    title={`${item.name} (${item.category})`}
                  >
                    {item.icon}
                    <span className="font-medium text-[#475569] text-sm group-hover:text-[#0284c7] transition-colors truncate">
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>

              {/* Column 4 */}
              <div className="space-y-2">
                {COLUMN_4_SKILLS.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center gap-3 py-1.5 transition-all group cursor-default"
                    title={`${item.name} (${item.category})`}
                  >
                    {item.icon}
                    <span className="font-medium text-[#475569] text-sm group-hover:text-[#0284c7] transition-colors truncate">
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
