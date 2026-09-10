import React from 'react';
import { TabType } from '../types';
import { PERSONAL_INFO } from '../data/portfolioData';

interface HeaderProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  isMenuOpen: boolean;
  onToggleMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  isMenuOpen,
  onToggleMenu,
}) => {
  return (
    <header
      id="main-header"
      className="w-full transition-colors duration-200 border-b border-black/15 shadow-xs"
      style={{
        backgroundColor: 'var(--bg-header)',
      }}
    >
      <div className="w-full px-5 sm:px-8 h-16 sm:h-18 flex items-center justify-between">
        {/* Left: Hamburger menu + Name & Subtitle */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            id="menu-toggle-button"
            onClick={onToggleMenu}
            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="p-1.5 sm:p-2 rounded-md text-black hover:bg-black/10 transition-colors focus:outline-none focus:ring-2 focus:ring-black/20"
          >
            <div className="w-6 h-4 sm:w-7 sm:h-5 flex flex-col justify-between py-0.5">
              <span className="w-full h-[2.5px] bg-black rounded-full"></span>
              <span className="w-full h-[2.5px] bg-black rounded-full"></span>
              <span className="w-full h-[2.5px] bg-black rounded-full"></span>
            </div>
          </button>

          <button
            id="brand-home-link"
            onClick={() => onSelectTab('home')}
            className="text-left group cursor-pointer focus:outline-none flex items-center gap-2.5 sm:gap-3"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-black text-[#f7df1e] font-mono font-black text-xs sm:text-sm flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
              JS
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-black leading-tight">
                {PERSONAL_INFO.name}
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-neutral-800 tracking-wide leading-snug">
                {PERSONAL_INFO.title}
              </p>
            </div>
          </button>
        </div>

        {/* Right: The 4 distinct icons from Martin Burford's header */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* 1. CV Document Icon */}
          <button
            id="header-cv-icon"
            onClick={() => onSelectTab('cv')}
            title="Curriculum Vitae"
            aria-label="View Curriculum Vitae"
            className={`p-1 rounded-md transition-all hover:scale-105 active:scale-95 focus:outline-none ${
              currentTab === 'cv' ? 'ring-2 ring-black/40 bg-black/15' : 'hover:bg-black/10'
            }`}
          >
            <svg
              className="w-7 h-7 sm:w-8 sm:h-8 drop-shadow-xs"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Document Sheet */}
              <rect x="5" y="3" width="22" height="26" rx="2" fill="#ffffff" stroke="#000000" strokeWidth="1.5" />
              {/* Badge/Seal Circle */}
              <circle cx="16" cy="11" r="4.5" fill="#000000" />
              <text
                x="16"
                y="13"
                textAnchor="middle"
                fill="#f7df1e"
                fontSize="6"
                fontWeight="bold"
                fontFamily="sans-serif"
              >
                CV
              </text>
              {/* Document lines */}
              <line x1="9" y1="18" x2="23" y2="18" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="9" y1="21.5" x2="23" y2="21.5" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="9" y1="25" x2="18" y2="25" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>

          {/* 2. Portfolio / Projects Window Icon */}
          <button
            id="header-portfolio-icon"
            onClick={() => onSelectTab('portfolio')}
            title="Portfolio & Projects"
            aria-label="View Portfolio & Projects"
            className={`p-1 rounded-md transition-all hover:scale-105 active:scale-95 focus:outline-none ${
              currentTab === 'portfolio' ? 'ring-2 ring-black/40 bg-black/15' : 'hover:bg-black/10'
            }`}
          >
            <svg
              className="w-7 h-7 sm:w-8 sm:h-8 drop-shadow-xs"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Window Frame */}
              <rect x="3" y="4" width="26" height="24" rx="3" fill="#000000" />
              {/* Top Bar */}
              <rect x="3" y="4" width="26" height="6" rx="3" fill="#27272a" />
              {/* 3 Window Dots */}
              <circle cx="7" cy="7" r="1" fill="#ef4444" />
              <circle cx="10.5" cy="7" r="1" fill="#f7df1e" />
              <circle cx="14" cy="7" r="1" fill="#22c55e" />
              {/* Light Canvas */}
              <rect x="5" y="11" width="22" height="15" rx="1.5" fill="#ffffff" />
              {/* Donut Chart */}
              <circle cx="10.5" cy="16" r="3" stroke="#000000" strokeWidth="1.5" fill="none" strokeDasharray="14 5" />
              <circle cx="10.5" cy="16" r="1" fill="#f7df1e" />
              {/* Data Bars */}
              <rect x="16" y="14" width="2" height="5" rx="0.5" fill="#000000" />
              <rect x="19" y="12" width="2" height="7" rx="0.5" fill="#f7df1e" />
              <rect x="22" y="15" width="2" height="4" rx="0.5" fill="#000000" />
              {/* Data rows */}
              <rect x="7" y="21.5" width="8" height="2" rx="0.5" fill="#e2e8f0" />
              <rect x="17" y="21.5" width="8" height="2" rx="0.5" fill="#94a3b8" />
            </svg>
          </button>

          {/* 3. LinkedIn Circle Icon */}
          <a
            id="header-linkedin-icon"
            href={PERSONAL_INFO.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            title="LinkedIn Profile"
            aria-label="Visit LinkedIn Profile"
            className="p-1 rounded-md transition-all hover:scale-105 active:scale-95 hover:bg-black/10 focus:outline-none"
          >
            <svg
              className="w-7 h-7 sm:w-8 sm:h-8 drop-shadow-xs"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="16" cy="16" r="14" fill="#000000" />
              <path
                d="M11 13.5h2.5V22H11v-8.5zm1.25-3.8a1.45 1.45 0 1 1 0 2.9 1.45 1.45 0 0 1 0-2.9zM15 13.5h2.4v1.2h.03c.33-.63 1.15-1.3 2.37-1.3 2.53 0 3 1.67 3 3.84V22h-2.5v-4.17c0-1-.02-2.28-1.39-2.28-1.39 0-1.6 1.09-1.6 2.21V22H15v-8.5z"
                fill="#f7df1e"
              />
            </svg>
          </a>

          {/* 4. GitHub Circle Icon */}
          <a
            id="header-github-icon"
            href={PERSONAL_INFO.github}
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub Profile"
            aria-label="Visit GitHub Profile"
            className="p-1 rounded-md transition-all hover:scale-105 active:scale-95 hover:bg-black/10 focus:outline-none"
          >
            <svg
              className="w-7 h-7 sm:w-8 sm:h-8 drop-shadow-xs"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="16" cy="16" r="14" fill="#000000" />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M16 5C9.925 5 5 9.925 5 16c0 4.86 3.152 8.983 7.525 10.437.55.1.75-.238.75-.53 0-.262-.01-1.127-.015-2.045-3.06.665-3.705-1.303-3.705-1.303-.5-1.272-1.222-1.61-1.222-1.61-.998-.682.076-.668.076-.668 1.104.077 1.685 1.134 1.685 1.134.981 1.68 2.573 1.195 3.2.914.1-.711.384-1.196.699-1.47-2.443-.278-5.012-1.222-5.012-5.437 0-1.2.428-2.182 1.132-2.95-.113-.278-.49-1.397.108-2.91 0 0 .923-.295 3.023 1.127.877-.244 1.817-.366 2.75-.371.933.005 1.873.127 2.75.371 2.1-1.422 3.02-1.127 3.02-1.127.6 1.513.223 2.632.11 2.91.706.768 1.13 1.75 1.13 2.95 0 4.226-2.573 5.155-5.024 5.428.395.34.747 1.01.747 2.036 0 1.47-.014 2.655-.014 3.016 0 .295.197.636.756.528C23.852 24.98 27 20.858 27 16c0-6.075-4.925-11-11-11z"
                fill="#ffffff"
              />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
};
