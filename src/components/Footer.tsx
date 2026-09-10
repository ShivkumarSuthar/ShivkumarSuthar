import React from 'react';
import { TabType } from '../types';
import { PERSONAL_INFO } from '../data/portfolioData';
import { ArrowUp, Mail, Phone, Linkedin, Github, Globe } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: TabType) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      id="main-footer"
      className="no-print border-t transition-colors duration-200 w-full"
      style={{
        backgroundColor: 'var(--bg-surface-elevated)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <div className="w-full px-5 sm:px-8 py-8 sm:py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b border-[var(--border-subtle)]">
          <div>
            <h3 className="text-lg font-bold text-[var(--text-main)]">{PERSONAL_INFO.name}</h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              {PERSONAL_INFO.title} • Specializing in React, Next.js, and Full-Stack Engineering
            </p>
          </div>

          <button
            onClick={scrollToTop}
            id="footer-back-to-top"
            className="self-start sm:self-auto flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border border-[var(--border-subtle)] hover:bg-[var(--bg-surface)] text-[var(--text-main)] transition-colors"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5 text-[#2563eb]" />
          </button>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[var(--text-muted)]">
          <div className="flex flex-wrap items-center gap-4">
            <button onClick={() => onSelectTab('home')} className="hover:text-[#2563eb] transition-colors">
              Home
            </button>
            <button onClick={() => onSelectTab('cv')} className="hover:text-[#2563eb] transition-colors">
              Curriculum Vitae
            </button>
            <button onClick={() => onSelectTab('portfolio')} className="hover:text-[#2563eb] transition-colors">
              Portfolio
            </button>
            <button onClick={() => onSelectTab('recommendations')} className="hover:text-[#2563eb] transition-colors">
              Recommendations
            </button>
            <button onClick={() => onSelectTab('code-samples')} className="hover:text-[#2563eb] transition-colors">
              Code samples
            </button>
          </div>

          <div>
            © {new Date().getFullYear()} Shivkumar Suthar. Built with Next.js & React architecture.
          </div>
        </div>
      </div>
    </footer>
  );
};
