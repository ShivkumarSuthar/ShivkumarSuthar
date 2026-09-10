import React, { useEffect } from 'react';
import { TabType } from '../types';
import { PERSONAL_INFO } from '../data/portfolioData';
import {
  Home,
  FileText,
  Briefcase,
  ThumbsUp,
  Code2,
  Mail,
  Phone,
  Linkedin,
  Github,
  Globe,
  X,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  isOpen,
  onClose,
  currentTab,
  onSelectTab,
}) => {
  // Close drawer on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const navItems: { tab: TabType; label: string; icon: React.ReactNode; description: string }[] = [
    {
      tab: 'home',
      label: 'Home',
      icon: <Home className="w-5 h-5 text-[#2563eb]" />,
      description: 'Introduction, current role, core tech stack',
    },
    {
      tab: 'cv',
      label: 'Curriculum Vitae',
      icon: <FileText className="w-5 h-5 text-[#2563eb]" />,
      description: 'Complete commercial history, skills & education',
    },
    {
      tab: 'portfolio',
      label: 'Portfolio',
      icon: <Briefcase className="w-5 h-5 text-[#2563eb]" />,
      description: 'Commercial ecosystems, 3D experiences & products',
    },
    {
      tab: 'recommendations',
      label: 'Recommendations',
      icon: <ThumbsUp className="w-5 h-5 text-[#2563eb]" />,
      description: 'Endorsements from leads, architects & clients',
    },
    {
      tab: 'code-samples',
      label: 'Code samples',
      icon: <Code2 className="w-5 h-5 text-[#2563eb]" />,
      description: 'Architecture patterns in Next.js, GSAP & TanStack',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        id="drawer-backdrop"
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300"
      />

      {/* Drawer Panel */}
      <div
        id="navigation-drawer-panel"
        className="relative w-full max-w-md bg-[#f8fafc] text-[var(--text-main)] shadow-2xl flex flex-col h-full z-10 border-r border-slate-200 overflow-y-auto"
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-[var(--border-subtle)] bg-[var(--bg-header)] text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#38bdf8] pulse-dot"></span>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#f8fafc]">
                Available for work
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">{PERSONAL_INFO.name}</h2>
            <p className="text-xs text-[#94a3b8]">{PERSONAL_INFO.title} • 3+ Years Exp</p>
          </div>
          <button
            id="drawer-close-button"
            onClick={onClose}
            aria-label="Close navigation"
            className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="p-6 flex-1">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-subtle)] mb-3">
            Menu Navigation
          </p>
          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = currentTab === item.tab;
              return (
                <button
                  key={item.tab}
                  id={`nav-link-${item.tab}`}
                  onClick={() => {
                    onSelectTab(item.tab);
                    onClose();
                  }}
                  className={`w-full text-left p-3.5 rounded-xl transition-all flex items-center justify-between border ${
                    isActive
                      ? 'bg-[#eff6ff] border-[#2563eb] text-[#2563eb] font-bold shadow-xs'
                      : 'hover:bg-slate-200 border-transparent text-[var(--text-main)]'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`p-2 rounded-lg ${
                        isActive
                          ? 'bg-[#2563eb] text-white'
                          : 'bg-slate-200 text-[var(--text-muted)]'
                      }`}
                    >
                      {React.cloneElement(item.icon as React.ReactElement<{ className?: string }>, {
                        className: `w-5 h-5 ${isActive ? 'text-white' : 'text-[#2563eb]'}`
                      })}
                    </div>
                    <div>
                      <div className="text-sm font-semibold flex items-center gap-2">
                        {item.label}
                        {isActive && (
                          <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[#2563eb] text-white font-bold">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-[var(--text-muted)] mt-0.5">{item.description}</div>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${
                      isActive ? 'text-[#2563eb] translate-x-1' : 'text-[var(--text-subtle)]'
                    }`}
                  />
                </button>
              );
            })}
          </nav>

          {/* Contact Direct Links */}
          <div className="mt-8 pt-6 border-t border-[var(--border-subtle)]">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-subtle)] mb-3">
              Direct Contact
            </p>
            <div className="space-y-2.5 text-xs text-[var(--text-muted)]">
              <a
                id="drawer-contact-email"
                href={`mailto:${PERSONAL_INFO.email}`}
                className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-200 text-[var(--text-main)] transition-colors"
              >
                <Mail className="w-4 h-4 text-[#2563eb]" />
                <span className="font-medium truncate">{PERSONAL_INFO.email}</span>
              </a>
              <a
                id="drawer-contact-phone"
                href={`tel:${PERSONAL_INFO.phone}`}
                className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-200 text-[var(--text-main)] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#2563eb]" />
                <span className="font-medium">{PERSONAL_INFO.phone}</span>
              </a>
              <a
                id="drawer-contact-website"
                href={PERSONAL_INFO.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-200 text-[var(--text-main)] transition-colors"
              >
                <Globe className="w-4 h-4 text-[#2563eb]" />
                <span className="font-medium truncate">{PERSONAL_INFO.website}</span>
                <ExternalLink className="w-3.5 h-3.5 ml-auto text-[var(--text-subtle)]" />
              </a>
              <a
                id="drawer-contact-linkedin"
                href={PERSONAL_INFO.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-200 text-[var(--text-main)] transition-colors"
              >
                <Linkedin className="w-4 h-4 text-[#2563eb]" />
                <span className="font-medium">LinkedIn Profile</span>
                <ExternalLink className="w-3.5 h-3.5 ml-auto text-[var(--text-subtle)]" />
              </a>
              <a
                id="drawer-contact-github"
                href={PERSONAL_INFO.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-200 text-[var(--text-main)] transition-colors"
              >
                <Github className="w-4 h-4 text-[var(--text-main)]" />
                <span className="font-medium">GitHub Code Repositories</span>
                <ExternalLink className="w-3.5 h-3.5 ml-auto text-[var(--text-subtle)]" />
              </a>
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-5 border-t border-slate-200 bg-slate-100 flex items-center justify-between">
          <div className="text-xs text-[var(--text-muted)]">
            Location: <span className="font-medium text-[var(--text-main)]">{PERSONAL_INFO.location}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#eff6ff] text-[#1d4ed8] border border-[#bfdbfe]">
            <Sparkles className="w-3.5 h-3.5 text-[#2563eb]" />
            <span>Open to Work</span>
          </div>
        </div>
      </div>
    </div>
  );
};
