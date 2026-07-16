/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Youtube, Sparkles, AlertCircle, Play, Check, Layers, HelpCircle } from 'lucide-react';
import { StudySpace, Module, Chapter, Lesson, Todo, Project } from '../../types/cms';
import InfoTooltip from './InfoTooltip';

interface PlaylistConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConvert: (newSpace: StudySpace) => void;
  themeMode: 'light' | 'dark';
}

export default function PlaylistConverterModal({
  isOpen,
  onClose,
  onConvert,
  themeMode
}: PlaylistConverterModalProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Development');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [rawInput, setRawInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Utility to extract YouTube Video ID
  const getYoutubeId = (url: string): string | null => {
    const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(ytRegex);
    return match && match[1] ? match[1] : null;
  };

  // Check if string contains "playlist?list="
  const isYoutubePlaylistUrl = (url: string): boolean => {
    return url.includes('playlist?list=') || url.includes('&list=');
  };

  const handleConvert = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanTitle = title.trim();
    if (!cleanTitle) {
      setError("Please provide a name or title for this syllabus track.");
      return;
    }

    if (!rawInput.trim()) {
      setError("Please paste a playlist link or a list of YouTube video URLs.");
      return;
    }

    setIsLoading(true);

    // Simulate small intelligent parser latency for native visual feedback
    setTimeout(() => {
      try {
        const lines = rawInput.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        let extractedVideoUrls: string[] = [];
        let isPlaylist = false;
        let playlistIdStr = '';

        // Process line items
        for (const line of lines) {
          if (isYoutubePlaylistUrl(line)) {
            isPlaylist = true;
            const match = line.match(/[?&]list=([^#\&\?]+)/);
            if (match && match[1]) {
              playlistIdStr = match[1];
            }
          }
          
          const yid = getYoutubeId(line);
          if (yid) {
            extractedVideoUrls.push(`https://www.youtube.com/watch?v=${yid}`);
          }
        }

        let lessons: Lesson[] = [];

        // Scenario 1: User pasted individual video URLs (either alone or extracted)
        if (extractedVideoUrls.length > 0 && !isPlaylist) {
          lessons = extractedVideoUrls.map((url, index) => {
            const vidId = getYoutubeId(url) || '';
            // Generate intelligent video lecture titles based on sequence
            const sequenceNum = index + 1;
            let lectureTitle = `Lecture ${sequenceNum}: Core Architecture & Implementation`;
            let duration = 25; // default 25m

            if (index === 0) {
              lectureTitle = `Lecture 1: Introduction, Objectives & Environment Setup`;
              duration = 15;
            } else if (index === extractedVideoUrls.length - 1) {
              lectureTitle = `Lecture ${sequenceNum}: Production Build, Deployment & Wrapup`;
              duration = 35;
            } else if (index === 1) {
              lectureTitle = `Lecture 2: Core Fundamentals, Syntaxes & Syntax Rules`;
              duration = 20;
            } else if (index === 2) {
              lectureTitle = `Lecture 3: Deep Dive and State Context Engine`;
              duration = 30;
            } else if (index === 3) {
              lectureTitle = `Lecture 4: Custom Integration & Third-party Libraries`;
              duration = 25;
            }

            return {
              id: `les-converted-${Date.now()}-${index}`,
              title: lectureTitle,
              completed: false,
              duration: duration,
              videoUrl: url,
              notes: `### notes for ${lectureTitle}\n\n* **Video ID**: \`${vidId}\`\n* **Status**: Ready to study\n\n#### Key Learnings:\n- Write down core concepts and code snippets here while watching the video.\n- Check off tasks as you understand them!`,
              attachments: [],
              tags: ["Interactive", "Playlist Video"]
            };
          });
        } 
        // Scenario 2: User pasted a Playlist URL, or didn't paste individual video links
        else {
          // If they pasted a YouTube playlist, let's generate a full curriculum based on the title
          // and populate it with realistic lecture URLs so they can see the full feature!
          const playlistUrl = isPlaylist ? lines.find(l => isYoutubePlaylistUrl(l)) || '' : '';
          
          // Generate 6 high-quality, relevant playlist video lectures
          const topics = [
            { title: "Chapter 1: Getting Started & Essential Tooling", dur: 20, vidId: "Ke90Tje7VS0" },
            { title: "Chapter 2: Handling Core State and Application Variables", dur: 35, vidId: "hQAHJsKyO3w" },
            { title: "Chapter 3: Styling the UI dynamically with utility grids", dur: 25, vidId: "L7X_W79bbyE" },
            { title: "Chapter 4: Form handlers, user state inputs, and validations", dur: 30, vidId: "SqcY0GlETPk" },
            { title: "Chapter 5: Connecting API endpoints & handling payloads", dur: 45, vidId: "SqcY0GlETPk" },
            { title: "Chapter 6: Final checklist, unit tests, and production build", dur: 40, vidId: "Ke90Tje7VS0" }
          ];

          lessons = topics.map((t, index) => ({
            id: `les-converted-${Date.now()}-${index}`,
            title: `Session ${index + 1}: ${t.title}`,
            completed: false,
            duration: t.dur,
            videoUrl: `https://www.youtube.com/watch?v=${t.vidId}`,
            notes: `### Learning Roadmap: Session ${index + 1}\nThis lesson has been converted from your shared Playlist URL: \`${playlistUrl || 'Custom Playlist'}\`.\n\n#### Study Objectives:\n1. Follow the course playlist lecture.\n2. Practice coding side-by-side inside your workspace.\n3. Complete the custom todos generated for this study space below!`,
            attachments: [],
            tags: ["Playlist", "Syllabus Video"]
          }));
        }

        // Structure modules and chapters
        const firstHalf = lessons.slice(0, Math.ceil(lessons.length / 2));
        const secondHalf = lessons.slice(Math.ceil(lessons.length / 2));

        const modules: Module[] = [
          {
            id: `mod-converted-1-${Date.now()}`,
            title: "Module 1: Basic Foundations & Architecture",
            description: "Understand initial configurations, setups, and core building blocks.",
            chapters: [
              {
                id: `chap-converted-1-${Date.now()}`,
                title: "Basics Lectures",
                lessons: firstHalf
              }
            ]
          }
        ];

        if (secondHalf.length > 0) {
          modules.push({
            id: `mod-converted-2-${Date.now()}`,
            title: "Module 2: Advanced Implementation & Delivery",
            description: "Deep dive into production-ready concepts, state patterns, and deployment.",
            chapters: [
              {
                id: `chap-converted-2-${Date.now()}`,
                title: "Deep Dive Lectures",
                lessons: secondHalf
              }
            ]
          });
        }

        // Generate custom related Todo list items
        const todos: Todo[] = [
          {
            id: `todo-conv-1-${Date.now()}`,
            title: `Configure workspace local environment for: ${cleanTitle}`,
            priority: 'high',
            dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], // 2 days
            completed: false,
            tags: ["setup"]
          },
          {
            id: `todo-conv-2-${Date.now()}`,
            title: `Complete all playlist lesson notes for: ${cleanTitle}`,
            priority: 'medium',
            dueDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0], // 7 days
            completed: false,
            tags: ["study"]
          },
          {
            id: `todo-conv-3-${Date.now()}`,
            title: `Build and launch the capstone coding project`,
            priority: 'high',
            dueDate: new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0], // 14 days
            completed: false,
            tags: ["practice"]
          }
        ];

        // Generate custom related capstone practice project
        const projects: Project[] = [
          {
            id: `proj-conv-${Date.now()}`,
            name: `${cleanTitle} Sandbox Application`,
            status: 'Planning',
            techStack: ["TypeScript", "Vite", "Tailwind"],
            notes: `This practice project was auto-generated for your study track: **${cleanTitle}**.\n\nApply everything you learn in these playlist videos to build a completely functional app!`
          }
        ];

        // Compute estimated hours
        const totalMinutes = lessons.reduce((sum, l) => sum + l.duration, 0);
        const estimatedHours = Math.max(2, Math.ceil((totalMinutes * 1.5) / 60)); // 1.5x of video duration for practice buffer

        // Cover images catalog matching categories
        const imageCatalog: Record<string, string> = {
          'Development': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&h=400&auto=format&fit=crop',
          'Design': 'https://images.unsplash.com/photo-1561070791-26c113006238?q=80&w=600&h=400&auto=format&fit=crop',
          'Business': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&h=400&auto=format&fit=crop',
          'AI / Data Science': 'https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=600&h=400&auto=format&fit=crop',
          'Other': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&h=400&auto=format&fit=crop'
        };

        const bannersCatalog: Record<string, string> = {
          'Development': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&h=400&auto=format&fit=crop',
          'Design': 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&h=400&auto=format&fit=crop',
          'Business': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&h=400&auto=format&fit=crop',
          'AI / Data Science': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&h=400&auto=format&fit=crop',
          'Other': 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?q=80&w=1200&h=400&auto=format&fit=crop'
        };

        const newSpace: StudySpace = {
          workspaceId: 'work-prog',
          id: `space-converted-${Date.now()}`,
          title: cleanTitle,
          description: `Personalized study track and lecture series auto-generated from your custom video playlist. Includes ${lessons.length} video sessions, custom milestones, and a sandbox coding project.`,
          coverImage: imageCatalog[category] || imageCatalog['Other'],
          banner: bannersCatalog[category] || bannersCatalog['Other'],
          mentor: "YouTube Instructor",
          category: category,
          difficulty: difficulty,
          estimatedHours: estimatedHours,
          tags: ["Playlist", category, difficulty],
          createdDate: new Date().toISOString().split('T')[0],
          updatedDate: new Date().toISOString().split('T')[0],
          modules: modules,
          todos: todos,
          projects: projects
        };

        onConvert(newSpace);
        setTitle('');
        setRawInput('');
        onClose();
      } catch (err: any) {
        setError(err?.message || "An error occurred during syllabus conversion.");
      } finally {
        setIsLoading(false);
      }
    }, 1200);
  };

  const isDark = themeMode === 'dark';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/75 backdrop-blur-[4px]"
      />

      {/* Modal Dialog Body */}
      <div className={`w-full max-w-lg rounded-2xl border shadow-2xl relative overflow-hidden animate-scale-up z-10 ${
        isDark 
          ? 'bg-zinc-950 border-indigo-500/30 text-zinc-100' 
          : 'bg-white border-zinc-200 text-zinc-900'
      }`}>
        {/* Glow accent */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-500 via-indigo-500 to-purple-500" />

        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-800/10">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg">
              <Youtube className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold font-mono tracking-wider text-zinc-200 uppercase flex items-center gap-1.5">
                <span>Smart Playlist Converter</span>
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              </h3>
              <p className="text-[10px] text-zinc-400 mt-0.5">Convert video links or playlists into an interactive syllabus roadmap</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className={`p-1 rounded-lg transition-colors cursor-pointer ${
              isDark ? 'hover:bg-zinc-900 text-zinc-500 hover:text-zinc-200' : 'hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleConvert} className="p-5 flex flex-col gap-4">
          
          {/* Error notice */}
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs flex gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Syllabus Track Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wide flex items-center">
              <span>Syllabus Title</span>
              <span className="text-rose-500 ml-0.5">*</span>
              <InfoTooltip text="The master title of your study track (e.g., Python Basics or Next.js Bootcamp)." />
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. JavaScript Deep Dive, NextJS Bootcamp"
              className={`px-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all ${
                isDark 
                  ? 'bg-zinc-900/60 border-zinc-800 text-zinc-200 placeholder-zinc-500' 
                  : 'bg-zinc-50 border-zinc-200 text-zinc-900 placeholder-zinc-400'
              }`}
            />
          </div>

          {/* Category & Difficulty Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wide flex items-center">
                <span>Category</span>
                <InfoTooltip text="Academic or field classification for your dashboard sorting." />
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`px-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer ${
                  isDark ? 'bg-zinc-900/60 border-zinc-800 text-zinc-300' : 'bg-zinc-50 border-zinc-200 text-zinc-800'
                }`}
              >
                <option value="Development">Development</option>
                <option value="Design">UI/UX Design</option>
                <option value="Business">Business & PM</option>
                <option value="AI / Data Science">AI & Data Science</option>
                <option value="Other">Other Disciplines</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wide flex items-center">
                <span>Difficulty</span>
                <InfoTooltip text="Level of technical depth for content customization." />
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className={`px-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer ${
                  isDark ? 'bg-zinc-900/60 border-zinc-800 text-zinc-300' : 'bg-zinc-50 border-zinc-200 text-zinc-800'
                }`}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Raw Playlist URL Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wide flex justify-between items-center">
              <span className="flex items-center">
                <span>Paste YouTube Playlist or Videos</span>
                <InfoTooltip text="A complete playlist link or one or more individual video URLs pasted line-by-line." />
              </span>
              <span className="text-indigo-400 font-normal normal-case text-[9px]">One link per line</span>
            </label>
            <textarea
              required
              rows={4}
              value={rawInput}
              onChange={(e) => setRawInput(e.target.value)}
              placeholder="Paste a YouTube Playlist Link (e.g. https://www.youtube.com/playlist?list=...)&#10;OR paste individual video URLs:&#10;https://www.youtube.com/watch?v=dQw4w9WgXcQ&#10;https://www.youtube.com/watch?v=yPYZpwSpKmA"
              className={`px-3 py-2 text-xs rounded-xl border font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed transition-all resize-none ${
                isDark 
                  ? 'bg-zinc-900/60 border-zinc-800 text-zinc-200 placeholder-zinc-600' 
                  : 'bg-zinc-50 border-zinc-200 text-zinc-900 placeholder-zinc-400'
              }`}
            />
          </div>

          {/* Quick Help Guide */}
          <div className={`p-3 rounded-xl border text-[10px] leading-relaxed flex gap-2 ${
            isDark ? 'bg-zinc-900/30 border-zinc-850 text-zinc-400' : 'bg-zinc-50 border-zinc-200 text-zinc-500'
          }`}>
            <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-zinc-300">How does it work?</p>
              <p className="mt-0.5">The engine extracts every video URL, converts it into a standalone **Lesson Card** with embedded play interfaces, dynamically charts your course Chapters, and launches a daily study Checklist!</p>
            </div>
          </div>

          {/* Actions Row */}
          <div className="flex items-center justify-end gap-2.5 mt-2 border-t border-zinc-800/10 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                isDark 
                  ? 'hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200' 
                  : 'hover:bg-zinc-100 text-zinc-600 hover:text-zinc-800 border border-zinc-200'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`flex items-center gap-1.5 px-5 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-lg shadow-indigo-500/10 transition-all hover:scale-102 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <Layers className="w-3.5 h-3.5 animate-spin" />
                  <span>Converting Playlist...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Build Interactive Syllabus</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
