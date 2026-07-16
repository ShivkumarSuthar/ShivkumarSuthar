/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, FolderOpen, Search, LogOut, Library, Compass, Users, BarChart3, ChevronDown, HelpCircle } from 'lucide-react';
import { ThemeColors } from '../../types';

interface CMSHeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  colors: ThemeColors;
  themeMode: 'light' | 'dark';
  onSearchClick: () => void;
  onExitCMS: () => void;
  streak: number;
}

export default function CMSHeader({
  currentTab,
  onTabChange,
  colors,
  themeMode,
  onSearchClick,
  onExitCMS,
  streak
}: CMSHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const dropdownTabs = [
    { id: 'spaces', name: 'Study Workspace', icon: FolderOpen, desc: 'Manage study modules, lessons, custom notes, and local checklists' },
    { id: 'library', name: 'Resource Library', icon: Library, desc: 'Browse saved online articles, tutorial links, and textbook references' },
    { id: 'roadmaps', name: 'Roadmaps & Guides', icon: Compass, desc: 'Step-by-step interactive paths for complex technical domains' },
    { id: 'mentors', name: 'AI Mentors Space', icon: Users, desc: 'Discuss custom lessons and clarify quizzes with AI specialty tutors' },
    { id: 'analytics', name: 'Progress Metrics', icon: BarChart3, desc: 'Review active streaks, hour heatmaps, and test analytics' },
  ];

  const activeDropdownTab = dropdownTabs.find(tab => tab.id === currentTab);
  const isDropdownActive = !!activeDropdownTab;

  // Handle clicks outside the dropdown to close it securely
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const themeBorder = themeMode === 'light' ? 'border-zinc-200' : 'border-zinc-800/80';
  const themeCardBg = themeMode === 'light' ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-900 border-zinc-800/80';

  return (
    <div className={`sticky top-[72px] z-30 w-full border-b ${themeBorder} ${themeMode === 'light' ? 'bg-white/90' : 'bg-zinc-950/90'} backdrop-blur-md transition-all duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Sub Navigation Links - Clean Segmented Control: Dashboard vs Dropdown */}
        <div className="w-full lg:flex-1 lg:max-w-xl">
          <div className={`grid grid-cols-2 gap-1 p-1 rounded-2xl ${
            themeMode === 'light' 
              ? 'bg-zinc-100/80 border border-zinc-200/60' 
              : 'bg-zinc-900/60 border border-zinc-800/40'
          }`}>
            {/* 1. Dashboard Tab */}
            <button
              onClick={() => {
                onTabChange('dashboard');
                setIsDropdownOpen(false);
              }}
              title="Return to the learning overview dashboard"
              className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold font-mono tracking-tight transition-all duration-200 cursor-pointer ${
                currentTab === 'dashboard'
                  ? themeMode === 'light'
                    ? 'bg-white text-zinc-950 shadow-sm border border-zinc-200/50 font-bold'
                    : 'bg-zinc-950 text-zinc-100 shadow-md border border-zinc-800/80 font-bold'
                  : themeMode === 'light'
                  ? 'text-zinc-500 hover:text-zinc-900 hover:bg-white/40'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/30'
              }`}
            >
              <BookOpen className={`w-3.5 h-3.5 shrink-0 transition-colors ${currentTab === 'dashboard' ? 'text-indigo-400' : 'text-zinc-500'}`} />
              <span>Dashboard</span>
            </button>

            {/* 2. Workspace Tools Dropdown Trigger */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                title="Explore and switch learning workspace modules"
                className={`w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold font-mono tracking-tight transition-all duration-200 cursor-pointer ${
                  isDropdownActive
                    ? themeMode === 'light'
                      ? 'bg-white text-zinc-950 shadow-sm border border-zinc-200/50 font-bold'
                      : 'bg-zinc-950 text-zinc-100 shadow-md border border-zinc-800/80 font-bold'
                    : themeMode === 'light'
                    ? 'text-zinc-500 hover:text-zinc-900 hover:bg-white/40'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/30'
                }`}
              >
                {activeDropdownTab ? (
                  <>
                    <activeDropdownTab.icon className="w-3.5 h-3.5 shrink-0 text-indigo-400" />
                    <span className="truncate">{activeDropdownTab.name}</span>
                  </>
                ) : (
                  <>
                    <FolderOpen className="w-3.5 h-3.5 shrink-0 text-zinc-500" />
                    <span className="truncate">Learning Modules</span>
                  </>
                )}
                <ChevronDown className={`w-3.5 h-3.5 shrink-0 ml-auto text-zinc-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Absolute Dropdown List */}
              {isDropdownOpen && (
                <div className={`absolute top-full right-0 sm:left-0 mt-2 w-[280px] sm:w-[320px] rounded-2xl border p-2 shadow-2xl z-50 animate-fade-in ${
                  themeMode === 'light'
                    ? 'bg-white border-zinc-200'
                    : 'bg-zinc-900 border-zinc-800/80 shadow-zinc-950/50'
                }`}>
                  <div className="px-2 py-1.5 border-b border-zinc-800/10 mb-1 flex items-center justify-between">
                    <span className="text-[10px] font-bold font-mono text-zinc-400 uppercase tracking-wider">Select Active Tool</span>
                    <span title="Click any item to switch your current study mode view">
                      <HelpCircle className="w-3.5 h-3.5 text-zinc-500" />
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 max-h-[360px] overflow-y-auto scrollbar-thin">
                    {dropdownTabs.map((tab) => {
                      const Icon = tab.icon;
                      const isActive = currentTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => {
                            onTabChange(tab.id);
                            setIsDropdownOpen(false);
                          }}
                          title={`Switch view to ${tab.name}: ${tab.desc}`}
                          className={`flex items-start gap-3 p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                            isActive
                              ? themeMode === 'light'
                                ? 'bg-indigo-50/70 border border-indigo-100'
                                : 'bg-indigo-500/10 border border-indigo-500/20'
                              : themeMode === 'light'
                              ? 'hover:bg-zinc-50 border border-transparent'
                              : 'hover:bg-zinc-800/50 border border-transparent'
                          }`}
                        >
                          <div className={`p-1.5 rounded-lg shrink-0 ${
                            isActive
                              ? 'bg-indigo-500 text-white'
                              : themeMode === 'light'
                              ? 'bg-zinc-100 text-zinc-600'
                              : 'bg-zinc-800 text-zinc-400'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex flex-col gap-0.5 min-w-0">
                            <span className={`text-xs font-semibold ${
                              isActive
                                ? 'text-indigo-400'
                                : themeMode === 'light'
                                ? 'text-zinc-800'
                                : 'text-zinc-200'
                            }`}>
                              {tab.name}
                            </span>
                            <span className="text-[10px] text-zinc-400 leading-normal truncate-2-lines line-clamp-2">
                              {tab.desc}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions & Exit */}
        <div className="flex items-center justify-between lg:justify-end gap-3 w-full lg:w-auto border-t lg:border-t-0 pt-3 lg:pt-0 border-zinc-800/10 shrink-0">
          {/* Streak Indicator */}
          <div 
            id="cms-streak-indicator" 
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-mono select-none"
          >
            <span className="animate-pulse">🔥</span>
            <span>{streak} Days Streak</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Command Palette Button */}
            <button
              id="cms-quick-search-btn"
              onClick={onSearchClick}
              className={`p-2 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${themeCardBg} ${
                themeMode === 'light' ? 'hover:bg-zinc-100 hover:text-zinc-950' : 'hover:bg-zinc-800 hover:text-zinc-100'
              }`}
              title="Search and Command Palette (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-zinc-400" />
            </button>

            {/* Exit CMS button */}
            <button
              onClick={onExitCMS}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border cursor-pointer transition-all ${
                themeMode === 'light'
                  ? 'bg-zinc-100 hover:bg-zinc-200 border-zinc-200 text-zinc-800 hover:text-zinc-950'
                  : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800/80 text-zinc-300 hover:text-zinc-100'
              }`}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit Workspace</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
