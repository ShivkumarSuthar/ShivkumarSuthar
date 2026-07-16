/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BarChart3, Clock, Flame, CheckCircle, Award, Lightbulb, ChevronRight, BookOpen } from 'lucide-react';
import { CMSData, StudySpace } from '../../types/cms';

interface AnalyticsViewProps {
  cmsData: CMSData;
  themeMode: 'light' | 'dark';
}

export default function AnalyticsView({ cmsData, themeMode }: AnalyticsViewProps) {
  const [hoveredDay, setHoveredDay] = useState<{ date: string; hours: number } | null>(null);
  const [selectedChartPeriod, setSelectedChartPeriod] = useState<'weekly' | 'monthly'>('weekly');

  const themeBorder = themeMode === 'light' ? 'border-zinc-200' : 'border-zinc-800/80';
  const themeCardBg = themeMode === 'light' ? 'bg-white border-zinc-200 shadow-[0_4px_20px_rgba(0,0,0,0.03)]' : 'bg-zinc-900 border-zinc-800/80';
  const themeTextMuted = themeMode === 'light' ? 'text-zinc-500' : 'text-zinc-400';

  // 1. Calculate General Statistics
  const totalStudyHours = Object.values(cmsData.dailyStudyHours).reduce((acc, h) => acc + h, 0);

  let totalLessons = 0;
  let completedLessons = 0;
  cmsData.studySpaces.forEach(space => {
    space.modules.forEach(mod => {
      mod.chapters.forEach(chap => {
        chap.lessons.forEach(les => {
          totalLessons++;
          if (les.completed) completedLessons++;
        });
      });
    });
  });

  const completionRate = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  // 2. Heatmap Construction (Last 30 Days)
  const heatmapDays = Array.from({ length: 30 }, (_, i) => {
    const d = new Date('2026-07-12'); // Fixed anchor
    d.setDate(d.getDate() - (29 - i));
    const dateStr = d.toISOString().split('T')[0];
    const hours = cmsData.dailyStudyHours[dateStr] || 0;
    return { date: dateStr, hours, dayLabel: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) };
  });

  // 3. Technologies breakdown
  const techHoursMap: Record<string, number> = {};
  cmsData.studySpaces.forEach(space => {
    // Distribute space study hours amongst tags
    const hoursPerTag = space.estimatedHours / Math.max(1, space.tags.length);
    space.tags.forEach(tag => {
      techHoursMap[tag] = (techHoursMap[tag] || 0) + hoursPerTag;
    });
  });

  const sortedTechs = Object.entries(techHoursMap)
    .map(([name, hours]) => ({ name, value: Math.round(hours) }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const maxTechValue = sortedTechs.length > 0 ? sortedTechs[0].value : 1;

  // 4. Mentors breakdown
  const mentorActivityMap: Record<string, number> = {};
  cmsData.studySpaces.forEach(space => {
    let completedCount = 0;
    space.modules.forEach(mod => {
      mod.chapters.forEach(chap => {
        chap.lessons.forEach(les => {
          if (les.completed) completedCount++;
        });
      });
    });
    mentorActivityMap[space.mentor] = (mentorActivityMap[space.mentor] || 0) + completedCount;
  });

  const sortedMentors = Object.entries(mentorActivityMap)
    .map(([name, lessonsCompleted]) => {
      const mentorObj = cmsData.mentors.find(m => m.name === name);
      return {
        name,
        lessonsCompleted,
        avatar: mentorObj?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&h=100&auto=format&fit=crop',
        specialty: mentorObj?.specialty || 'Coding Instructor'
      };
    })
    .sort((a, b) => b.lessonsCompleted - a.lessonsCompleted);

  // SVG Area Chart calculations (last 7 days of study)
  const last7Days = heatmapDays.slice(-7);
  const maxHours = Math.max(...last7Days.map(d => d.hours), 1);
  const chartWidth = 500;
  const chartHeight = 160;
  const padding = 20;

  // Compute points for SVG curve
  const points = last7Days.map((d, i) => {
    const x = padding + (i * (chartWidth - 2 * padding)) / (last7Days.length - 1);
    const y = chartHeight - padding - (d.hours / maxHours) * (chartHeight - 2 * padding);
    return { x, y, day: d.dayLabel, hours: d.hours };
  });

  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x} ${chartHeight - padding} L ${points[0].x} ${chartHeight - padding} Z`
    : '';

  return (
    <div className="max-w-[90rem] mx-auto px-6 py-8 flex flex-col gap-8 animate-fade-in">
      
      {/* Analytics Dashboard Title */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-zinc-500 font-mono text-xs">
          <BarChart3 className="w-3.5 h-3.5" />
          <span>PORTFOLIO COMPANION</span>
        </div>
        <h2 className="text-xl font-display font-semibold text-zinc-100 tracking-tight">Interactive Analytics</h2>
        <p className="text-xs text-zinc-400">Track and optimize your study hours, technology focus ratios, and completion metrics.</p>
      </div>

      {/* Grid of Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Hours Card */}
        <div className={`p-5 rounded-2xl border flex items-center justify-between gap-4 ${themeCardBg}`}>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Total Study Time</span>
            <span className="text-2xl font-bold font-display text-zinc-100">{totalStudyHours.toFixed(1)}h</span>
            <span className="text-[10px] text-emerald-500 font-medium">✨ Outperforming last week</span>
          </div>
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Completion Rate Circular dial card */}
        <div className={`p-5 rounded-2xl border flex items-center justify-between gap-4 ${themeCardBg}`}>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Completion Rate</span>
            <span className="text-2xl font-bold font-display text-zinc-100">{completionRate}%</span>
            <span className="text-[10px] text-zinc-400">
              {completedLessons} / {totalLessons} Lessons Finished
            </span>
          </div>
          {/* Custom SVG Circular dial */}
          <div className="relative w-12 h-12 shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="20"
                className="text-zinc-850 stroke-current fill-transparent"
                strokeWidth="4"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                className="text-emerald-500 stroke-current fill-transparent"
                strokeWidth="4"
                strokeDasharray="125.6"
                strokeDashoffset={125.6 - (125.6 * completionRate) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-zinc-300">
              {completionRate}%
            </div>
          </div>
        </div>

        {/* Streak Tracker Card */}
        <div className={`p-5 rounded-2xl border flex items-center justify-between gap-4 ${themeCardBg}`}>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Learning Streak</span>
            <span className="text-2xl font-bold font-display text-zinc-100">{cmsData.currentStreak} Days</span>
            <span className="text-[10px] text-amber-500 font-medium">🔥 Active learning streak</span>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl border border-amber-500/20">
            <Flame className="w-5 h-5" />
          </div>
        </div>

        {/* Daily Goal Card */}
        <div className={`p-5 rounded-2xl border flex items-center justify-between gap-4 ${themeCardBg}`}>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Today's Goal</span>
            <span className="text-2xl font-bold font-display text-zinc-100">{cmsData.todaysGoalHours}h</span>
            <span className="text-[10px] text-indigo-400">Target minimum daily hours</span>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Analytics Content Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Line Chart and Heatmap */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Interactive Study Hours Line Chart */}
          <div className={`p-6 rounded-2xl border flex flex-col gap-4 ${themeCardBg}`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-semibold text-zinc-100 font-mono uppercase tracking-wider">Study Duration Log</h3>
                <p className="text-[10px] text-zinc-500 mt-0.5">Time logged (hours) over the last 7 sessions</p>
              </div>
              <div className="flex gap-1">
                <button className="px-2.5 py-1 text-[10px] font-mono rounded-lg bg-zinc-800 text-zinc-200 border border-zinc-700/50">
                  Last 7 Days
                </button>
              </div>
            </div>

            {/* Custom SVG Curve Area Chart */}
            <div className="relative w-full h-[180px] bg-zinc-900/40 rounded-xl border border-zinc-800/40 overflow-hidden py-3">
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full">
                {/* Horizontal grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                  const y = padding + ratio * (chartHeight - 2 * padding);
                  return (
                    <line
                      key={i}
                      x1={padding}
                      y1={y}
                      x2={chartWidth - padding}
                      y2={y}
                      className="stroke-zinc-800/30"
                      strokeWidth="1"
                      strokeDasharray="4"
                    />
                  );
                })}

                {/* Shaded Area */}
                {areaD && (
                  <path
                    d={areaD}
                    fill="url(#chartGradient)"
                    className="opacity-25"
                  />
                )}

                {/* Smooth Curve Path */}
                {pathD && (
                  <path
                    d={pathD}
                    fill="none"
                    className="stroke-indigo-500"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Plot Dots with trigger interaction */}
                {points.map((p, i) => (
                  <g key={i}>
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r="4"
                      className="fill-indigo-500 hover:r-6 cursor-pointer transition-all stroke-zinc-950"
                      strokeWidth="1.5"
                      onMouseEnter={() => setHoveredDay({ date: p.day, hours: p.hours })}
                      onMouseLeave={() => setHoveredDay(null)}
                    />
                  </g>
                ))}

                {/* Custom Gradient Definitions */}
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Tooltip Overlay */}
              {hoveredDay && (
                <div className="absolute top-4 right-4 px-2.5 py-1.5 rounded bg-zinc-950 border border-zinc-800 text-[10px] font-mono text-zinc-300 shadow-xl flex flex-col">
                  <span className="text-zinc-500 font-semibold">{hoveredDay.date}</span>
                  <span className="text-zinc-200 mt-0.5 font-bold text-xs">{hoveredDay.hours.toFixed(1)} hours studied</span>
                </div>
              )}
            </div>

            {/* X Axis Labels */}
            <div className="flex items-center justify-between px-3 text-[10px] font-mono text-zinc-500">
              {last7Days.map((d, i) => (
                <span key={i}>{d.dayLabel}</span>
              ))}
            </div>
          </div>

          {/* GitHub-style Learning Heatmap */}
          <div className={`p-6 rounded-2xl border flex flex-col gap-4 ${themeCardBg}`}>
            <div>
              <h3 className="text-xs font-semibold text-zinc-100 font-mono uppercase tracking-wider">Learning Heatmap</h3>
              <p className="text-[10px] text-zinc-500 mt-0.5">Study intensity logs for the last 30 calendar days</p>
            </div>

            <div className="flex flex-wrap gap-1.5 p-3.5 bg-zinc-900/40 border border-zinc-800/40 rounded-xl justify-center items-center">
              {heatmapDays.map((day, i) => {
                let intensityClass = 'bg-zinc-850 hover:bg-zinc-800';
                if (day.hours > 0 && day.hours < 1) {
                  intensityClass = 'bg-indigo-500/20 hover:bg-indigo-500/35 border border-indigo-500/10';
                } else if (day.hours >= 1 && day.hours <= 2.5) {
                  intensityClass = 'bg-indigo-500/50 hover:bg-indigo-500/65 border border-indigo-500/30';
                } else if (day.hours > 2.5) {
                  intensityClass = 'bg-indigo-500 hover:bg-indigo-400 border border-indigo-400';
                }

                return (
                  <div
                    key={day.date}
                    onMouseEnter={() => setHoveredDay({ date: day.dayLabel, hours: day.hours })}
                    onMouseLeave={() => setHoveredDay(null)}
                    className={`w-6 h-6 rounded-md cursor-pointer transition-all flex items-center justify-center text-[9px] font-mono font-bold ${intensityClass} ${
                      day.hours > 0 ? 'text-white' : 'text-zinc-600'
                    }`}
                  >
                    {day.hours > 0 ? Math.round(day.hours) : ''}
                  </div>
                );
              })}
            </div>

            {/* Legend guide */}
            <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 px-1">
              <span>Less Study</span>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-zinc-850 rounded" />
                <span className="w-3 h-3 bg-indigo-500/20 rounded" />
                <span className="w-3 h-3 bg-indigo-500/50 rounded" />
                <span className="w-3 h-3 bg-indigo-500 rounded" />
              </div>
              <span>More Study</span>
            </div>
          </div>
        </div>

        {/* Right Column: Technology distribution and Mentor stats */}
        <div className="flex flex-col gap-6">
          
          {/* Most Studied Technologies */}
          <div className={`p-6 rounded-2xl border flex flex-col gap-4 ${themeCardBg}`}>
            <div>
              <h3 className="text-xs font-semibold text-zinc-100 font-mono uppercase tracking-wider">Technology Breakdown</h3>
              <p className="text-[10px] text-zinc-500 mt-0.5">Study intensity categorized by language and tooling focus</p>
            </div>

            <div className="flex flex-col gap-3.5">
              {sortedTechs.map((tech) => {
                const ratio = Math.round((tech.value / maxTechValue) * 100);
                return (
                  <div key={tech.name} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-zinc-300">{tech.name}</span>
                      <span className="text-zinc-500 text-[10px]">{tech.value} weighted points</span>
                    </div>
                    {/* Visual Progress Bar */}
                    <div className="w-full h-1.5 bg-zinc-900 border border-zinc-800/40 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full transition-all"
                        style={{ width: `${ratio}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Mentors Tracker */}
          <div className={`p-6 rounded-2xl border flex flex-col gap-4 ${themeCardBg}`}>
            <div>
              <h3 className="text-xs font-semibold text-zinc-100 font-mono uppercase tracking-wider">Top Study Mentors</h3>
              <p className="text-[10px] text-zinc-500 mt-0.5">Instructor-wise completed lessons in progress</p>
            </div>

            <div className="flex flex-col gap-3">
              {sortedMentors.map((men) => (
                <div key={men.name} className="flex items-center justify-between gap-3 p-2 bg-zinc-900/30 border border-zinc-800/20 rounded-xl">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={men.avatar}
                      alt={men.name}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full border border-zinc-850 object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-semibold text-zinc-200 truncate">{men.name}</h4>
                      <p className="text-[9px] text-zinc-500 truncate">{men.specialty}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold font-mono text-emerald-500">{men.lessonsCompleted}</span>
                    <p className="text-[9px] text-zinc-500 uppercase font-mono">Completed</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
