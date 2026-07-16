/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, Sparkles, BrainCircuit, Loader2, Target, Clock, GraduationCap } from 'lucide-react';
import { StudySpace } from '../../types/cms';
import InfoTooltip from './InfoTooltip';

interface AiCourseGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCourse: (newSpace: StudySpace) => void;
  themeMode: 'light' | 'dark';
}

export default function AiCourseGeneratorModal({
  isOpen,
  onClose,
  onAddCourse,
  themeMode
}: AiCourseGeneratorModalProps) {
  const [topic, setTopic] = useState('');
  const [category, setCategory] = useState('Computer Science');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [hours, setHours] = useState(25);
  const [goals, setGoals] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState(0);

  // Loading phases simulator
  useEffect(() => {
    if (!isLoading) {
      setLoadingPhase(0);
      return;
    }

    const phase1 = setTimeout(() => setLoadingPhase(1), 3000);
    const phase2 = setTimeout(() => setLoadingPhase(2), 7000);
    const phase3 = setTimeout(() => setLoadingPhase(3), 12000);

    return () => {
      clearTimeout(phase1);
      clearTimeout(phase2);
      clearTimeout(phase3);
    };
  }, [isLoading]);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/gemini/generate-track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic.trim(),
          category,
          difficulty,
          hours,
          goals: goals.trim()
        })
      });

      const newSpace = await response.json();
      if (newSpace && newSpace.id) {
        onAddCourse(newSpace);
        onClose();
        // Clear state
        setTopic('');
        setGoals('');
      } else {
        throw new Error("Failed to generate track blueprint");
      }
    } catch (err) {
      console.error("AI course generation failed", err);
      // Fallback fallback space creation
      const fallbackSpace: StudySpace = {
        workspaceId: 'work-prog',
        id: `space-${Date.now()}`,
        title: topic || "AI Generated Course Roadmap",
        description: `Custom-tailored curriculum regarding ${topic}. Check your live Gemini connection in settings to generate fully rich modules.`,
        coverImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=400&h=250&auto=format&fit=crop",
        banner: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&h=400&auto=format&fit=crop",
        mentor: "Alex Gemini",
        category,
        difficulty,
        estimatedHours: hours,
        tags: [topic.split(' ')[0] || "General", "AI Track"],
        createdDate: new Date().toISOString().split('T')[0],
        updatedDate: new Date().toISOString().split('T')[0],
        todos: [],
        projects: [],
        modules: [
          {
            id: `mod-${Date.now()}`,
            title: "Phase 1: Getting Started with " + topic,
            description: "Fundamental overview of core syntaxes and concepts.",
            chapters: [
              {
                id: `chap-${Date.now()}`,
                title: "Chapter 1: Groundwork & Setup",
                lessons: [
                  {
                    id: `les-${Date.now()}`,
                    title: "Lesson 1: Introduction and Hello World",
                    completed: false,
                    duration: 40,
                    notes: "### Course Groundwork Notes\nAI was unable to compile a dynamic syllabus due to API configuration status. Type manually to edit the syllabus chapters.",
                    attachments: [],
                    tags: ["Intro", topic.split(' ')[0]]
                  }
                ]
              }
            ]
          }
        ]
      };
      onAddCourse(fallbackSpace);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const phases = [
    "Analyzing target topic and core educational objectives...",
    "Drafting customizable modular roadmap structure and chapters...",
    "Synthesizing lessons, practice sessions, and markdown templates...",
    "Refining syllabus timelines & deploying study track space..."
  ];

  const modalBg = themeMode === 'light' ? 'bg-white text-zinc-900 border-zinc-200' : 'bg-zinc-900 text-zinc-100 border-zinc-800/80';
  const overlayBg = themeMode === 'light' ? 'bg-zinc-900/35 backdrop-blur-sm' : 'bg-black/60 backdrop-blur-md';
  const inputBg = themeMode === 'light' ? 'bg-zinc-50 border-zinc-200 focus:bg-white text-zinc-900 placeholder-zinc-400' : 'bg-zinc-950 border-zinc-850 focus:bg-zinc-900 text-zinc-200 placeholder-zinc-600';

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${overlayBg} animate-fade-in`}>
      <div className={`w-full max-w-lg rounded-3xl border p-6 flex flex-col gap-5 relative overflow-hidden shadow-2xl ${modalBg}`}>
        
        {/* Sparkle background element */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-800/10 pb-3 z-10">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <BrainCircuit className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-display flex items-center gap-1.5">
                <span>AI Syllabus Generator</span>
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              </h3>
              <p className="text-[10px] text-zinc-400 font-mono mt-0.5">GENERATES A PLANNED SYLLABUS DIRECTLY</p>
            </div>
          </div>
          {!isLoading && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {isLoading ? (
          // Rich loading state panel
          <div className="py-12 flex flex-col items-center justify-center gap-4 text-center z-10 min-h-[350px]">
            <Loader2 className="w-10 h-10 text-indigo-400 animate-spin" />
            <div className="flex flex-col gap-1 mt-2">
              <span className="text-xs font-mono text-indigo-400 uppercase font-bold tracking-widest animate-pulse">
                Phase {loadingPhase + 1} of 4
              </span>
              <p className="text-sm font-semibold max-w-xs text-zinc-150 leading-relaxed font-sans px-2">
                {phases[loadingPhase]}
              </p>
              <p className="text-[10px] text-zinc-500 max-w-xs mt-1">
                Gemini is assembling deep conceptual modules, estimating chapter hours, and preparing starting notes templates.
              </p>
            </div>
          </div>
        ) : (
          // Modal Form
          <form onSubmit={handleGenerate} className="flex flex-col gap-4 z-10">
            {/* Topic Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                <Target className="w-3.5 h-3.5" />
                <span>What skill or topic do you want to master?</span>
                <InfoTooltip text="The specific skill or topic you want to generate a syllabus for." />
              </label>
              <input
                type="text"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Next.js App Router, Docker Containerization, Rust Cryptography"
                className={`px-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all ${inputBg}`}
              />
            </div>

            {/* Category selection */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Category</span>
                  <InfoTooltip text="The scientific or academic field classification." />
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`px-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all outline-none ${inputBg}`}
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Business & Finance">Business & Finance</option>
                  <option value="Creative Arts & Design">Creative Arts & Design</option>
                  <option value="Language Learning">Language Learning</option>
                  <option value="Self Development">Self Development</option>
                </select>
              </div>

              {/* Target Hours */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Estimated Hours</span>
                  <InfoTooltip text="The total target study hours for this course syllabus track." />
                </label>
                <input
                  type="number"
                  min={5}
                  max={120}
                  required
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                  className={`px-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all ${inputBg}`}
                />
              </div>
            </div>

            {/* Difficulty Level select pills */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider flex items-center">
                <span>Skill Difficulty Level</span>
                <InfoTooltip text="Your starting proficiency level for content customization." />
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Beginner', 'Intermediate', 'Advanced'] as const).map(diff => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setDifficulty(diff)}
                    className={`py-2 rounded-xl border text-xs font-semibold font-mono transition-all cursor-pointer ${
                      difficulty === diff
                        ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400 font-bold'
                        : 'bg-zinc-950/20 border-zinc-850 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom learning goals & focus */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider flex items-center">
                <span>Custom Goals or Specific Areas (Optional)</span>
                <InfoTooltip text="Specific tools, subtopics, or endpoints you want the AI to emphasize." />
              </label>
              <textarea
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                placeholder="e.g. Focus on deployment to AWS, skip elementary setups, write production ready code snippets."
                className={`px-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-indigo-500 h-16 resize-none transition-all ${inputBg}`}
              />
            </div>

            {/* Submit Actions */}
            <div className="flex gap-3 mt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 rounded-xl text-xs font-semibold border border-zinc-850 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-500/15 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Assemble Track</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
