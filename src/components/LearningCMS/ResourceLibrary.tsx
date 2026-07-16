/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Library, Search, Filter, Award, User, Tag, ShieldAlert, ArrowUpRight } from 'lucide-react';
import { CMSData, StudySpace, Lesson } from '../../types/cms';

interface ResourceLibraryProps {
  cmsData: CMSData;
  onNavigateLesson: (spaceId: string, lessonId: string) => void;
  themeMode: 'light' | 'dark';
}

interface LibraryItem {
  id: string;
  title: string;
  type: string;
  url?: string;
  mentor: string;
  difficulty: string;
  category: string;
  spaceId: string;
  spaceTitle: string;
  lessonId?: string;
  completed: boolean;
  tags: string[];
}

export default function ResourceLibrary({ cmsData, onNavigateLesson, themeMode }: ResourceLibraryProps) {
  const [search, setSearch] = useState('');
  const [selectedMentor, setSelectedMentor] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Gather all items from study spaces and bookmarks
  const items: LibraryItem[] = [];

  // Flatten lessons from spaces
  cmsData.studySpaces.forEach(space => {
    space.modules.forEach(mod => {
      mod.chapters.forEach(chap => {
        chap.lessons.forEach(les => {
          items.push({
            id: les.id,
            title: les.title,
            type: les.videoUrl ? 'video' : 'article',
            url: les.videoUrl || les.resourceLink,
            mentor: space.mentor,
            difficulty: space.difficulty,
            category: space.category,
            spaceId: space.id,
            spaceTitle: space.title,
            lessonId: les.id,
            completed: les.completed,
            tags: [...les.tags, ...space.tags]
          });
        });
      });
    });
  });

  // Flatten Bookmarks
  cmsData.bookmarks.forEach(bm => {
    const spaceObj = cmsData.studySpaces.find(s => s.id === bm.studySpaceId);
    items.push({
      id: bm.id,
      title: bm.title,
      type: bm.type,
      url: bm.url,
      mentor: spaceObj?.mentor || 'Independent',
      difficulty: spaceObj?.difficulty || 'Intermediate',
      category: spaceObj?.category || 'General',
      spaceId: bm.studySpaceId || 'general',
      spaceTitle: spaceObj?.title || 'General Resources',
      completed: false,
      tags: []
    });
  });

  // Extract filter option sets
  const mentors = Array.from(new Set(items.map(item => item.mentor)));
  const types = Array.from(new Set(items.map(item => item.type)));

  // Filter items
  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.spaceTitle.toLowerCase().includes(search.toLowerCase()) ||
      item.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));

    const matchesMentor = selectedMentor === 'all' || item.mentor === selectedMentor;
    const matchesDifficulty = selectedDifficulty === 'all' || item.difficulty === selectedDifficulty;
    const matchesType = selectedType === 'all' || item.type === selectedType;
    const matchesStatus = selectedStatus === 'all' ||
      (selectedStatus === 'completed' && item.completed) ||
      (selectedStatus === 'incomplete' && !item.completed);

    return matchesSearch && matchesMentor && matchesDifficulty && matchesType && matchesStatus;
  });

  const themeCardBg = themeMode === 'light' ? 'bg-white border-zinc-200 shadow-[0_4px_20px_rgba(0,0,0,0.03)]' : 'bg-zinc-900 border-zinc-800/80';
  const themeInputBg = themeMode === 'light' ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-950 border-zinc-850';

  return (
    <div className="max-w-[90rem] mx-auto px-6 py-8 flex flex-col gap-8 animate-fade-in">
      
      {/* Title block */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-zinc-500 font-mono text-xs">
          <Library className="w-3.5 h-3.5" />
          <span>GLOBAL KNOWLEDGE BASE</span>
        </div>
        <h2 className="text-xl font-display font-semibold text-zinc-100 tracking-tight">Resource Library</h2>
        <p className="text-xs text-zinc-400">Filter, query, and launch study guides, interactive lessons, bookmarks, and video tutorials.</p>
      </div>

      {/* Filter Options Bar */}
      <div className={`p-5 rounded-2xl border flex flex-col gap-4 ${themeCardBg}`}>
        {/* Search bar */}
        <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl border border-zinc-800/10 bg-zinc-950/20">
          <Search className="w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search resources by title, space, technologies, or tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-xs border-none outline-none focus:ring-0 text-zinc-200 placeholder-zinc-500"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* Mentor Filter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-wider">Instructor</label>
            <select
              value={selectedMentor}
              onChange={(e) => setSelectedMentor(e.target.value)}
              className={`w-full px-3 py-2 rounded-xl text-xs bg-zinc-950 text-zinc-300 border border-zinc-800 focus:outline-none focus:ring-1 focus:ring-indigo-500`}
            >
              <option value="all">All Mentors</option>
              {mentors.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-wider">Difficulty Level</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className={`w-full px-3 py-2 rounded-xl text-xs bg-zinc-950 text-zinc-300 border border-zinc-800 focus:outline-none focus:ring-1 focus:ring-indigo-500`}
            >
              <option value="all">All Difficulties</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          {/* Type Filter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-wider">Source Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className={`w-full px-3 py-2 rounded-xl text-xs bg-zinc-950 text-zinc-300 border border-zinc-800 focus:outline-none focus:ring-1 focus:ring-indigo-500`}
            >
              <option value="all">All Formats</option>
              {types.map(t => (
                <option key={t} value={t}>{t.toUpperCase()}</option>
              ))}
            </select>
          </div>

          {/* Progress Status Filter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-wider">Completion Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className={`w-full px-3 py-2 rounded-xl text-xs bg-zinc-950 text-zinc-300 border border-zinc-800 focus:outline-none focus:ring-1 focus:ring-indigo-500`}
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed Only</option>
              <option value="incomplete">In Progress Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Resource Cards Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-zinc-800/40 rounded-2xl bg-zinc-900/10">
          <ShieldAlert className="w-10 h-10 text-zinc-600 mx-auto mb-3 animate-pulse" />
          <p className="text-sm font-semibold text-zinc-300">No resources found matching filter requirements.</p>
          <p className="text-xs text-zinc-500 mt-1">Try resetting your dropdown selections or adjusting search terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item, idx) => {
            const isCompleted = item.completed;
            return (
              <div
                key={idx}
                className={`p-5 rounded-2xl border flex flex-col gap-4 group transition-all duration-300 ${themeCardBg} ${
                  item.lessonId ? 'cursor-pointer hover:border-indigo-500' : ''
                }`}
                onClick={() => {
                  if (item.lessonId) {
                    onNavigateLesson(item.spaceId, item.lessonId);
                  } else if (item.url) {
                    window.open(item.url, '_blank', 'noopener,noreferrer');
                  }
                }}
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">{item.spaceTitle}</span>
                    <span className="text-[8px] font-mono text-indigo-400 mt-0.5">{item.category}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold ${
                    isCompleted
                      ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-500'
                      : 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-400'
                  }`}>
                    {isCompleted ? 'COMPLETED' : item.type.toUpperCase()}
                  </span>
                </div>

                {/* Resource Title */}
                <div className="flex flex-col gap-1 flex-1">
                  <h4 className="text-xs font-semibold text-zinc-200 group-hover:text-indigo-400 transition-colors line-clamp-2 leading-relaxed">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-2 text-[10px] text-zinc-500 font-mono">
                    <User className="w-3.5 h-3.5 text-zinc-600" />
                    <span>Mentor: {item.mentor}</span>
                  </div>
                </div>

                {/* Action launcher */}
                <div className="flex items-center justify-between border-t border-zinc-800/10 pt-3 mt-auto">
                  <div className="flex gap-1 overflow-hidden">
                    {item.tags.slice(0, 2).map((tag, tIdx) => (
                      <span key={tIdx} className="px-1.5 py-0.5 rounded bg-zinc-950/40 text-[8px] font-mono text-zinc-500">
                        #{tag.toLowerCase()}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-1 text-[10px] font-mono font-semibold text-indigo-400">
                    <span>{item.lessonId ? 'Study Lesson' : 'Open Link'}</span>
                    <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
