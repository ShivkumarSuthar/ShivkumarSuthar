/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Play, Calendar, CheckSquare, Plus, ArrowRight, Bookmark, StickyNote, Flame, Hourglass, BarChart3, Clock, Youtube, BrainCircuit, Sparkles } from 'lucide-react';
import { CMSData, StudySpace, Lesson, Todo } from '../../types/cms';
import StudySpaceCard from './StudySpaceCard';
import PlaylistConverterModal from './PlaylistConverterModal';
import AiCourseGeneratorModal from './AiCourseGeneratorModal';

interface CMSDashboardProps {
  cmsData: CMSData;
  onNavigateSpace: (spaceId: string) => void;
  onNavigateTab: (tabId: string) => void;
  onNavigateLesson: (spaceId: string, lessonId: string) => void;
  onToggleTodoGlobal: (spaceId: string, todoId: string) => void;
  onCreateStudySpace: () => void;
  onAddCustomSpace: (newSpace: StudySpace) => void;
  themeMode: 'light' | 'dark';
  onDeleteSpace?: (spaceId: string) => void;
}

export default function CMSDashboard({
  cmsData,
  onNavigateSpace,
  onNavigateTab,
  onToggleTodoGlobal,
  onNavigateLesson,
  onCreateStudySpace,
  onAddCustomSpace,
  themeMode,
  onDeleteSpace
}: CMSDashboardProps) {
  const [isConverterOpen, setIsConverterOpen] = useState(false);
  const [isAiGeneratorOpen, setIsAiGeneratorOpen] = useState(false);

  // 1. Locate the Resume Learning item
  let resumeSpace: StudySpace | null = null;
  let resumeLesson: Lesson | null = null;

  if (cmsData.resumeState.lastSpaceId) {
    const space = cmsData.studySpaces.find(s => s.id === cmsData.resumeState.lastSpaceId);
    if (space) {
      resumeSpace = space;
      if (cmsData.resumeState.lastLessonId) {
        // Search inside modules -> chapters -> lessons
        for (const mod of space.modules) {
          for (const chap of mod.chapters) {
            const found = chap.lessons.find(l => l.id === cmsData.resumeState.lastLessonId);
            if (found) {
              resumeLesson = found;
              break;
            }
          }
          if (resumeLesson) break;
        }
      }
    }
  }

  // Fallback to first incomplete lesson of the first space if none found
  if (!resumeSpace && cmsData.studySpaces.length > 0) {
    resumeSpace = cmsData.studySpaces[0];
    for (const mod of resumeSpace.modules) {
      for (const chap of mod.chapters) {
        const found = chap.lessons.find(l => !l.completed);
        if (found) {
          resumeLesson = found;
          break;
        }
      }
      if (resumeLesson) break;
    }
  }

  // 2. Fetch all aggregate todos
  const allTodos: { spaceId: string; spaceTitle: string; todo: Todo }[] = [];
  cmsData.studySpaces.forEach(space => {
    space.todos.forEach(todo => {
      allTodos.push({ spaceId: space.id, spaceTitle: space.title, todo });
    });
  });

  const incompleteTodos = allTodos.filter(item => !item.todo.completed).slice(0, 5);

  // 3. Fetch recent notes
  const recentNotes: { spaceId: string; spaceTitle: string; lessonId: string; lessonTitle: string; notesExcerpt: string }[] = [];
  cmsData.studySpaces.forEach(space => {
    space.modules.forEach(mod => {
      mod.chapters.forEach(chap => {
        chap.lessons.forEach(les => {
          if (les.notes && les.notes.trim() !== '') {
            // Strip markdown headings to get a plain text excerpt
            const plainExcerpt = les.notes
              .replace(/[#*`_\[\]]/g, '')
              .substring(0, 100) + '...';

            recentNotes.push({
              spaceId: space.id,
              spaceTitle: space.title,
              lessonId: les.id,
              lessonTitle: les.title,
              notesExcerpt: plainExcerpt
            });
          }
        });
      });
    });
  });

  const themeCardBg = themeMode === 'light' ? 'bg-white border-zinc-200 shadow-[0_4px_20px_rgba(0,0,0,0.03)]' : 'bg-zinc-900 border-zinc-800/80';
  const themeTextMuted = themeMode === 'light' ? 'text-zinc-500' : 'text-zinc-400';

  return (
    <div className="max-w-[90rem] mx-auto px-6 py-8 flex flex-col gap-8 animate-fade-in">
      
      {/* 0. Welcome & Introduction Title Section */}
      <div id="cms-welcome-title" className={`flex flex-col gap-1 pb-4 border-b ${
        themeMode === 'light' ? 'border-zinc-200/60' : 'border-zinc-800/10'
      }`}>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-[9px] font-bold font-mono text-indigo-400">
            SYLLABUS PORTAL
          </span>
          <span className="text-zinc-500 font-mono text-xs">• STUDY MANAGEMENT ENGINE</span>
        </div>
        <h1 className={`text-2xl font-display font-bold tracking-tight ${
          themeMode === 'light' ? 'text-zinc-900' : 'text-zinc-100'
        }`}>Your Custom Syllabus Hub</h1>
        <p className={`text-xs ${themeMode === 'light' ? 'text-zinc-600' : 'text-zinc-400'}`}>
          Manage curriculum goals, watch course lectures, write persistent notes, and link active practice projects.
        </p>
      </div>
      
      {/* 1. Continue Learning Hero Callout */}
      {resumeSpace && (
        <div className={`p-6 sm:p-8 rounded-2xl border flex flex-col md:flex-row gap-6 items-start md:items-center justify-between overflow-hidden relative ${
          themeMode === 'light'
            ? 'bg-gradient-to-r from-zinc-50 to-indigo-50/20 border-zinc-200'
            : 'bg-gradient-to-r from-zinc-900 via-indigo-950/10 to-zinc-900 border-zinc-800/80'
        }`}>
          {/* Spotlight light effects */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col gap-2 min-w-0 z-10">
            <span className="text-[10px] font-mono font-bold tracking-wider text-indigo-400 uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              Resume Study Session
            </span>
            <h2 className={`text-lg sm:text-xl font-display font-semibold tracking-tight truncate ${
              themeMode === 'light' ? 'text-zinc-900' : 'text-zinc-100'
            }`}>
              {resumeSpace.title}
            </h2>
            <p className={`text-xs ${themeMode === 'light' ? 'text-zinc-600' : 'text-zinc-400'} max-w-xl`}>
              {resumeLesson
                ? `Ready to jump back into: "${resumeLesson.title}" (${resumeLesson.duration}m estimation).`
                : "Resume where you left off. Continue mastering this study space and complete module goals."}
            </p>
          </div>

          <button
            onClick={() => {
              if (resumeSpace) {
                if (resumeLesson) {
                  onNavigateLesson(resumeSpace.id, resumeLesson.id);
                } else {
                  onNavigateSpace(resumeSpace.id);
                }
              }
            }}
            className="flex items-center gap-2 px-5 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-xs font-semibold cursor-pointer select-none transition-all hover:scale-105 shadow-lg shadow-indigo-500/25 shrink-0 animate-fade-in"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Continue Learning</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 2. Grid Dashboard Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Column (2/3 width) - My Study Spaces */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h3 className={`text-xs font-semibold font-mono uppercase tracking-wider ${
                themeMode === 'light' ? 'text-zinc-800' : 'text-zinc-100'
              }`}>Active Study Spaces</h3>
              <p className="text-[10px] text-zinc-500 mt-0.5">Your primary knowledge hubs and tracks</p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAiGeneratorOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 transition-all cursor-pointer shadow-sm"
              >
                <BrainCircuit className="w-3.5 h-3.5 animate-pulse" />
                <span>AI Syllabus Builder</span>
              </button>

              <button
                onClick={() => setIsConverterOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 transition-all cursor-pointer shadow-sm"
              >
                <Youtube className="w-3.5 h-3.5" />
                <span>Convert Playlist</span>
              </button>

              <button
                onClick={onCreateStudySpace}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-sm ${
                  themeMode === 'light' ? 'bg-zinc-900 text-white hover:bg-zinc-800' : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-950'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Space</span>
              </button>
            </div>
          </div>

          {/* List of Study Spaces cards */}
          <div id="study-spaces-grid-section" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {cmsData.studySpaces.map(space => (
              <StudySpaceCard
                key={space.id}
                space={space}
                onClick={() => onNavigateSpace(space.id)}
                themeMode={themeMode}
                onDelete={onDeleteSpace}
              />
            ))}
          </div>
        </div>

        {/* Sidebar widgets column (1/3 width) */}
        <div className="flex flex-col gap-6">
          
          {/* Quick Tasks widget */}
          <div className={`p-5 rounded-2xl border flex flex-col gap-4 ${themeCardBg}`}>
            <div className="flex items-center justify-between">
              <div>
                <h4 className={`text-xs font-semibold font-mono uppercase tracking-wider ${
                  themeMode === 'light' ? 'text-zinc-850 font-bold' : 'text-zinc-100'
                }`}>Upcoming Tasks</h4>
                <p className="text-[10px] text-zinc-500 mt-0.5">Tasks needing immediate focus</p>
              </div>
              <CheckSquare className="w-4 h-4 text-zinc-500" />
            </div>

            <div className="flex flex-col gap-2.5">
              {incompleteTodos.length === 0 ? (
                <div className={`py-6 text-center border border-dashed rounded-xl ${
                  themeMode === 'light' ? 'border-zinc-200' : 'border-zinc-800/40'
                }`}>
                  <p className="text-xs text-zinc-500">All tasks completed!</p>
                  <p className="text-[9px] text-zinc-400 mt-0.5">Create tasks inside your study spaces.</p>
                </div>
              ) : (
                incompleteTodos.map(({ spaceId, todo }) => (
                  <div
                    key={todo.id}
                    className={`flex items-start gap-2.5 p-2 rounded-xl transition-all border ${
                      themeMode === 'light'
                        ? 'bg-zinc-50 hover:bg-zinc-100/60 border-zinc-150'
                        : 'bg-zinc-900/30 hover:bg-zinc-900/50 border-zinc-850'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => onToggleTodoGlobal(spaceId, todo.id)}
                      className={`mt-0.5 rounded text-indigo-500 focus:ring-0 cursor-pointer ${
                        themeMode === 'light' ? 'border-zinc-300' : 'border-zinc-800'
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <p className={`text-xs font-medium truncate ${
                        themeMode === 'light' ? 'text-zinc-800' : 'text-zinc-200'
                      }`}>{todo.title}</p>
                      <p className="text-[9px] text-zinc-500 font-mono mt-0.5 truncate">Due: {todo.dueDate || 'No Date'}</p>
                    </div>
                    {todo.priority === 'high' && (
                      <span className="px-1.5 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 text-[8px] font-bold text-rose-500 font-mono">
                        HIGH
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Notes widget */}
          <div className={`p-5 rounded-2xl border flex flex-col gap-4 ${themeCardBg}`}>
            <div className="flex items-center justify-between">
              <div>
                <h4 className={`text-xs font-semibold font-mono uppercase tracking-wider ${
                  themeMode === 'light' ? 'text-zinc-850 font-bold' : 'text-zinc-100'
                }`}>Recent Notes</h4>
                <p className="text-[10px] text-zinc-500 mt-0.5">Your study summaries</p>
              </div>
              <StickyNote className="w-4 h-4 text-zinc-500" />
            </div>

            <div className="flex flex-col gap-2.5">
              {recentNotes.length === 0 ? (
                <div className={`py-6 text-center border border-dashed rounded-xl ${
                  themeMode === 'light' ? 'border-zinc-200' : 'border-zinc-800/40'
                }`}>
                  <p className="text-xs text-zinc-500">No notes written yet.</p>
                  <p className="text-[9px] text-zinc-400 mt-0.5">Open a lesson and start typing notes.</p>
                </div>
              ) : (
                recentNotes.slice(0, 3).map((note, idx) => (
                  <div
                    key={idx}
                    onClick={() => onNavigateLesson(note.spaceId, note.lessonId)}
                    className={`flex flex-col gap-1 p-2.5 rounded-xl cursor-pointer transition-all border ${
                      themeMode === 'light'
                        ? 'bg-zinc-50 hover:bg-indigo-50/40 border-zinc-150'
                        : 'bg-zinc-900/30 hover:bg-indigo-950/10 border-zinc-850'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono text-indigo-400 font-medium truncate max-w-[70%]">{note.spaceTitle}</span>
                      <span className="text-[8px] font-mono text-zinc-500">AUTOSAVED</span>
                    </div>
                    <p className={`text-xs font-semibold truncate mt-0.5 ${
                      themeMode === 'light' ? 'text-zinc-850' : 'text-zinc-200'
                    }`}>{note.lessonTitle}</p>
                    <p className="text-[10px] text-zinc-500 line-clamp-1 leading-relaxed mt-0.5">{note.notesExcerpt}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Bookmarks widget */}
          <div className={`p-5 rounded-2xl border flex flex-col gap-4 ${themeCardBg}`}>
            <div className="flex items-center justify-between">
              <div>
                <h4 className={`text-xs font-semibold font-mono uppercase tracking-wider ${
                  themeMode === 'light' ? 'text-zinc-850 font-bold' : 'text-zinc-100'
                }`}>Key Bookmarks</h4>
                <p className="text-[10px] text-zinc-500 mt-0.5">Bookmarked study folders</p>
              </div>
              <Bookmark className="w-4 h-4 text-zinc-500" />
            </div>

            <div className="flex flex-col gap-2">
              {cmsData.bookmarks.length === 0 ? (
                <p className="text-xs text-zinc-500 text-center py-4">No bookmarks added yet.</p>
              ) : (
                cmsData.bookmarks.slice(0, 3).map(bm => (
                  <a
                    key={bm.id}
                    href={bm.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-medium transition-all border ${
                      themeMode === 'light'
                        ? 'bg-zinc-50 hover:bg-zinc-100 border-zinc-150 text-zinc-700 hover:text-indigo-600'
                        : 'bg-zinc-900/30 hover:bg-zinc-900/50 border-zinc-850 text-zinc-300 hover:text-zinc-100'
                    }`}
                  >
                    <span className="truncate max-w-[80%]">{bm.title}</span>
                    <ArrowRight className="w-3 h-3 text-zinc-500" />
                  </a>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

      {/* 3. Activity Log Timeline at bottom */}
      <div className={`p-6 rounded-2xl border flex flex-col gap-4 ${themeCardBg}`}>
        <div>
          <h3 className={`text-xs font-semibold font-mono uppercase tracking-wider ${
            themeMode === 'light' ? 'text-zinc-850 font-bold' : 'text-zinc-100'
          }`}>Activity Log & Timeline</h3>
          <p className="text-[10px] text-zinc-500 mt-0.5">Your study accomplishments tracking logs</p>
        </div>

        <div className={`flex flex-col gap-4 mt-1.5 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-px ${
          themeMode === 'light' ? 'before:bg-zinc-200' : 'before:bg-zinc-800'
        }`}>
          {cmsData.activityLog.slice(0, 4).map((log, i) => (
            <div key={log.id} className="flex gap-4 items-start relative z-10">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border ${
                themeMode === 'light' ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-950 border-zinc-800'
              }`}>
                <span className="text-xs">
                  {log.type === 'complete_lesson' ? '✅' : log.type === 'add_note' ? '📝' : log.type === 'start_course' ? '🚀' : '✨'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-semibold truncate ${
                  themeMode === 'light' ? 'text-zinc-850' : 'text-zinc-200'
                }`}>{log.title}</p>
                <p className="text-[10px] text-zinc-500 mt-0.5">{log.description}</p>
                <span className="text-[9px] text-zinc-650 font-mono block mt-1">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Smart Playlist Converter Overlay Dialog Modal */}
      <PlaylistConverterModal
        isOpen={isConverterOpen}
        onClose={() => setIsConverterOpen(false)}
        onConvert={onAddCustomSpace}
        themeMode={themeMode}
      />

      {/* AI Course Roadmap Assembly Modal */}
      <AiCourseGeneratorModal
        isOpen={isAiGeneratorOpen}
        onClose={() => setIsAiGeneratorOpen(false)}
        onAddCourse={onAddCustomSpace}
        themeMode={themeMode}
      />

    </div>
  );
}
