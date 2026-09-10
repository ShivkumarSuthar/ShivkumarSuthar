import React from 'react';
import { TabType, ProjectItem } from '../types';
import { PERSONAL_INFO } from '../data/portfolioData';
import { SkillsSection } from './SkillsSection';
import { RECENT_ROLE_PILLS } from './TechStackPills';
import { Check } from 'lucide-react';

interface HomeViewProps {
  onSelectTab: (tab: TabType) => void;
  onOpenProjectModal: (project: ProjectItem) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onSelectTab }) => {
  return (
    <div id="home-view-container" className="space-y-7 sm:space-y-8 w-full text-[var(--text-main)]">
      {/* 1. Availability Status Bar */}
      <div
        id="availability-banner"
        className="w-full py-2.5 sm:py-3 px-4 rounded-md bg-[#10b981] text-white flex items-center justify-center gap-2.5 shadow-sm font-medium text-sm sm:text-base tracking-normal"
      >
        <div className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center shrink-0 bg-transparent">
          <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
        </div>
        <span>I'm currently available for work</span>
      </div>

      {/* 2. Introduction to Me */}
      <section id="introduction-section" className="space-y-3.5">
        <h2 className="text-base sm:text-lg font-bold text-[var(--text-main)] tracking-tight">
          Introduction to me
        </h2>

        <p className="text-sm sm:text-[15px] leading-relaxed text-[var(--text-muted)] font-normal">
          {PERSONAL_INFO.bioParagraph1}
        </p>

        {/* Contact links directly on canvas */}
        <div className="space-y-2 pt-1 text-sm sm:text-[15px] text-[var(--text-muted)]">
          {/* Email row with letter envelope icon */}
          <div className="flex items-center gap-2.5">
            <svg
              className="w-5 h-4 shrink-0 text-[var(--color-link)]"
              viewBox="0 0 24 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <rect x="1" y="1" width="22" height="16" rx="2" fill="var(--bg-surface)" stroke="currentColor" strokeWidth="1.5" />
              <path d="M1 2L12 11L23 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>
              My personal email address is{' '}
              <a
                href={`mailto:${PERSONAL_INFO.email}`}
                className="text-[var(--color-link)] hover:underline font-semibold"
              >
                {PERSONAL_INFO.email}
              </a>
            </span>
          </div>

          {/* LinkedIn row with solid blue in circle */}
          <div className="flex items-center gap-2.5">
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="12" fill="#0077B5" />
              <path
                d="M7 9.5h2.5V18H7V9.5zm1.25-3.8a1.45 1.45 0 1 1 0 2.9 1.45 1.45 0 0 1 0-2.9zM11 9.5h2.4v1.2h.03c.33-.63 1.15-1.3 2.37-1.3 2.53 0 3 1.67 3 3.84V18h-2.5v-4.17c0-1-.02-2.28-1.39-2.28-1.39 0-1.6 1.09-1.6 2.21V18H11V9.5z"
                fill="#ffffff"
              />
            </svg>
            <a
              href={PERSONAL_INFO.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-link)] hover:underline font-semibold"
            >
              My LinkedIn profile can be viewed here
            </a>
          </div>
        </div>
      </section>

      {/* 3. My most recent role */}
      <section id="recent-role-section" className="space-y-3.5 pt-2">
        <h2 className="text-base sm:text-lg font-bold text-[var(--text-main)] tracking-tight">
          My most recent role
        </h2>

        <p className="text-sm sm:text-[15px] leading-relaxed text-[var(--text-muted)] font-normal">
          In{' '}
          <button
            onClick={() => onSelectTab('portfolio')}
            className="text-[var(--color-link)] hover:underline font-semibold cursor-pointer"
          >
            my most recent role
          </button>
          {' '}at Dev Technosys Pvt Ltd (May 2024 – Present), I spearheaded core frontend modules and dynamic UI features for the AIE South Africa university portal using Next.js, React, and TypeScript. I engineered modular, reusable UI component libraries utilizing Tailwind CSS and TanStack Query, reducing redundant code and speeding up development cycles. I executed root-cause debugging and Core Web Vitals optimization, reducing page load latency and improving overall platform stability, while collaborating with backend engineers to integrate RESTful endpoints and ensure strict API contracts.
        </p>

        <p className="text-sm sm:text-[15px] text-[var(--text-muted)] font-normal pt-1">
          The core tech-stack (although there were MANY more elements to the project) were:
        </p>

        {/* Tech Stack Pills matching user screenshot */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 pt-1.5">
          {RECENT_ROLE_PILLS.map((pill) => (
            <div
              key={pill.id}
              className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-white border border-[#cbd5e1] hover:border-[#3178c6] shadow-2xs hover:shadow-xs transition-all cursor-default"
            >
              {pill.icon}
              <span className="text-[13px] sm:text-sm font-medium text-[#1e293b] tracking-tight">
                {pill.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Skills Matrix Intro & Interactive Chart */}
      <section id="skills-matrix-wrapper" className="pt-2">
        <p className="text-sm sm:text-[15px] leading-relaxed text-[var(--text-muted)] font-normal mb-4">
          Below is an illustration of some of the technologies I'm using at the moment, along with a few of the other technologies I've used in the past. This list is constantly growing, as the front-end landscape continues to change and evolve from one year to the next.
        </p>
        <SkillsSection />
      </section>

      {/* 5. Four Feature Cards Grid (2x2) */}
      <section id="feature-cards-grid" className="pt-2 pb-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {/* Card 1: Curriculum Vitae */}
          <div
            id="home-card-cv"
            className="p-5 sm:p-6 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] shadow-2xs flex items-start gap-4 transition-all hover:border-[var(--color-link)]"
          >
            {/* CV Document Icon */}
            <svg
              className="w-11 h-11 sm:w-12 sm:h-12 shrink-0 drop-shadow-xs"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="5" y="3" width="22" height="26" rx="2" fill="#ffffff" stroke="#bfdbfe" strokeWidth="1.5" />
              <circle cx="16" cy="11" r="4.5" fill="var(--color-link)" />
              <text x="16" y="13" textAnchor="middle" fill="#ffffff" fontSize="6" fontWeight="bold" fontFamily="sans-serif">CV</text>
              <line x1="9" y1="18" x2="23" y2="18" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="9" y1="21.5" x2="23" y2="21.5" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="9" y1="25" x2="18" y2="25" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
            </svg>

            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-[var(--text-main)] tracking-tight">Curriculum Vitae</h3>
              <p className="text-xs sm:text-[13px] text-[var(--text-muted)] leading-relaxed mt-1">
                My latest CV is available to view and download via the links below, and includes my employment history up to Present.
              </p>
              <ul className="space-y-1.5 pt-3 text-xs sm:text-[13px]">
                <li className="flex items-center gap-1.5">
                  <span className="text-[var(--color-link)] font-bold">»</span>
                  <button
                    onClick={() => onSelectTab('cv')}
                    className="text-[var(--color-link)] hover:underline cursor-pointer text-left font-semibold"
                  >
                    View in HTML format
                  </button>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-[var(--color-link)] font-bold">»</span>
                  <button
                    onClick={() => onSelectTab('cv')}
                    className="text-[var(--color-link)] hover:underline cursor-pointer text-left font-semibold"
                  >
                    Download Microsoft Word version
                  </button>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-[var(--color-link)] font-bold">»</span>
                  <button
                    onClick={() => onSelectTab('cv')}
                    className="text-[var(--color-link)] hover:underline cursor-pointer text-left font-semibold"
                  >
                    Download PDF version
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Card 2: Online portfolio */}
          <div
            id="home-card-portfolio"
            className="p-5 sm:p-6 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] shadow-2xs flex items-start gap-4 transition-all hover:border-[var(--color-link)]"
          >
            {/* Online Portfolio Window Icon */}
            <svg
              className="w-11 h-11 sm:w-12 sm:h-12 shrink-0 drop-shadow-xs"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="3" y="4" width="26" height="24" rx="3" fill="#1d4ed8" />
              <rect x="3" y="4" width="26" height="6" rx="3" fill="#1e3a8a" />
              <circle cx="7" cy="7" r="1" fill="#ef4444" />
              <circle cx="10.5" cy="7" r="1" fill="#f7df1e" />
              <circle cx="14" cy="7" r="1" fill="#06b6d4" />
              <rect x="5" y="11" width="22" height="15" rx="1.5" fill="#ffffff" />
              <circle cx="10.5" cy="16" r="3" stroke="var(--color-link)" strokeWidth="1.5" fill="none" strokeDasharray="14 5" />
              <circle cx="10.5" cy="16" r="1" fill="#f7df1e" />
              <rect x="16" y="14" width="2" height="5" rx="0.5" fill="var(--color-link)" />
              <rect x="19" y="12" width="2" height="7" rx="0.5" fill="#06b6d4" />
              <rect x="22" y="15" width="2" height="4" rx="0.5" fill="#f7df1e" />
              <rect x="7" y="21.5" width="8" height="2" rx="0.5" fill="#cbd5e1" />
              <rect x="17" y="21.5" width="8" height="2" rx="0.5" fill="#94a3b8" />
            </svg>

            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-[var(--text-main)] tracking-tight">Online portfolio</h3>
              <p className="text-xs sm:text-[13px] text-[var(--text-muted)] leading-relaxed mt-1">
                My online portfolio showcases production web applications, client portals, and interactive 3D web experiences built over my <strong>3+</strong> years of commercial development.
              </p>
              <div className="pt-3 text-xs sm:text-[13px] flex items-center gap-1.5">
                <span className="text-[var(--color-link)] font-bold">»</span>
                <button
                  onClick={() => onSelectTab('portfolio')}
                  className="text-[var(--color-link)] hover:underline cursor-pointer text-left font-semibold"
                >
                  View my online portfolio
                </button>
              </div>
            </div>
          </div>

          {/* Card 3: LinkedIn recommendations */}
          <div
            id="home-card-recommendations"
            className="p-5 sm:p-6 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] shadow-2xs flex items-start gap-4 transition-all hover:border-[var(--color-link)]"
          >
            {/* LinkedIn Solid Blue Icon */}
            <svg
              className="w-11 h-11 sm:w-12 sm:h-12 shrink-0 drop-shadow-xs"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="16" cy="16" r="14" fill="#0077B5" />
              <path
                d="M11 13.5h2.5V22H11v-8.5zm1.25-3.8a1.45 1.45 0 1 1 0 2.9 1.45 1.45 0 0 1 0-2.9zM15 13.5h2.4v1.2h.03c.33-.63 1.15-1.3 2.37-1.3 2.53 0 3 1.67 3 3.84V22h-2.5v-4.17c0-1-.02-2.28-1.39-2.28-1.39 0-1.6 1.09-1.6 2.21V22H15v-8.5z"
                fill="#ffffff"
              />
            </svg>

            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-[var(--text-main)] tracking-tight">LinkedIn recommendations</h3>
              <p className="text-xs sm:text-[13px] text-[var(--text-muted)] leading-relaxed mt-1">
                Throughout my career, I've been fortunate to work with talented engineers, technical leads, and founders who have kindly provided recommendations of my technical abilities and problem-solving mindset.
              </p>
              <div className="pt-3 text-xs sm:text-[13px] flex items-center gap-1.5">
                <span className="text-[var(--color-link)] font-bold">»</span>
                <button
                  onClick={() => onSelectTab('recommendations')}
                  className="text-[var(--color-link)] hover:underline cursor-pointer text-left font-semibold"
                >
                  View my LinkedIn recommendations
                </button>
              </div>
            </div>
          </div>

          {/* Card 4: Code samples */}
          <div
            id="home-card-code-samples"
            className="p-5 sm:p-6 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] shadow-2xs flex items-start gap-4 transition-all hover:border-[var(--color-link)]"
          >
            {/* GitHub Round Icon */}
            <svg
              className="w-11 h-11 sm:w-12 sm:h-12 shrink-0 drop-shadow-xs"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="16" cy="16" r="14" fill="#0f172a" />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M16 7C11.029 7 7 11.03 7 16.002c0 3.978 2.58 7.352 6.158 8.542.45.083.613-.195.613-.434 0-.214-.008-.78-.012-1.532-2.504.544-3.033-1.207-3.033-1.207-.409-1.04-.999-1.317-.999-1.317-.817-.559.062-.547.062-.547.903.063 1.378.927 1.378.927.803 1.375 2.106.978 2.618.748.082-.582.314-.978.571-1.203-1.999-.228-4.1-.999-4.1-4.45 0-.983.351-1.787.926-2.417-.093-.228-.401-1.144.088-2.383 0 0 .756-.242 2.476.923A8.618 8.618 0 0116 11.353c.767.004 1.539.103 2.259.303 1.718-1.165 2.473-.923 2.473-.923.491 1.239.183 2.155.09 2.383.576.63.924 1.434.924 2.417 0 3.46-2.104 4.219-4.109 4.442.323.278.611.828.611 1.669 0 1.205-.011 2.177-.011 2.472 0 .241.161.522.618.433C22.424 23.35 25 19.978 25 16.002 25 11.03 20.971 7 16 7z"
                fill="#ffffff"
              />
            </svg>

            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-[var(--text-main)] tracking-tight">Code samples</h3>
              <p className="text-xs sm:text-[13px] text-[var(--text-muted)] leading-relaxed mt-1">
                Whilst a number of the projects I work on are subject to NDAs, I've put together a reasonably large set of code within my GitHub profile, covering a wide range of technologies and project types.
              </p>
              <ul className="space-y-1.5 pt-3 text-xs sm:text-[13px]">
                <li className="flex items-center gap-1.5">
                  <span className="text-[var(--color-link)] font-bold">»</span>
                  <button
                    onClick={() => onSelectTab('code-samples')}
                    className="text-[var(--color-link)] hover:underline cursor-pointer text-left font-semibold"
                  >
                    View my code samples by contract / project
                  </button>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-[var(--color-link)] font-bold">»</span>
                  <button
                    onClick={() => onSelectTab('code-samples')}
                    className="text-[var(--color-link)] hover:underline cursor-pointer text-left font-semibold"
                  >
                    View my code samples by programming language
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
