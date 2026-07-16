/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Milestone, LayoutGrid, Network, Calendar, List, ArrowLeftRight, CheckCircle, Clock } from 'lucide-react';
import { CMSData, StudySpace } from '../../types/cms';

interface RoadmapViewProps {
  cmsData: CMSData;
  onUpdateSpaceStatus: (spaceId: string, progressOverride: number) => void;
  themeMode: 'light' | 'dark';
}

type ViewMode = 'kanban' | 'tree' | 'timeline' | 'list';

export default function RoadmapView({ cmsData, onUpdateSpaceStatus, themeMode }: RoadmapViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [selectedSpaceId, setSelectedSpaceId] = useState<string>(cmsData.studySpaces[0]?.id || '');

  const themeBorder = themeMode === 'light' ? 'border-zinc-200' : 'border-zinc-800/80';
  const themeCardBg = themeMode === 'light' ? 'bg-white border-zinc-200 shadow-[0_4px_20px_rgba(0,0,0,0.03)]' : 'bg-zinc-900 border-zinc-800/80';
  const themeTextMuted = themeMode === 'light' ? 'text-zinc-500' : 'text-zinc-400';

  // Get active study space for tree and list views
  const activeSpace = cmsData.studySpaces.find(s => s.id === selectedSpaceId) || cmsData.studySpaces[0];

  // Helper to compute progress for spaces
  const getSpaceProgress = (space: StudySpace) => {
    let total = 0;
    let completed = 0;
    space.modules.forEach(mod => {
      mod.chapters.forEach(chap => {
        chap.lessons.forEach(l => {
          total++;
          if (l.completed) completed++;
        });
      });
    });
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  // Group study spaces for Kanban board based on progress
  const kanbanColumns = {
    todo: cmsData.studySpaces.filter(s => getSpaceProgress(s) === 0),
    inProgress: cmsData.studySpaces.filter(s => {
      const p = getSpaceProgress(s);
      return p > 0 && p < 100;
    }),
    completed: cmsData.studySpaces.filter(s => getSpaceProgress(s) === 100)
  };

  return (
    <div className="max-w-[90rem] mx-auto px-6 py-8 flex flex-col gap-8 animate-fade-in">
      
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-zinc-500 font-mono text-xs">
            <Milestone className="w-3.5 h-3.5" />
            <span>LEARNING PATHWAY ROUTEMAPS</span>
          </div>
          <h2 className="text-xl font-display font-semibold text-zinc-100 tracking-tight">Learning Roadmaps</h2>
          <p className="text-xs text-zinc-400">Map out your study schedule in Kanban, interactive tree routes, list format, or milestones.</p>
        </div>

        {/* View Switchers */}
        <div className="flex items-center gap-1 bg-zinc-950 p-1.5 rounded-xl border border-zinc-900 shrink-0 self-start">
          {(['kanban', 'tree', 'timeline', 'list'] as ViewMode[]).map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium capitalize transition-all cursor-pointer ${
                viewMode === mode
                  ? 'bg-zinc-900 text-zinc-100 shadow-inner'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {mode === 'kanban' && <LayoutGrid className="w-3.5 h-3.5" />}
              {mode === 'tree' && <Network className="w-3.5 h-3.5" />}
              {mode === 'timeline' && <Calendar className="w-3.5 h-3.5" />}
              {mode === 'list' && <List className="w-3.5 h-3.5" />}
              <span>{mode}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Select Space Dropdown for Detail Views */}
      {(viewMode === 'tree' || viewMode === 'list') && cmsData.studySpaces.length > 0 && (
        <div className="flex items-center gap-3">
          <label className="text-xs font-mono text-zinc-400">Select Study Space:</label>
          <select
            value={selectedSpaceId}
            onChange={(e) => setSelectedSpaceId(e.target.value)}
            className="px-3.5 py-1.5 bg-zinc-900 text-xs text-zinc-200 border border-zinc-800 rounded-xl focus:outline-none"
          >
            {cmsData.studySpaces.map(space => (
              <option key={space.id} value={space.id}>{space.title}</option>
            ))}
          </select>
        </div>
      )}

      {/* Roadmap Content */}
      <div className="w-full">
        
        {/* KANBAN VIEW */}
        {viewMode === 'kanban' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* COLUMN 1: TO DO */}
            <div className={`p-4 rounded-2xl border flex flex-col gap-4 ${themeCardBg}`}>
              <div className="flex items-center justify-between border-b border-zinc-800/10 pb-2.5">
                <span className="text-xs font-semibold text-zinc-100 font-mono tracking-wider uppercase">To Do / Backlog</span>
                <span className="px-2 py-0.5 rounded-full bg-zinc-950 text-[10px] font-mono text-zinc-400 font-bold">
                  {kanbanColumns.todo.length}
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {kanbanColumns.todo.length === 0 ? (
                  <p className="text-[11px] text-zinc-500 text-center py-8">No tracks in backlog.</p>
                ) : (
                  kanbanColumns.todo.map(space => (
                    <div key={space.id} className="p-4 bg-zinc-950/40 border border-zinc-850 rounded-xl flex flex-col gap-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-zinc-500 font-mono">{space.category}</span>
                        <h4 className="text-xs font-semibold text-zinc-200">{space.title}</h4>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[9px] text-zinc-500 font-mono">Est: {space.estimatedHours}h</span>
                        <button
                          onClick={() => onUpdateSpaceStatus(space.id, 10)} // Set progress to 10% to move to In Progress
                          className="px-2 py-1 rounded bg-indigo-500/10 hover:bg-indigo-500 text-[10px] font-mono text-indigo-400 hover:text-white transition-all cursor-pointer"
                        >
                          Start Study →
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* COLUMN 2: IN PROGRESS */}
            <div className={`p-4 rounded-2xl border flex flex-col gap-4 ${themeCardBg}`}>
              <div className="flex items-center justify-between border-b border-zinc-800/10 pb-2.5">
                <span className="text-xs font-semibold text-zinc-100 font-mono tracking-wider uppercase">In Progress</span>
                <span className="px-2 py-0.5 rounded-full bg-zinc-950 text-[10px] font-mono text-zinc-400 font-bold">
                  {kanbanColumns.inProgress.length}
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {kanbanColumns.inProgress.length === 0 ? (
                  <p className="text-[11px] text-zinc-500 text-center py-8">No tracks currently in progress.</p>
                ) : (
                  kanbanColumns.inProgress.map(space => {
                    const p = getSpaceProgress(space);
                    return (
                      <div key={space.id} className="p-4 bg-zinc-950/40 border border-zinc-850 rounded-xl flex flex-col gap-3">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] text-zinc-500 font-mono">{space.category}</span>
                          <h4 className="text-xs font-semibold text-zinc-200">{space.title}</h4>
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between text-[9px] font-mono text-zinc-500">
                            <span>Progress</span>
                            <span>{p}%</span>
                          </div>
                          <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${p}%` }} />
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-1 pt-1 border-t border-zinc-850/50">
                          <span className="text-[9px] text-zinc-500 font-mono">Mentor: {space.mentor}</span>
                          <button
                            onClick={() => onUpdateSpaceStatus(space.id, 100)} // Mark all completed
                            className="px-2 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500 text-[10px] font-mono text-emerald-400 hover:text-white transition-all cursor-pointer"
                          >
                            Complete ✓
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* COLUMN 3: COMPLETED */}
            <div className={`p-4 rounded-2xl border flex flex-col gap-4 ${themeCardBg}`}>
              <div className="flex items-center justify-between border-b border-zinc-800/10 pb-2.5">
                <span className="text-xs font-semibold text-zinc-100 font-mono tracking-wider uppercase">Completed / Graduated</span>
                <span className="px-2 py-0.5 rounded-full bg-zinc-950 text-[10px] font-mono text-zinc-400 font-bold">
                  {kanbanColumns.completed.length}
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {kanbanColumns.completed.length === 0 ? (
                  <p className="text-[11px] text-zinc-500 text-center py-8">No tracks graduated yet.</p>
                ) : (
                  kanbanColumns.completed.map(space => (
                    <div key={space.id} className="p-4 bg-zinc-950/40 border border-zinc-850 rounded-xl flex flex-col gap-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-zinc-500 font-mono">{space.category}</span>
                        <h4 className="text-xs font-semibold text-zinc-200 line-clamp-1">{space.title}</h4>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-emerald-500 font-mono font-bold mt-1">
                        <CheckCircle className="w-3.5 h-3.5 fill-emerald-500/20" />
                        <span>Graduated Course Track</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TREE VIEW */}
        {viewMode === 'tree' && activeSpace && (
          <div className={`p-6 rounded-2xl border flex flex-col gap-6 ${themeCardBg}`}>
            <div>
              <h3 className="text-sm font-semibold text-zinc-100 font-mono uppercase tracking-wider">{activeSpace.title}</h3>
              <p className="text-[10px] text-zinc-500 mt-0.5">Modular knowledge node tree structure</p>
            </div>

            {/* Visual Node map */}
            <div className="flex flex-col gap-6 relative before:absolute before:left-[17px] before:top-4 before:bottom-4 before:w-px before:bg-zinc-800">
              {activeSpace.modules.map((mod, mIdx) => (
                <div key={mod.id} className="flex flex-col gap-4 relative z-10">
                  {/* Module Node Header */}
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-indigo-500/10 border-2 border-indigo-500 flex items-center justify-center font-bold text-xs text-indigo-400 shadow-lg shrink-0">
                      M{mIdx + 1}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-semibold text-zinc-200 truncate">{mod.title}</h4>
                      <p className="text-[9px] text-zinc-500 truncate">{mod.description || 'Core Module Track'}</p>
                    </div>
                  </div>

                  {/* Chapter and lesson nodes connected via subtree */}
                  <div className="pl-9 flex flex-col gap-3 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-px before:border-l before:border-dashed before:border-zinc-800">
                    {mod.chapters.map((chap, cIdx) => (
                      <div key={chap.id} className="flex flex-col gap-2 relative z-10">
                        {/* Chapter Node Header */}
                        <div className="flex items-center gap-2.5">
                          <div className="w-5 h-5 rounded-md bg-zinc-950 border border-zinc-800 flex items-center justify-center text-[9px] font-mono text-zinc-400 font-bold shrink-0">
                            C{cIdx + 1}
                          </div>
                          <span className="text-xs font-semibold text-zinc-300">{chap.title}</span>
                        </div>

                        {/* Lesson Nodes list */}
                        <div className="pl-7 flex flex-col gap-2">
                          {chap.lessons.map(les => (
                            <div key={les.id} className="flex items-center gap-2 text-[10px] font-mono">
                              <span className={`w-1.5 h-1.5 rounded-full ${les.completed ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-700'}`} />
                              <span className={les.completed ? 'text-zinc-400 line-through' : 'text-zinc-400'}>{les.title}</span>
                              <span className="text-[9px] text-zinc-600">({les.duration}m)</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TIMELINE VIEW */}
        {viewMode === 'timeline' && (
          <div className={`p-6 rounded-2xl border flex flex-col gap-6 ${themeCardBg}`}>
            <div>
              <h3 className="text-sm font-semibold text-zinc-100 font-mono uppercase tracking-wider">Milestone Chronology</h3>
              <p className="text-[10px] text-zinc-500 mt-0.5">Chronological sequencing of your learning paths</p>
            </div>

            <div className="flex flex-col gap-6 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-px before:bg-zinc-800">
              {cmsData.studySpaces.map((space, idx) => (
                <div key={space.id} className="flex gap-4 relative z-10">
                  <div className="w-7 h-7 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0 bg-zinc-950/20 border border-zinc-850 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="min-w-0">
                      <span className="text-[9px] font-mono text-zinc-500 uppercase">Milestone {idx + 1}</span>
                      <h4 className="text-xs font-semibold text-zinc-200 mt-0.5">{space.title}</h4>
                      <p className="text-[10px] text-zinc-400 mt-1 line-clamp-1">{space.description}</p>
                    </div>
                    <div className="flex items-center gap-3 font-mono text-[10px] text-zinc-500 shrink-0">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-zinc-600" />
                        <span>{space.estimatedHours}h estimated</span>
                      </div>
                      <span className="text-zinc-700">|</span>
                      <span className="text-indigo-400 font-bold">{getSpaceProgress(space)}% Completed</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LIST VIEW */}
        {viewMode === 'list' && activeSpace && (
          <div className={`p-6 rounded-2xl border flex flex-col gap-4 ${themeCardBg}`}>
            <div>
              <h3 className="text-sm font-semibold text-zinc-100 font-mono uppercase tracking-wider">Structured Course Syllabus</h3>
              <p className="text-[10px] text-zinc-500 mt-0.5">Plain detailed list index of modules, chapters, and lessons</p>
            </div>

            <div className="flex flex-col gap-4 mt-2">
              {activeSpace.modules.map((mod, mIdx) => (
                <div key={mod.id} className="p-3.5 bg-zinc-950/40 border border-zinc-850 rounded-xl flex flex-col gap-3">
                  <h4 className="text-xs font-semibold text-zinc-200 font-mono">Module {mIdx + 1}: {mod.title}</h4>
                  <div className="flex flex-col gap-3 pl-3">
                    {mod.chapters.map(chap => (
                      <div key={chap.id} className="flex flex-col gap-1.5">
                        <span className="text-[10px] font-mono font-semibold text-zinc-500 uppercase tracking-wider">{chap.title}</span>
                        <div className="flex flex-col gap-1">
                          {chap.lessons.map(les => (
                            <div key={les.id} className="flex items-center justify-between text-xs p-2 bg-zinc-900/30 rounded border border-zinc-850/50">
                              <span className={les.completed ? 'text-zinc-500 line-through' : 'text-zinc-300'}>{les.title}</span>
                              <span className="text-[10px] text-zinc-500 font-mono">{les.duration} minutes</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
