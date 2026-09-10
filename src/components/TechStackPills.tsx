import React from 'react';

export interface TechPillItem {
  id: string;
  name: string;
  icon: React.ReactNode;
}

export const RECENT_ROLE_PILLS: TechPillItem[] = [
  {
    id: 'typescript',
    name: 'TypeScript',
    icon: (
      <span className="w-5 h-5 rounded-[5px] bg-[#3178C6] text-white font-bold text-[10px] flex items-center justify-center shrink-0 shadow-2xs">
        TS
      </span>
    ),
  },
  {
    id: 'javascript',
    name: 'JavaScript (ES6+)',
    icon: (
      <span className="w-5 h-5 rounded-[5px] bg-[#F7DF1E] text-black font-extrabold text-[10px] flex items-center justify-center shrink-0 shadow-2xs">
        JS
      </span>
    ),
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    icon: (
      <span className="w-5 h-5 rounded-[5px] bg-[#06B6D4] text-white flex items-center justify-center shrink-0 shadow-2xs">
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" />
        </svg>
      </span>
    ),
  },
  {
    id: 'react',
    name: 'React.js',
    icon: (
      <span className="w-5 h-5 rounded-[5px] bg-[#20232A] text-[#61DAFB] flex items-center justify-center shrink-0 shadow-2xs">
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <ellipse cx="12" cy="12" rx="9" ry="3.5" />
          <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(120 12 12)" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
        </svg>
      </span>
    ),
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    icon: (
      <span className="w-5 h-5 rounded-[5px] bg-black text-white font-bold text-[10px] flex items-center justify-center shrink-0 shadow-2xs">
        N
      </span>
    ),
  },
  {
    id: 'tanstack',
    name: 'TanStack Query',
    icon: (
      <span className="w-5 h-5 rounded-full bg-[#1F2937] text-[#EF4444] flex items-center justify-center shrink-0">
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="8" stroke="#EF4444" strokeWidth="2" fill="none" />
          <circle cx="12" cy="12" r="3" fill="#EF4444" />
        </svg>
      </span>
    ),
  },
  {
    id: 'zustand',
    name: 'Zustand',
    icon: (
      <span className="w-5 h-5 rounded bg-[#443E38] text-[#F3A446] font-bold text-[9px] flex items-center justify-center shrink-0">
        🐻
      </span>
    ),
  },
  {
    id: 'redux',
    name: 'Redux Toolkit',
    icon: (
      <span className="w-5 h-5 rounded-full bg-[#764ABC] text-white flex items-center justify-center shrink-0">
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.8 15.6c-.6 1.1-1.6 1.9-2.8 2.2-1.2.3-2.5 0-3.5-.7l-1.5 2.6c1.6 1 3.5 1.4 5.4.9 1.9-.5 3.5-1.7 4.5-3.4l-2.1-1.6z"/>
        </svg>
      </span>
    ),
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    icon: (
      <span className="w-5 h-5 rounded bg-[#339933] text-white font-bold text-[9px] flex items-center justify-center shrink-0">
        JS
      </span>
    ),
  },
  {
    id: 'restapi',
    name: 'RESTful APIs',
    icon: (
      <span className="w-5 h-5 rounded bg-[#008080] text-white font-bold text-[8px] flex items-center justify-center shrink-0">
        API
      </span>
    ),
  },
  {
    id: 'vitals',
    name: 'Core Web Vitals',
    icon: (
      <span className="w-5 h-5 rounded bg-[#4285F4] text-white font-bold text-[8px] flex items-center justify-center shrink-0">
        ⚡
      </span>
    ),
  },
  {
    id: 'github',
    name: 'GitHub',
    icon: (
      <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center shrink-0">
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
      </span>
    ),
  },
  {
    id: 'docker',
    name: 'Docker',
    icon: (
      <span className="w-5 h-5 rounded bg-[#2496ED] text-white flex items-center justify-center shrink-0 font-bold text-[8px]">
        🐳
      </span>
    ),
  },
  {
    id: 'responsive',
    name: 'Responsive UI',
    icon: (
      <span className="w-5 h-5 rounded bg-[#2C3E50] text-white flex items-center justify-center shrink-0">
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="3" width="14" height="12" rx="1.5" />
          <rect x="12" y="9" width="8" height="12" rx="1.5" />
        </svg>
      </span>
    ),
  },
];
