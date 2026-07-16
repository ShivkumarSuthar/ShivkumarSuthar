/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Search, BookOpen, Library, Award, FileText, CheckCircle2, Bookmark, FolderOpen, Milestone, LogOut } from 'lucide-react';
import { CMSData, StudySpace, Lesson, Bookmark as CMSBookmark } from '../../types/cms';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  cmsData: CMSData;
  onNavigateSpace: (spaceId: string) => void;
  onNavigateTab: (tabId: string) => void;
  onExitCMS: () => void;
  themeMode: 'light' | 'dark';
}

interface SearchResult {
  id: string;
  type: 'space' | 'lesson' | 'note' | 'resource' | 'bookmark' | 'shortcut';
  title: string;
  subtitle?: string;
  action: () => void;
}

export default function CommandPalette({
  isOpen,
  onClose,
  cmsData,
  onNavigateSpace,
  onNavigateTab,
  onExitCMS,
  themeMode
}: CommandPaletteProps) {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener for Cmd+K / Ctrl+K
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  // Prevent background scroll when open
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

  // Flatten searchable data
  const results: SearchResult[] = [];

  // Group 1: Shortcuts
  const shortcuts: SearchResult[] = [
    { id: 'sc-dash', type: 'shortcut', title: 'Go to Dashboard', subtitle: 'Navigation Shortcut', action: () => { onNavigateTab('dashboard'); onClose(); } },
    { id: 'sc-spaces', type: 'shortcut', title: 'Go to Study Spaces', subtitle: 'Navigation Shortcut', action: () => { onNavigateTab('spaces'); onClose(); } },
    { id: 'sc-lib', type: 'shortcut', title: 'Go to Resource Library', subtitle: 'Navigation Shortcut', action: () => { onNavigateTab('library'); onClose(); } },
    { id: 'sc-road', type: 'shortcut', title: 'Go to Roadmaps', subtitle: 'Navigation Shortcut', action: () => { onNavigateTab('roadmaps'); onClose(); } },
    { id: 'sc-ment', type: 'shortcut', title: 'Go to Mentors Tracker', subtitle: 'Navigation Shortcut', action: () => { onNavigateTab('mentors'); onClose(); } },
    { id: 'sc-anal', type: 'shortcut', title: 'Go to Analytics & History', subtitle: 'Navigation Shortcut', action: () => { onNavigateTab('analytics'); onClose(); } },
    { id: 'sc-exit', type: 'shortcut', title: 'Exit Learning Workspace', subtitle: 'Return to Portfolio', action: () => { onExitCMS(); onClose(); } },
  ];

  results.push(...shortcuts);

  // Group 2: Study Spaces
  cmsData.studySpaces.forEach(space => {
    results.push({
      id: `space-${space.id}`,
      type: 'space',
      title: space.title,
      subtitle: `Study Space • ${space.category} • ${space.difficulty}`,
      action: () => { onNavigateSpace(space.id); onClose(); }
    });

    // Group 3: Lessons & Notes inside spaces
    space.modules.forEach(mod => {
      mod.chapters.forEach(chap => {
        chap.lessons.forEach(les => {
          results.push({
            id: `les-${les.id}`,
            type: 'lesson',
            title: les.title,
            subtitle: `Lesson in ${space.title} • ${les.completed ? 'Completed' : 'In Progress'}`,
            action: () => { onNavigateSpace(space.id); onClose(); } // We can trigger Space Details to open this lesson
          });

          if (les.notes && les.notes.trim() !== '') {
            results.push({
              id: `note-${les.id}`,
              type: 'note',
              title: `Notes: ${les.title}`,
              subtitle: `Saved notes inside ${space.title}`,
              action: () => { onNavigateSpace(space.id); onClose(); }
            });
          }
        });
      });
    });
  });

  // Group 4: Bookmarks
  cmsData.bookmarks.forEach(bm => {
    results.push({
      id: `bm-${bm.id}`,
      type: 'bookmark',
      title: bm.title,
      subtitle: `Bookmark • ${bm.type.toUpperCase()} • Folder: ${bm.folderName || 'General'}`,
      action: () => {
        if (bm.url) window.open(bm.url, '_blank', 'noopener,noreferrer');
        onClose();
      }
    });
  });

  // Filter based on search query
  const filteredResults = results.filter(res => {
    const query = search.toLowerCase();
    return (
      res.title.toLowerCase().includes(query) ||
      (res.subtitle && res.subtitle.toLowerCase().includes(query)) ||
      res.type.toLowerCase().includes(query)
    );
  });

  // Handle Keyboard Navigation inside the Command Palette
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredResults.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredResults.length) % Math.max(1, filteredResults.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredResults[selectedIndex]) {
        filteredResults[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  // Reset index on search change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setSelectedIndex(0);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'space': return <FolderOpen className="w-4 h-4 text-indigo-400" />;
      case 'lesson': return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'note': return <FileText className="w-4 h-4 text-amber-400" />;
      case 'bookmark': return <Bookmark className="w-4 h-4 text-rose-400" />;
      case 'shortcut': return <Milestone className="w-4 h-4 text-sky-400" />;
      default: return <Search className="w-4 h-4 text-zinc-400" />;
    }
  };

  const modalBg = themeMode === 'light' ? 'bg-white border-zinc-200' : 'bg-zinc-950 border-zinc-900';
  const overlayBg = themeMode === 'light' ? 'bg-black/20' : 'bg-black/60';

  return (
    <div className={`fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4 ${overlayBg} backdrop-blur-sm transition-all duration-200`}>
      <div
        ref={containerRef}
        onKeyDown={handleKeyDown}
        className={`w-full max-w-lg rounded-2xl border shadow-2xl flex flex-col overflow-hidden max-h-[60vh] ${modalBg}`}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-zinc-800/10">
          <Search className="w-4 h-4 text-zinc-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command, study space, or bookmark to search..."
            value={search}
            onChange={handleSearchChange}
            className="w-full bg-transparent text-sm border-none outline-none focus:ring-0 text-zinc-200 placeholder-zinc-500"
          />
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-zinc-500 bg-zinc-900 border border-zinc-800 rounded">
            <span>ESC</span>
          </kbd>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
          {filteredResults.length === 0 ? (
            <div className="py-12 text-center">
              <Search className="w-8 h-8 text-zinc-600 mx-auto mb-2 animate-pulse" />
              <p className="text-xs text-zinc-400">No matching search results found.</p>
              <p className="text-[10px] text-zinc-500 mt-0.5">Try searching for keywords like 'react', 'leetcode', or navigation shortcuts.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-0.5">
              {filteredResults.map((result, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <button
                    key={result.id}
                    onClick={result.action}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex items-center justify-between w-full text-left px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                      isSelected
                        ? themeMode === 'light'
                          ? 'bg-zinc-100 text-zinc-900'
                          : 'bg-zinc-900 text-zinc-100'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-1.5 rounded-lg shrink-0 ${
                        isSelected 
                          ? themeMode === 'light' ? 'bg-zinc-200' : 'bg-zinc-800' 
                          : 'bg-zinc-900/30'
                      }`}>
                        {getIcon(result.type)}
                      </div>
                      <div className="min-w-0">
                        <p className={`text-xs font-medium truncate ${
                          isSelected 
                            ? themeMode === 'light' ? 'text-zinc-950 font-semibold' : 'text-zinc-100 font-semibold' 
                            : themeMode === 'light' ? 'text-zinc-700' : 'text-zinc-300'
                        }`}>
                          {result.title}
                        </p>
                        {result.subtitle && (
                          <p className="text-[10px] text-zinc-500 truncate mt-0.5">
                            {result.subtitle}
                          </p>
                        )}
                      </div>
                    </div>

                    {isSelected && (
                      <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 border border-zinc-850 px-1.5 py-0.5 rounded">
                        Enter
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className={`px-4 py-2 border-t flex items-center justify-between text-[10px] text-zinc-500 font-mono ${
          themeMode === 'light' ? 'border-zinc-150 bg-zinc-50' : 'border-zinc-900 bg-zinc-950'
        }`}>
          <div className="flex items-center gap-3">
            <span>↑↓ to navigate</span>
            <span>↵ to select</span>
          </div>
          <span>Esc to close</span>
        </div>
      </div>
    </div>
  );
}
