/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ArrowLeft, Plus, Trash2, Code, FileText, Image, ChevronRight, 
  HelpCircle, Sparkles, GraduationCap, Clock, Check, ListTodo, FolderOpen,
  FolderMinus, Video, Link, Layers, AlertCircle
} from 'lucide-react';
import { Course, Module, Chapter, Lesson, CMSData, StudySpace } from '../../types/cms';
import InfoTooltip from './InfoTooltip';

interface CourseCreatorProps {
  cmsData: CMSData;
  onCancel: () => void;
  onSave: (newSpace: StudySpace) => void;
  themeMode: 'light' | 'dark';
}

const PRESET_COVERS = [
  {
    name: 'Modern Web / Coding',
    url: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=400&h=250&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&h=400&auto=format&fit=crop'
  },
  {
    name: 'Artificial Intelligence',
    url: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=400&h=250&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1200&h=400&auto=format&fit=crop'
  },
  {
    name: 'UI/UX & Creative',
    url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=400&h=250&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=1200&h=400&auto=format&fit=crop'
  },
  {
    name: 'Academic / Desk',
    url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=400&h=250&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1200&h=400&auto=format&fit=crop'
  },
  {
    name: 'Library / Classic Books',
    url: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?q=80&w=400&h=250&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1513001900722-370f803f498d?q=80&w=1200&h=400&auto=format&fit=crop'
  }
];

export default function CourseCreator({
  cmsData,
  onCancel,
  onSave,
  themeMode
}: CourseCreatorProps) {
  // Metadata state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Computer Science');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [estimatedHours, setEstimatedHours] = useState<number>(10);
  const [mentor, setMentor] = useState(cmsData.mentors[0]?.name || 'Alex Carter');
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(cmsData.workspaces[0]?.id || 'work-prog');
  
  // Tags state
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['TypeScript', 'Development']);

  // Images state
  const [coverIndex, setCoverIndex] = useState(0);
  const [customCoverUrl, setCustomCoverUrl] = useState('');
  const [customBannerUrl, setCustomBannerUrl] = useState('');

  // Curriculum State Builder
  const [modules, setModules] = useState<Module[]>([
    {
      id: `mod-${Date.now()}-1`,
      title: 'Module 1: Introduction & Environment Setup',
      description: 'Get familiar with foundational tools, initial workspace setup, and basics.',
      chapters: [
        {
          id: `chap-${Date.now()}-1`,
          title: 'Getting Started',
          lessons: [
            {
              id: `les-${Date.now()}-1`,
              title: 'Lesson 1.1: Environment Configuration & Hello World',
              completed: false,
              duration: 20,
              difficulty: 'Beginner',
              notes: '### Getting Started Notes\nWrite down essential setup commands or configuration rules.',
              attachments: [],
              tags: ['Intro', 'Setup'],
              resourceLink: 'https://developer.mozilla.org',
              videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
            }
          ]
        }
      ]
    }
  ]);

  // Validation
  const [error, setError] = useState<string | null>(null);

  // Tags Handlers
  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = tagInput.trim();
      if (val && !tags.includes(val)) {
        setTags([...tags, val]);
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  // Outline Editing Handlers
  const handleAddModule = () => {
    const modId = `mod-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newModule: Module = {
      id: modId,
      title: `Module ${modules.length + 1}: Custom Topic Expansion`,
      description: 'Deepen core understandings and explore progressive concepts.',
      chapters: [
        {
          id: `chap-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          title: 'Core Concepts',
          lessons: [
            {
              id: `les-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
              title: 'Lesson: Concepts Deep Dive',
              completed: false,
              duration: 30,
              difficulty: 'Intermediate',
              notes: '### Core Topic Notes\nType specific details and notes during learning study.',
              attachments: [],
              tags: ['Theory']
            }
          ]
        }
      ]
    };
    setModules([...modules, newModule]);
  };

  const handleUpdateModule = (moduleId: string, fields: Partial<Module>) => {
    setModules(modules.map(mod => {
      if (mod.id !== moduleId) return mod;
      return { ...mod, ...fields };
    }));
  };

  const handleRemoveModule = (moduleId: string) => {
    if (modules.length <= 1) {
      alert("A curriculum must have at least one module!");
      return;
    }
    setModules(modules.filter(m => m.id !== moduleId));
  };

  const handleAddChapter = (moduleId: string) => {
    setModules(modules.map(mod => {
      if (mod.id !== moduleId) return mod;
      const chapId = `chap-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const newChapter: Chapter = {
        id: chapId,
        title: `Chapter ${mod.chapters.length + 1}: Next Concept`,
        lessons: [
          {
            id: `les-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            title: 'New Lesson Video or Reading Material',
            completed: false,
            duration: 15,
            difficulty: 'Intermediate',
            notes: '### Lesson Notes Template\nEdit this lesson note description.',
            attachments: [],
            tags: ['Concepts']
          }
        ]
      };
      return { ...mod, chapters: [...mod.chapters, newChapter] };
    }));
  };

  const handleUpdateChapter = (moduleId: string, chapterId: string, fields: Partial<Chapter>) => {
    setModules(modules.map(mod => {
      if (mod.id !== moduleId) return mod;
      return {
        ...mod,
        chapters: mod.chapters.map(chap => {
          if (chap.id !== chapterId) return chap;
          return { ...chap, ...fields };
        })
      };
    }));
  };

  const handleRemoveChapter = (moduleId: string, chapterId: string) => {
    setModules(modules.map(mod => {
      if (mod.id !== moduleId) return mod;
      if (mod.chapters.length <= 1) {
        alert("Each module must have at least one chapter!");
        return mod;
      }
      return {
        ...mod,
        chapters: mod.chapters.filter(c => c.id !== chapterId)
      };
    }));
  };

  const handleAddLesson = (moduleId: string, chapterId: string) => {
    setModules(modules.map(mod => {
      if (mod.id !== moduleId) return mod;
      return {
        ...mod,
        chapters: mod.chapters.map(chap => {
          if (chap.id !== chapterId) return chap;
          const lessonId = `les-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
          const newLesson: Lesson = {
            id: lessonId,
            title: `Lesson ${chap.lessons.length + 1}: Interactive Concept Session`,
            completed: false,
            duration: 25,
            difficulty: 'Intermediate',
            notes: '### New Study Subject\nNotes template ready to edit.',
            attachments: [],
            tags: ['Practice']
          };
          return { ...chap, lessons: [...chap.lessons, newLesson] };
        })
      };
    }));
  };

  const handleUpdateLesson = (moduleId: string, chapterId: string, lessonId: string, fields: Partial<Lesson>) => {
    setModules(modules.map(mod => {
      if (mod.id !== moduleId) return mod;
      return {
        ...mod,
        chapters: mod.chapters.map(chap => {
          if (chap.id !== chapterId) return chap;
          return {
            ...chap,
            lessons: chap.lessons.map(les => {
              if (les.id !== lessonId) return les;
              return { ...les, ...fields };
            })
          };
        })
      };
    }));
  };

  const handleRemoveLesson = (moduleId: string, chapterId: string, lessonId: string) => {
    setModules(modules.map(mod => {
      if (mod.id !== moduleId) return mod;
      return {
        ...mod,
        chapters: mod.chapters.map(chap => {
          if (chap.id !== chapterId) return chap;
          if (chap.lessons.length <= 1) {
            alert("Each chapter must have at least one lesson!");
            return chap;
          }
          return {
            ...chap,
            lessons: chap.lessons.filter(l => l.id !== lessonId)
          };
        })
      };
    }));
  };

  // Commit Creation
  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Course Title is required.');
      return;
    }
    if (!description.trim()) {
      setError('Course Description is required.');
      return;
    }

    const coverImage = customCoverUrl.trim() || PRESET_COVERS[coverIndex].url;
    const banner = customBannerUrl.trim() || PRESET_COVERS[coverIndex].banner;

    const newCourse: Course = {
      workspaceId: selectedWorkspaceId,
      id: `space-manual-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      coverImage,
      banner,
      mentor,
      category,
      difficulty,
      estimatedHours: Number(estimatedHours) || 10,
      tags: tags.length > 0 ? tags : ['General Study'],
      modules,
      todos: [],
      projects: [],
      createdDate: new Date().toISOString().split('T')[0],
      updatedDate: new Date().toISOString().split('T')[0]
    };

    onSave(newCourse);
  };

  const themeCardBg = themeMode === 'light' ? 'bg-white border-zinc-200' : 'bg-zinc-900 border-zinc-800/80';
  const themeInputBg = themeMode === 'light' ? 'bg-zinc-50 border-zinc-200 text-zinc-900 focus:bg-white' : 'bg-zinc-950 border-zinc-850 text-zinc-200 focus:bg-zinc-900';
  const themeSectionLabel = themeMode === 'light' ? 'text-zinc-500' : 'text-zinc-400';

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 flex flex-col gap-8 animate-fade-in">
      
      {/* Upper navigation */}
      <div className="flex items-center justify-between border-b border-zinc-800/10 pb-4">
        <button
          onClick={onCancel}
          className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-zinc-100 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </button>
        <div className="flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-indigo-400" />
          <span className="text-[10px] font-mono text-zinc-400">Manual Syllabus Designer</span>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-display font-bold text-zinc-100 tracking-tight">Create Your Learning Track</h1>
        <p className="text-xs text-zinc-400">Enter custom curriculum parameters, define metadata, choose cover stylings, and design learning chapters to structure your workspace.</p>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleCreateCourse} className="flex flex-col gap-6">
        
        {/* SECTION 1: Course Metadata */}
        <div className={`p-6 rounded-2xl border flex flex-col gap-4 ${themeCardBg}`}>
          <h3 className="text-xs font-semibold font-mono text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-4 h-4" />
            <span>1. Course Metadata</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase flex items-center gap-1">
                <span>Syllabus Title</span>
                <span className="text-rose-500">*</span>
                <InfoTooltip text="The main display name of your learning track (e.g. Mastering Advanced Distributed Systems & Concurrency)." />
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Mastering Advanced Distributed Systems & Concurrency"
                className={`px-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all ${themeInputBg}`}
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase flex items-center gap-1">
                <span>Description</span>
                <span className="text-rose-500">*</span>
                <InfoTooltip text="High-level summary of curriculum objectives, topics, and expectations for the workspace tracker." />
              </label>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your syllabus objectives, curriculum topics, and expectations..."
                rows={3}
                className={`px-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all resize-none ${themeInputBg}`}
              />
            </div>

            {/* Category */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase flex items-center gap-1">
                <span>Category</span>
                <InfoTooltip text="Academic domain classification for dashboard sorting, roadmap linking, and smart metrics." />
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`px-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all ${themeInputBg}`}
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Artificial Intelligence">Artificial Intelligence</option>
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="Product Management">Product Management</option>
                <option value="Web Development">Web Development</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Business & Finance">Business & Finance</option>
                <option value="Interview Prep">Interview Prep</option>
              </select>
            </div>

            {/* Difficulty */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase flex items-center gap-1">
                <span>Difficulty</span>
                <InfoTooltip text="Assessed cognitive depth of the content, which will adapt note summaries and AI mentor suggestions." />
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Beginner', 'Intermediate', 'Advanced'] as const).map(diff => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setDifficulty(diff)}
                    className={`py-2 rounded-xl border text-xs font-mono font-semibold transition-all cursor-pointer ${
                      difficulty === diff
                        ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400 font-bold'
                        : 'bg-zinc-950/40 border-zinc-850 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Estimated Duration */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase flex items-center gap-1">
                <span>Estimated Study Hours</span>
                <InfoTooltip text="Calculated content runtime to configure daily study targets and weekly visual analytics heatmaps." />
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  value={estimatedHours}
                  onChange={(e) => setEstimatedHours(Math.max(1, Number(e.target.value)))}
                  className={`px-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all w-24 ${themeInputBg}`}
                />
                <span className="text-xs text-zinc-500">hours of content</span>
              </div>
            </div>

            {/* Target Workspace */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase flex items-center gap-1">
                <span>Target Workspace Category</span>
                <InfoTooltip text="The physical parent workspace where this track will be saved under." />
              </label>
              <select
                value={selectedWorkspaceId}
                onChange={(e) => setSelectedWorkspaceId(e.target.value)}
                className={`px-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all ${themeInputBg}`}
              >
                {cmsData.workspaces.map(w => (
                  <option key={w.id} value={w.id}>{w.name} Workspace</option>
                ))}
              </select>
            </div>

            {/* Mentor Specialty */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase flex items-center gap-1">
                <span>AI Study Mentor Guide</span>
                <InfoTooltip text="The pre-configured AI guide who handles interactive inquiries, notes review, and custom quizzes." />
              </label>
              <select
                value={mentor}
                onChange={(e) => setMentor(e.target.value)}
                className={`px-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all ${themeInputBg}`}
              >
                {cmsData.mentors.map(m => (
                  <option key={m.id} value={m.name}>{m.name} ({m.specialty})</option>
                ))}
                <option value="Socrates">Socrates (Philosophical Analogies)</option>
                <option value="Richard Feynman">Richard Feynman (Feynman Learning Technique)</option>
              </select>
            </div>

            {/* Tags section */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase flex items-center gap-1">
                <span>Search Tags (Press Enter to add)</span>
                <InfoTooltip text="Key terms used for instant global command palette searches and matching resources." />
              </label>
              <div className={`p-2.5 rounded-xl border min-h-[42px] flex flex-wrap gap-1.5 ${themeInputBg}`}>
                {tags.map(t => (
                  <span key={t} className="flex items-center gap-1 pl-2 pr-1.5 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-400 font-mono text-[10px] font-semibold border border-indigo-500/20 animate-fade-in">
                    <span>{t}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t)}
                      className="text-indigo-400 hover:text-indigo-200 ml-0.5 focus:outline-none font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Type tag and enter..."
                  className="bg-transparent border-none outline-none focus:ring-0 text-xs p-0 flex-1 min-w-[120px]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Visual Styling selection */}
        <div className={`p-6 rounded-2xl border flex flex-col gap-4 ${themeCardBg}`}>
          <h3 className="text-xs font-semibold font-mono text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
            <Image className="w-4 h-4" />
            <span>2. Visual Branding Cover Selection</span>
          </h3>

          <div className="flex flex-col gap-3">
            <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase flex items-center gap-1">
              <span>Select Preset Backdrop</span>
              <InfoTooltip text="Background graphic used as the background layout for syllabus page covers." />
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {PRESET_COVERS.map((cov, idx) => {
                const isSelected = coverIndex === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setCoverIndex(idx);
                      setCustomCoverUrl('');
                      setCustomBannerUrl('');
                    }}
                    className={`flex flex-col rounded-xl overflow-hidden border text-left transition-all ${
                      isSelected ? 'border-indigo-500 ring-1 ring-indigo-500 shadow-md' : 'border-zinc-850 hover:border-zinc-600'
                    }`}
                  >
                    <div className="h-14 w-full relative">
                      <img
                        src={cov.url}
                        alt={cov.name}
                        className="w-full h-full object-cover"
                      />
                      {isSelected && (
                        <div className="absolute top-1 right-1 p-0.5 bg-indigo-500 text-white rounded-full">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </div>
                    <span className="p-1.5 text-[9px] font-mono text-zinc-400 truncate w-full block">
                      {cov.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Custom URL Option */}
            <div className="flex flex-col sm:flex-row gap-3 mt-1 pt-3 border-t border-zinc-800/10">
              <div className="flex-1 flex flex-col gap-1.5">
                <label className="text-[9px] font-mono text-zinc-500">Or Paste Custom Cover Image (URL)</label>
                <input
                  type="url"
                  value={customCoverUrl}
                  onChange={(e) => setCustomCoverUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className={`px-3 py-1.5 text-[11px] rounded-lg border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${themeInputBg}`}
                />
              </div>
              <div className="flex-1 flex flex-col gap-1.5">
                <label className="text-[9px] font-mono text-zinc-500">Or Paste Custom Banner Image (URL)</label>
                <input
                  type="url"
                  value={customBannerUrl}
                  onChange={(e) => setCustomBannerUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className={`px-3 py-1.5 text-[11px] rounded-lg border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${themeInputBg}`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: Curriculum outline builder */}
        <div className={`p-6 rounded-2xl border flex flex-col gap-5 ${themeCardBg}`}>
          <div className="flex items-center justify-between border-b border-zinc-800/10 pb-3">
            <div>
              <h3 className="text-xs font-semibold font-mono text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                <Code className="w-4 h-4" />
                <span>3. Build Curriculum Outline</span>
              </h3>
              <p className="text-[10px] text-zinc-500 mt-0.5">Customize modules, chapter sections, lessons, and custom study files</p>
            </div>
            
            <button
              type="button"
              onClick={handleAddModule}
              className="flex items-center gap-1 px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 rounded-xl text-[10px] font-mono font-bold transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Module</span>
            </button>
          </div>

          <div className="flex flex-col gap-6">
            {modules.map((mod, mIdx) => (
              <div key={mod.id} className="p-4 rounded-xl border border-zinc-800/60 bg-zinc-950/20 flex flex-col gap-4">
                
                {/* Module Heading bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-zinc-950/40 p-2.5 rounded-lg border border-zinc-850">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                    <input
                      type="text"
                      required
                      value={mod.title}
                      onChange={(e) => handleUpdateModule(mod.id, { title: e.target.value })}
                      placeholder="Module Title"
                      className="text-xs font-bold text-zinc-100 bg-transparent border-none outline-none focus:ring-0 p-0 flex-1 min-w-0"
                    />
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleAddChapter(mod.id)}
                      className="px-2 py-1 bg-zinc-900 hover:bg-zinc-850 text-indigo-400 text-[9px] font-mono font-bold rounded border border-indigo-500/10 transition-all cursor-pointer"
                    >
                      + Add Chapter
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveModule(mod.id)}
                      disabled={modules.length <= 1}
                      className="p-1 hover:text-rose-400 text-zinc-500 transition-colors cursor-pointer disabled:opacity-30"
                      title="Delete Module"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Module Description */}
                <div className="flex flex-col gap-1 px-1">
                  <label className="text-[8px] font-mono text-zinc-500 uppercase font-bold">Module Overview</label>
                  <input
                    type="text"
                    value={mod.description || ''}
                    onChange={(e) => handleUpdateModule(mod.id, { description: e.target.value })}
                    placeholder="Provide a brief summary or goal of this learning block..."
                    className="bg-transparent text-[11px] text-zinc-400 border-b border-zinc-850 focus:border-indigo-500 outline-none pb-0.5 w-full font-mono"
                  />
                </div>

                {/* Module Chapters nested block */}
                <div className="flex flex-col gap-3 pl-4 border-l border-zinc-850">
                  {mod.chapters.map((chap, cIdx) => (
                    <div key={chap.id} className="p-3 rounded-lg border border-zinc-900/50 bg-zinc-950/10 flex flex-col gap-3">
                      
                      {/* Chapter Bar */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className="text-[10px] font-mono font-bold text-indigo-400">Chapter:</span>
                          <input
                            type="text"
                            required
                            value={chap.title}
                            onChange={(e) => handleUpdateChapter(mod.id, chap.id, { title: e.target.value })}
                            placeholder="Chapter Title"
                            className="text-xs font-semibold text-zinc-200 bg-transparent border-none outline-none focus:ring-0 p-0 flex-1 min-w-0"
                          />
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleAddLesson(mod.id, chap.id)}
                            className="px-1.5 py-0.5 bg-zinc-900 hover:bg-zinc-850 text-indigo-400 text-[9px] font-mono font-semibold rounded border border-indigo-500/10 cursor-pointer"
                          >
                            + Add Lesson
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveChapter(mod.id, chap.id)}
                            disabled={mod.chapters.length <= 1}
                            className="p-1 hover:text-rose-400 text-zinc-500 transition-colors disabled:opacity-30 cursor-pointer"
                            title="Delete Chapter"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Chapter Lessons Block */}
                      <div className="flex flex-col gap-2.5 pl-3 border-l border-zinc-900">
                        {chap.lessons.map((les, lIdx) => (
                          <div key={les.id} className="p-2.5 rounded border border-zinc-900 bg-zinc-950/30 flex flex-col gap-2">
                            
                            {/* Lesson Main input and deletion */}
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                                <span className="text-[9px] font-mono text-zinc-500">Lesson:</span>
                                <input
                                  type="text"
                                  required
                                  value={les.title}
                                  onChange={(e) => handleUpdateLesson(mod.id, chap.id, les.id, { title: e.target.value })}
                                  placeholder="Lesson Subject title"
                                  className="text-xs font-medium text-zinc-300 bg-transparent border-none outline-none focus:ring-0 p-0 flex-1 min-w-0"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveLesson(mod.id, chap.id, les.id)}
                                disabled={chap.lessons.length <= 1}
                                className="text-zinc-600 hover:text-rose-400 p-0.5 transition-colors disabled:opacity-30 cursor-pointer"
                                title="Delete Lesson"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Lesson Config Attributes (Grid) */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-1">
                              {/* Duration */}
                              <div className="flex items-center gap-1.5">
                                <Clock className="w-3 h-3 text-zinc-500" />
                                <span className="text-[9px] font-mono text-zinc-500">Est. Mins:</span>
                                <input
                                  type="number"
                                  min={1}
                                  value={les.duration}
                                  onChange={(e) => handleUpdateLesson(mod.id, chap.id, les.id, { duration: Math.max(1, Number(e.target.value)) })}
                                  className="w-12 bg-zinc-900 border border-zinc-800 rounded px-1.5 py-0.5 text-[10px] font-mono text-zinc-300 outline-none"
                                />
                              </div>

                              {/* Media / Video link option */}
                              <div className="flex items-center gap-1.5 sm:col-span-2">
                                <Video className="w-3 h-3 text-zinc-500" />
                                <span className="text-[9px] font-mono text-zinc-500">Lecture Link:</span>
                                <input
                                  type="url"
                                  value={les.videoUrl || ''}
                                  onChange={(e) => handleUpdateLesson(mod.id, chap.id, les.id, { videoUrl: e.target.value })}
                                  placeholder="e.g. https://www.youtube.com/watch?..."
                                  className="flex-1 bg-zinc-900 border border-zinc-800 rounded px-1.5 py-0.5 text-[10px] font-mono text-zinc-300 outline-none min-w-0"
                                />
                              </div>

                              {/* Resource links */}
                              <div className="flex items-center gap-1.5 sm:col-span-3">
                                <Link className="w-3 h-3 text-zinc-500" />
                                <span className="text-[9px] font-mono text-zinc-500">Resource File:</span>
                                <input
                                  type="url"
                                  value={les.resourceLink || ''}
                                  onChange={(e) => handleUpdateLesson(mod.id, chap.id, les.id, { resourceLink: e.target.value })}
                                  placeholder="e.g. https://github.com/projects/blueprint..."
                                  className="flex-1 bg-zinc-900 border border-zinc-800 rounded px-1.5 py-0.5 text-[10px] font-mono text-zinc-300 outline-none min-w-0"
                                />
                              </div>
                            </div>
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

        {/* Form Action buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800/10">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50 transition-colors cursor-pointer border border-transparent"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-xs font-semibold cursor-pointer select-none transition-all shadow-lg shadow-indigo-500/25"
          >
            <Sparkles className="w-4 h-4" />
            <span>Create Study Space Track</span>
          </button>
        </div>

      </form>
    </div>
  );
}
