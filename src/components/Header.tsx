/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PortfolioData, ThemeColors } from '../types';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { animate } from 'motion/react';

interface HeaderProps {
  data: PortfolioData;
  colors: ThemeColors;
  themeMode: 'light' | 'dark';
  onToggleTheme: () => void;
  currentView: 'portfolio' | 'cms';
  onViewChange: (view: 'portfolio' | 'cms') => void;
}

export default function Header({
  data,
  colors,
  themeMode,
  onToggleTheme,
  currentView,
  onViewChange
}: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const targetY = el.getBoundingClientRect().top + window.scrollY;
      const offset = 80;
      const finalY = Math.max(0, targetY - offset);
      
      animate(window.scrollY, finalY, {
        duration: 1.0,
        ease: [0.16, 1, 0.3, 1], // Custom ultra-smooth cubic-bezier (easeOutExpo equivalent)
        onUpdate: (latest) => window.scrollTo(0, latest)
      });
    }
  };

  const handleScrollToTop = () => {
    animate(window.scrollY, 0, {
      duration: 1.0,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => window.scrollTo(0, latest)
    });
  };

  const handleNav = (id: string) => {
    setMobileMenuOpen(false);
    if (currentView !== 'portfolio') {
      onViewChange('portfolio');
      setTimeout(() => {
        handleScrollTo(id);
      }, 150);
    } else {
      handleScrollTo(id);
    }
  };

  const glowDotColor = colors.accent.includes('amber')
    ? 'bg-amber-400'
    : colors.accent.includes('emerald')
    ? 'bg-emerald-400'
    : colors.accent.includes('indigo')
    ? 'bg-indigo-400'
    : colors.accent.includes('rose')
    ? 'bg-rose-400'
    : 'bg-zinc-400';

  return (
    <header 
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        scrolled 
          ? 'py-3' 
          : 'py-5'
      }`}
    >
      <div 
        className="max-w-[90rem] mx-auto px-6 transition-all duration-300"
      >
        <div 
          className={`transition-all duration-300 flex items-center justify-between w-full relative ${
            scrolled 
              ? themeMode === 'light'
                ? 'bg-white/85 backdrop-blur-xl border border-zinc-200/60 shadow-[0_8px_30px_rgba(0,0,0,0.06)] rounded-2xl py-3 px-6'
                : 'bg-zinc-950/75 backdrop-blur-xl border border-zinc-900/60 shadow-[0_8px_30px_rgba(0,0,0,0.4)] rounded-2xl py-3 px-6' 
              : 'bg-transparent py-2'
          }`}
        >
          {/* Logo */}
          <div 
            onClick={() => {
              setMobileMenuOpen(false);
              if (currentView !== 'portfolio') {
                onViewChange('portfolio');
                setTimeout(handleScrollToTop, 150);
              } else {
                handleScrollToTop();
              }
            }}
            className="cursor-pointer select-none group flex items-center gap-2.5"
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-300 group-hover:scale-105 shadow-inner ${
              themeMode === 'light'
                ? 'bg-zinc-100 border-zinc-200/80 group-hover:border-zinc-300'
                : 'bg-zinc-900 border-zinc-800/80 group-hover:border-zinc-700/80'
            }`}>
              <span className={`text-xs font-mono font-bold uppercase transition-colors ${colors.accent}`}>
                {data.personal.name.charAt(0)}
              </span>
            </div>
            <span className={`font-display font-semibold text-sm tracking-tight transition-colors ${
              themeMode === 'light' ? 'text-zinc-900 group-hover:text-zinc-700' : 'text-zinc-100 group-hover:text-zinc-300'
            }`}>
              {data.personal.name}
            </span>
          </div>

          {/* Navigation Actions */}
          <div className="flex items-center gap-3 md:gap-6">
            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-7 text-xs font-mono">
              <button 
                onClick={() => handleNav('about')} 
                className={`${
                  currentView === 'portfolio' && window.location.hash === '#about'
                    ? 'text-zinc-900 dark:text-zinc-100 font-semibold'
                    : themeMode === 'light' ? 'text-zinc-600 hover:text-zinc-900' : 'text-zinc-400 hover:text-zinc-100'
                } transition-all cursor-pointer select-none relative group py-1`}
              >
                <span>About</span>
                <span className={`absolute bottom-0 left-0 w-0 h-[2px] transition-all duration-300 group-hover:w-full ${glowDotColor}`} />
              </button>
              <button 
                onClick={() => handleNav('projects')} 
                className={`${
                  currentView === 'portfolio' && window.location.hash === '#projects'
                    ? 'text-zinc-900 dark:text-zinc-100 font-semibold'
                    : themeMode === 'light' ? 'text-zinc-600 hover:text-zinc-900' : 'text-zinc-400 hover:text-zinc-100'
                } transition-all cursor-pointer select-none relative group py-1`}
              >
                <span>Work</span>
                <span className={`absolute bottom-0 left-0 w-0 h-[2px] transition-all duration-300 group-hover:w-full ${glowDotColor}`} />
              </button>
              <button 
                onClick={() => handleNav('skills')} 
                className={`${
                  currentView === 'portfolio' && window.location.hash === '#skills'
                    ? 'text-zinc-900 dark:text-zinc-100 font-semibold'
                    : themeMode === 'light' ? 'text-zinc-600 hover:text-zinc-900' : 'text-zinc-400 hover:text-zinc-100'
                } transition-all cursor-pointer select-none relative group py-1`}
              >
                <span>Skills</span>
                <span className={`absolute bottom-0 left-0 w-0 h-[2px] transition-all duration-300 group-hover:w-full ${glowDotColor}`} />
              </button>
              <button 
                onClick={() => handleNav('contact')} 
                className={`${
                  currentView === 'portfolio' && window.location.hash === '#contact'
                    ? 'text-zinc-900 dark:text-zinc-100 font-semibold'
                    : themeMode === 'light' ? 'text-zinc-600 hover:text-zinc-900' : 'text-zinc-400 hover:text-zinc-100'
                } transition-all cursor-pointer select-none relative group py-1`}
              >
                <span>Contact</span>
                <span className={`absolute bottom-0 left-0 w-0 h-[2px] transition-all duration-300 group-hover:w-full ${glowDotColor}`} />
              </button>

              <button 
                onClick={() => onViewChange('cms')} 
                className={`${
                  currentView === 'cms'
                    ? 'text-indigo-400 font-bold scale-105'
                    : themeMode === 'light' ? 'text-zinc-600 hover:text-zinc-900' : 'text-zinc-400 hover:text-zinc-100'
                } transition-all cursor-pointer select-none relative group py-1 flex items-center gap-1`}
              >
                <span>Learning CMS</span>
                {currentView === 'cms' ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                ) : (
                  <span className={`absolute bottom-0 left-0 w-0 h-[2px] transition-all duration-300 group-hover:w-full bg-indigo-500`} />
                )}
              </button>
            </nav>

            <div className={`h-4 w-px hidden md:block ${themeMode === 'light' ? 'bg-zinc-200' : 'bg-zinc-800/80'}`} />

            {/* Light / Dark Mode Toggle Button */}
            <button
              onClick={onToggleTheme}
              className={`p-2 rounded-xl border transition-all duration-300 cursor-pointer select-none shadow-sm flex items-center justify-center ${
                themeMode === 'light'
                  ? 'bg-zinc-100 text-zinc-800 border-zinc-200 hover:bg-zinc-200 hover:text-zinc-950 hover:border-zinc-300'
                  : 'bg-zinc-900 text-zinc-300 border-zinc-800/80 hover:bg-zinc-800/80 hover:text-zinc-100 hover:border-zinc-700/80'
              }`}
              title={`Switch to ${themeMode === 'light' ? 'Dark' : 'Light'} Mode`}
              id="theme-toggler-btn"
            >
              {themeMode === 'light' ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400" />
              )}
            </button>

            {/* Mobile Nav Trigger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-xl border md:hidden transition-all duration-300 cursor-pointer select-none flex items-center justify-center ${
                themeMode === 'light'
                  ? 'bg-zinc-100 text-zinc-800 border-zinc-200 hover:bg-zinc-200 hover:text-zinc-950'
                  : 'bg-zinc-900 text-zinc-300 border-zinc-800/80 hover:bg-zinc-800/80 hover:text-zinc-100'
              }`}
              aria-label="Toggle navigation menu"
              id="mobile-nav-toggle-btn"
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Mobile Menu Dropdown Panel */}
          {mobileMenuOpen && (
            <div className={`absolute top-full left-0 right-0 mt-2 p-5 rounded-2xl border shadow-xl flex flex-col gap-4.5 md:hidden z-50 animate-scale-up ${
              themeMode === 'light'
                ? 'bg-white/95 border-zinc-200 shadow-zinc-200/50 backdrop-blur-xl'
                : 'bg-zinc-950/95 border-zinc-900 shadow-black/80 backdrop-blur-xl'
            }`}>
              <div className="flex flex-col gap-3 text-xs font-mono">
                <button 
                  onClick={() => handleNav('about')} 
                  className={`text-left py-2 px-3 rounded-lg transition-colors cursor-pointer ${
                    themeMode === 'light' ? 'hover:bg-zinc-100 text-zinc-700' : 'hover:bg-zinc-900 text-zinc-300'
                  }`}
                >
                  About
                </button>
                <button 
                  onClick={() => handleNav('projects')} 
                  className={`text-left py-2 px-3 rounded-lg transition-colors cursor-pointer ${
                    themeMode === 'light' ? 'hover:bg-zinc-100 text-zinc-700' : 'hover:bg-zinc-900 text-zinc-300'
                  }`}
                >
                  Work
                </button>
                <button 
                  onClick={() => handleNav('skills')} 
                  className={`text-left py-2 px-3 rounded-lg transition-colors cursor-pointer ${
                    themeMode === 'light' ? 'hover:bg-zinc-100 text-zinc-700' : 'hover:bg-zinc-900 text-zinc-300'
                  }`}
                >
                  Skills
                </button>
                <button 
                  onClick={() => handleNav('contact')} 
                  className={`text-left py-2 px-3 rounded-lg transition-colors cursor-pointer ${
                    themeMode === 'light' ? 'hover:bg-zinc-100 text-zinc-700' : 'hover:bg-zinc-900 text-zinc-300'
                  }`}
                >
                  Contact
                </button>

                <div className={`h-px w-full ${themeMode === 'light' ? 'bg-zinc-100' : 'bg-zinc-900'}`} />

                <button 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onViewChange('cms');
                  }} 
                  className={`text-left py-2.5 px-3 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-between ${
                    currentView === 'cms'
                      ? 'bg-indigo-500/10 text-indigo-400'
                      : 'text-zinc-300 hover:text-indigo-400'
                  }`}
                >
                  <span>Learning CMS Workspace</span>
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
