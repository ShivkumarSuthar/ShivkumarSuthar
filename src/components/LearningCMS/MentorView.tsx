/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Award, Star, Mail, Briefcase, BookOpen, CheckCircle } from 'lucide-react';
import { CMSData, StudySpace, Lesson } from '../../types/cms';

interface MentorViewProps {
  cmsData: CMSData;
  themeMode: 'light' | 'dark';
}

export default function MentorView({ cmsData, themeMode }: MentorViewProps) {
  
  const themeCardBg = themeMode === 'light' ? 'bg-white border-zinc-200 shadow-[0_4px_20px_rgba(0,0,0,0.03)]' : 'bg-zinc-900 border-zinc-800/80';
  const themeBorder = themeMode === 'light' ? 'border-zinc-200' : 'border-zinc-800/80';

  // Compute mentor statistics
  const mentorsList = cmsData.mentors.map(mentor => {
    // Find all spaces taught by this mentor
    const spaces = cmsData.studySpaces.filter(s => s.mentor === mentor.name);
    
    let totalLessons = 0;
    let completedLessons = 0;
    let estimatedHours = 0;

    spaces.forEach(space => {
      estimatedHours += space.estimatedHours;
      space.modules.forEach(mod => {
        mod.chapters.forEach(chap => {
          chap.lessons.forEach(l => {
            totalLessons++;
            if (l.completed) completedLessons++;
          });
        });
      });
    });

    return {
      ...mentor,
      spaces,
      totalLessons,
      completedLessons,
      estimatedHours,
      progress: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
    };
  });

  return (
    <div className="max-w-[90rem] mx-auto px-6 py-8 flex flex-col gap-8 animate-fade-in">
      
      {/* Title block */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-zinc-500 font-mono text-xs">
          <Award className="w-3.5 h-3.5" />
          <span>INSTRUCTOR COMPANION TRACKER</span>
        </div>
        <h2 className="text-xl font-display font-semibold text-zinc-100 tracking-tight">Mentor Tracking</h2>
        <p className="text-xs text-zinc-400">Track and view learning metrics sorted by course instructor and creator.</p>
      </div>

      {/* Grid of Mentor Profiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mentorsList.map((mentor) => (
          <div
            key={mentor.id}
            className={`p-6 rounded-2xl border flex flex-col gap-5 ${themeCardBg}`}
          >
            {/* Bio row */}
            <div className="flex items-start gap-4">
              <img
                src={mentor.avatar}
                alt={mentor.name}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-full border border-zinc-800 object-cover shrink-0"
              />
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-zinc-100 leading-snug">{mentor.name}</h3>
                <p className="text-[10px] text-indigo-400 font-mono font-medium mt-0.5">{mentor.specialty}</p>
                <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-mono mt-2">
                  <Briefcase className="w-3.5 h-3.5 text-zinc-600" />
                  <span className="truncate">{mentor.company || 'Tech Industry Mentor'}</span>
                </div>
              </div>
            </div>

            {/* Description Bio */}
            {mentor.bio && (
              <p className="text-xs text-zinc-400 leading-relaxed">
                {mentor.bio}
              </p>
            )}

            {/* Statistics Section */}
            <div className="grid grid-cols-3 gap-2 border-y border-zinc-800/15 py-3.5 text-center font-mono text-[10px] text-zinc-500">
              <div className="flex flex-col gap-1">
                <span className="text-zinc-400 font-bold text-xs">{mentor.spaces.length}</span>
                <span className="uppercase tracking-wide">Courses Taught</span>
              </div>
              <div className="flex flex-col gap-1 border-x border-zinc-800/15">
                <span className="text-zinc-400 font-bold text-xs">{mentor.estimatedHours}h</span>
                <span className="uppercase tracking-wide">Total Hours</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-emerald-500 font-bold text-xs">{mentor.completedLessons}</span>
                <span className="uppercase tracking-wide">Completed</span>
              </div>
            </div>

            {/* Progress Ratio Bar */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-zinc-500">Mentor Track Progress</span>
                <span className="font-bold text-zinc-300">{mentor.progress}% Completed ({mentor.completedLessons}/{mentor.totalLessons} lessons)</span>
              </div>
              <div className="w-full h-1.5 bg-zinc-950 border border-zinc-850 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${mentor.progress}%` }}
                />
              </div>
            </div>

            {/* Spaces Taught */}
            <div className="flex flex-col gap-2 mt-1">
              <span className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-wider">Courses Instructed</span>
              <div className="flex flex-col gap-1.5">
                {mentor.spaces.length === 0 ? (
                  <p className="text-[10px] text-zinc-500 italic">No courses currently taught in this environment.</p>
                ) : (
                  mentor.spaces.map(space => (
                    <div key={space.id} className="flex items-center justify-between p-2.5 bg-zinc-950/20 border border-zinc-850 rounded-xl text-xs">
                      <span className="text-zinc-300 truncate max-w-[70%]">{space.title}</span>
                      <span className="text-[10px] font-mono text-zinc-500">{space.category}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
