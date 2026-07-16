/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Calendar, Clock, BarChart, User, Tag, ChevronRight, Award, Trash2 } from 'lucide-react';
import { StudySpace } from '../../types/cms';

interface StudySpaceCardProps {
  space: StudySpace;
  onClick: () => void;
  themeMode: 'light' | 'dark';
  onDelete?: (spaceId: string) => void;
}

export default function StudySpaceCard({ space, onClick, themeMode, onDelete }: StudySpaceCardProps) {
  // Compute lessons count and progress percentage
  let totalLessons = 0;
  let completedLessons = 0;

  space.modules.forEach(mod => {
    mod.chapters.forEach(chap => {
      chap.lessons.forEach(les => {
        totalLessons++;
        if (les.completed) completedLessons++;
      });
    });
  });

  const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const difficultyColor = space.difficulty === 'Beginner'
    ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
    : space.difficulty === 'Intermediate'
    ? 'text-amber-500 bg-amber-500/10 border-amber-500/20'
    : 'text-rose-500 bg-rose-500/10 border-rose-500/20';

  const themeCardBg = themeMode === 'light'
    ? 'bg-white border-zinc-200 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-zinc-300'
    : 'bg-zinc-900 border-zinc-800/80 hover:border-zinc-700/80 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]';

  const themeMuted = themeMode === 'light' ? 'text-zinc-500' : 'text-zinc-400';

  return (
    <div
      onClick={onClick}
      className={`group rounded-2xl border flex flex-col overflow-hidden transition-all duration-300 cursor-pointer ${themeCardBg}`}
    >
      {/* Cover Image Header */}
      <div className="relative h-40 overflow-hidden shrink-0">
        <img
          src={space.coverImage}
          alt={space.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Soft overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
        
        {/* Category Badge overlay */}
        <span className="absolute top-3 left-3 px-2 py-0.5 rounded-lg bg-zinc-950/80 border border-zinc-800 backdrop-blur-md text-[9px] font-mono text-zinc-300 font-medium">
          {space.category}
        </span>

        {/* Difficulty Badge overlay */}
        <span className={`absolute top-3 ${onDelete ? 'right-11' : 'right-3'} px-2 py-0.5 rounded-lg border text-[9px] font-mono font-semibold ${difficultyColor}`}>
          {space.difficulty}
        </span>

        {/* Card level delete button */}
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm(`Are you absolutely sure you want to delete "${space.title}"? This will permanently remove all modules, chapters, lessons, custom notes, local todos, and projects.`)) {
                onDelete(space.id);
              }
            }}
            className="absolute top-3 right-3 z-10 p-1.5 bg-rose-950/85 hover:bg-rose-600 border border-rose-900/40 rounded-lg text-rose-200 hover:text-white transition-all cursor-pointer backdrop-blur-md shadow-lg"
            title="Delete this study space"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Card Content Area */}
      <div className="p-5 flex-1 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <h3 className={`text-sm font-semibold transition-colors line-clamp-1 leading-snug ${
            themeMode === 'light'
              ? 'text-zinc-900 group-hover:text-indigo-600'
              : 'text-zinc-100 group-hover:text-indigo-400'
          }`}>
            {space.title}
          </h3>
          <p className={`text-[11px] line-clamp-2 leading-relaxed ${
            themeMode === 'light' ? 'text-zinc-600' : 'text-zinc-400'
          }`}>
            {space.description}
          </p>
        </div>

        {/* Info stats bar */}
        <div className={`grid grid-cols-2 gap-2 text-[10px] font-mono border-y py-2.5 ${
          themeMode === 'light' ? 'text-zinc-500 border-zinc-100' : 'text-zinc-500 border-zinc-800/10'
        }`}>
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" />
            <span className="truncate">{space.mentor}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Est: {space.estimatedHours}h</span>
          </div>
        </div>

        {/* Progress Display */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[10px] font-mono">
            <span className="text-zinc-500">Progress</span>
            <span className={`font-bold ${themeMode === 'light' ? 'text-zinc-700' : 'text-zinc-300'}`}>
              {progressPercent}% ({completedLessons}/{totalLessons} lessons)
            </span>
          </div>
          <div className={`w-full h-1.5 rounded-full overflow-hidden border ${
            themeMode === 'light' ? 'bg-zinc-100 border-zinc-200' : 'bg-zinc-950 border-zinc-850/40'
          }`}>
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Footer Tag list & Action button */}
        <div className="flex items-center justify-between mt-auto pt-2">
          {/* Subtags */}
          <div className="flex items-center gap-1 overflow-hidden max-w-[70%]">
            {space.tags.slice(0, 2).map((tag, i) => (
              <span
                key={i}
                className={`px-2 py-0.5 rounded border text-[9px] font-mono truncate ${
                  themeMode === 'light'
                    ? 'bg-zinc-100 border-zinc-200 text-zinc-600'
                    : 'bg-zinc-950/40 border-zinc-850 text-zinc-400'
                }`}
              >
                #{tag.toLowerCase()}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-1 text-[10px] font-mono font-semibold text-indigo-400 group-hover:translate-x-1 transition-transform">
            <span>Enter Study Space</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>
      </div>
    </div>
  );
}
