/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowLeft, BookOpen, CheckSquare, Briefcase, Plus, Trash2, Check, ExternalLink, Play, Sparkles, BrainCircuit, FileText, Image as ImageIcon, Video, HelpCircle, Loader2, Award, RotateCcw, Pencil } from 'lucide-react';
import { StudySpace, Module, Chapter, Lesson, Todo, Project } from '../../types/cms';
import InfoTooltip from './InfoTooltip';

interface StudySpaceDetailProps {
  space: StudySpace;
  onBack: () => void;
  onSelectLesson: (lessonId: string) => void;
  onAddTodo: (title: string, priority: 'low' | 'medium' | 'high', dueDate?: string) => void;
  onToggleTodo: (todoId: string) => void;
  onDeleteTodo: (todoId: string) => void;
  onAddProject: (project: Omit<Project, 'id'>) => void;
  onDeleteProject: (projectId: string) => void;
  themeMode: 'light' | 'dark';
  onUpdateSpace?: (updatedSpace: StudySpace) => void;
  onDeleteSpace?: (spaceId: string) => void;
}

interface TestState {
  title: string;
  questions: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    type?: string;
    lessonRef?: string;
  }[];
  currentIndex: number;
  selectedOption: number | null;
  hasSubmittedAnswer: boolean;
  score: number;
  userChoices?: (number | null)[];
}

export default function StudySpaceDetail({
  space,
  onBack,
  onSelectLesson,
  onAddTodo,
  onToggleTodo,
  onDeleteTodo,
  onAddProject,
  onDeleteProject,
  themeMode,
  onUpdateSpace,
  onDeleteSpace
}: StudySpaceDetailProps) {
  const [activeTab, setActiveTab] = useState<'syllabus' | 'todos' | 'projects'>('syllabus');

  // Interactive Creator triggers
  const [showAddModule, setShowAddModule] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState('');

  const [activeAddChapterModId, setActiveAddChapterModId] = useState<string | null>(null);
  const [newChapterTitle, setNewChapterTitle] = useState('');

  const [activeAddLessonChapId, setActiveAddLessonChapId] = useState<string | null>(null);
  const [activeAddLessonModId, setActiveAddLessonModId] = useState<string | null>(null);

  // Lesson creator inputs
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonDuration, setNewLessonDuration] = useState(15);
  const [newLessonContentType, setNewLessonContentType] = useState<'video' | 'pdf' | 'image' | 'web' | 'text'>('video');
  const [newLessonUrl, setNewLessonUrl] = useState('');
  const [newLessonNotes, setNewLessonNotes] = useState('');
  const [newLessonTags, setNewLessonTags] = useState('');

  // Lesson editing state
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [editLessonTitle, setEditLessonTitle] = useState('');
  const [editLessonDuration, setEditLessonDuration] = useState(15);
  const [editLessonContentType, setEditLessonContentType] = useState<'video' | 'pdf' | 'image' | 'web' | 'text'>('video');
  const [editLessonUrl, setEditLessonUrl] = useState('');
  const [editLessonNotes, setEditLessonNotes] = useState('');
  const [editLessonTags, setEditLessonTags] = useState('');

  // Module editing state
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
  const [editModuleTitle, setEditModuleTitle] = useState('');

  // Chapter editing state
  const [editingChapterId, setEditingChapterId] = useState<string | null>(null);
  const [editChapterTitle, setEditChapterTitle] = useState('');

  // AI Test suite state
  const [activeTest, setActiveTest] = useState<TestState | null>(null);
  const [isTestGenerating, setIsTestGenerating] = useState(false);
  const [requestedQuestionCount, setRequestedQuestionCount] = useState(5);
  const [isCourseAssessment, setIsCourseAssessment] = useState(false);
  const [assessmentDifficulty, setAssessmentDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');

  // Todo input state
  const [todoTitle, setTodoTitle] = useState('');
  const [todoPriority, setTodoPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [todoDueDate, setTodoDueDate] = useState('');

  // Project input state
  const [showProjForm, setShowProjForm] = useState(false);
  const [projName, setProjName] = useState('');
  const [projStatus, setProjStatus] = useState<'Planning' | 'In Progress' | 'Completed' | 'On Hold'>('In Progress');
  const [projGithub, setProjGithub] = useState('');
  const [projLive, setProjLive] = useState('');
  const [projStack, setProjStack] = useState('');
  const [projNotes, setProjNotes] = useState('');

  // Study Space details editing state
  const [isEditingSpace, setIsEditingSpace] = useState(false);
  const [editSpaceTitle, setEditSpaceTitle] = useState('');
  const [editSpaceDescription, setEditSpaceDescription] = useState('');
  const [editSpaceMentor, setEditSpaceMentor] = useState('');
  const [editSpaceCategory, setEditSpaceCategory] = useState('');
  const [editSpaceDifficulty, setEditSpaceDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [editSpaceEstimatedHours, setEditSpaceEstimatedHours] = useState(10);
  const [editSpaceTags, setEditSpaceTags] = useState('');

  // Save full customized space callback
  const saveUpdatedSpace = (updated: StudySpace) => {
    if (onUpdateSpace) {
      onUpdateSpace(updated);
    }
  };

  const handleSaveSpaceDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editSpaceTitle.trim()) return;
    const updated: StudySpace = {
      ...space,
      title: editSpaceTitle.trim(),
      description: editSpaceDescription.trim(),
      mentor: editSpaceMentor.trim(),
      category: editSpaceCategory.trim(),
      difficulty: editSpaceDifficulty,
      estimatedHours: Number(editSpaceEstimatedHours) || 10,
      tags: editSpaceTags.split(',').map(t => t.trim()).filter(Boolean),
      updatedDate: new Date().toISOString().split('T')[0]
    };
    saveUpdatedSpace(updated);
    setIsEditingSpace(false);
  };

  // 1. Module Management
  const handleCreateModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModuleTitle.trim()) return;

    const newModule: Module = {
      id: `mod-${Date.now()}`,
      title: newModuleTitle.trim(),
      description: 'Custom learning track module manually built by user.',
      chapters: []
    };

    const updated = {
      ...space,
      modules: [...space.modules, newModule],
      updatedDate: new Date().toISOString().split('T')[0]
    };

    saveUpdatedSpace(updated);
    setNewModuleTitle('');
    setShowAddModule(false);
  };

  // 2. Chapter Management
  const handleCreateChapter = (moduleId: string) => {
    if (!newChapterTitle.trim()) return;

    const newChapter: Chapter = {
      id: `chap-${Date.now()}`,
      title: newChapterTitle.trim(),
      lessons: []
    };

    const updatedModules = space.modules.map(mod => {
      if (mod.id !== moduleId) return mod;
      return {
        ...mod,
        chapters: [...mod.chapters, newChapter]
      };
    });

    const updated = {
      ...space,
      modules: updatedModules,
      updatedDate: new Date().toISOString().split('T')[0]
    };

    saveUpdatedSpace(updated);
    setNewChapterTitle('');
    setActiveAddChapterModId(null);
  };

  const handleUpdateModule = (moduleId: string, title: string) => {
    if (!title.trim()) return;
    const updatedModules = space.modules.map(mod => {
      if (mod.id !== moduleId) return mod;
      return {
        ...mod,
        title: title.trim()
      };
    });
    const updated = {
      ...space,
      modules: updatedModules,
      updatedDate: new Date().toISOString().split('T')[0]
    };
    saveUpdatedSpace(updated);
    setEditingModuleId(null);
  };

  const handleDeleteModule = (moduleId: string) => {
    const updatedModules = space.modules.filter(mod => mod.id !== moduleId);
    const updated = {
      ...space,
      modules: updatedModules,
      updatedDate: new Date().toISOString().split('T')[0]
    };
    saveUpdatedSpace(updated);
  };

  const handleUpdateChapter = (moduleId: string, chapterId: string, title: string) => {
    if (!title.trim()) return;
    const updatedModules = space.modules.map(mod => {
      if (mod.id !== moduleId) return mod;
      return {
        ...mod,
        chapters: mod.chapters.map(chap => {
          if (chap.id !== chapterId) return chap;
          return {
            ...chap,
            title: title.trim()
          };
        })
      };
    });
    const updated = {
      ...space,
      modules: updatedModules,
      updatedDate: new Date().toISOString().split('T')[0]
    };
    saveUpdatedSpace(updated);
    setEditingChapterId(null);
  };

  const handleDeleteChapter = (moduleId: string, chapterId: string) => {
    const updatedModules = space.modules.map(mod => {
      if (mod.id !== moduleId) return mod;
      return {
        ...mod,
        chapters: mod.chapters.filter(chap => chap.id !== chapterId)
      };
    });
    const updated = {
      ...space,
      modules: updatedModules,
      updatedDate: new Date().toISOString().split('T')[0]
    };
    saveUpdatedSpace(updated);
  };

  // 3. Lesson Management
  const handleCreateLesson = (moduleId: string, chapterId: string) => {
    if (!newLessonTitle.trim()) return;

    // Build the dynamic target attributes depending on the type selected
    const videoUrl = newLessonContentType === 'video' ? newLessonUrl : undefined;
    const pdfUrl = newLessonContentType === 'pdf' ? newLessonUrl : undefined;
    const imageUrl = newLessonContentType === 'image' ? newLessonUrl : undefined;
    const resourceLink = newLessonContentType === 'web' ? newLessonUrl : undefined;

    const newLesson: Lesson = {
      id: `les-${Date.now()}`,
      title: newLessonTitle.trim(),
      completed: false,
      duration: Number(newLessonDuration) || 15,
      videoUrl,
      pdfUrl,
      imageUrl,
      resourceLink,
      notes: newLessonNotes.trim() || `### Initial Outline for ${newLessonTitle}\n- Review PDF documents, watch video links or inspect diagram models.\n- Run local terminal tests to practice the concept code.`,
      attachments: [],
      tags: newLessonTags.split(',').map(t => t.trim()).filter(Boolean)
    };

    const updatedModules = space.modules.map(mod => {
      if (mod.id !== moduleId) return mod;
      
      const updatedChapters = mod.chapters.map(chap => {
        if (chap.id !== chapterId) return chap;
        return {
          ...chap,
          lessons: [...chap.lessons, newLesson]
        };
      });

      return {
        ...mod,
        chapters: updatedChapters
      };
    });

    const updated = {
      ...space,
      modules: updatedModules,
      updatedDate: new Date().toISOString().split('T')[0]
    };

    saveUpdatedSpace(updated);

    // Reset lesson inputs
    setNewLessonTitle('');
    setNewLessonDuration(15);
    setNewLessonContentType('video');
    setNewLessonUrl('');
    setNewLessonNotes('');
    setNewLessonTags('');
    setActiveAddLessonChapId(null);
    setActiveAddLessonModId(null);
  };

  const startEditingLesson = (les: Lesson) => {
    setEditingLessonId(les.id);
    setEditLessonTitle(les.title);
    setEditLessonDuration(les.duration || 15);
    
    let contentType: 'video' | 'pdf' | 'image' | 'web' | 'text' = 'text';
    let url = '';
    if (les.videoUrl) {
      contentType = 'video';
      url = les.videoUrl;
    } else if (les.pdfUrl) {
      contentType = 'pdf';
      url = les.pdfUrl;
    } else if (les.imageUrl) {
      contentType = 'image';
      url = les.imageUrl;
    } else if (les.resourceLink) {
      contentType = 'web';
      url = les.resourceLink;
    }
    
    setEditLessonContentType(contentType);
    setEditLessonUrl(url);
    setEditLessonNotes(les.notes || '');
    setEditLessonTags((les.tags || []).join(', '));
  };

  const handleUpdateLesson = (moduleId: string, chapterId: string, lessonId: string) => {
    if (!editLessonTitle.trim()) return;

    const videoUrl = editLessonContentType === 'video' ? editLessonUrl : undefined;
    const pdfUrl = editLessonContentType === 'pdf' ? editLessonUrl : undefined;
    const imageUrl = editLessonContentType === 'image' ? editLessonUrl : undefined;
    const resourceLink = editLessonContentType === 'web' ? editLessonUrl : undefined;

    const updatedModules = space.modules.map(mod => {
      if (mod.id !== moduleId) return mod;
      
      const updatedChapters = mod.chapters.map(chap => {
        if (chap.id !== chapterId) return chap;
        
        const updatedLessons = chap.lessons.map(les => {
          if (les.id !== lessonId) return les;
          return {
            ...les,
            title: editLessonTitle.trim(),
            duration: Number(editLessonDuration) || 15,
            videoUrl,
            pdfUrl,
            imageUrl,
            resourceLink,
            notes: editLessonNotes.trim(),
            tags: editLessonTags.split(',').map(t => t.trim()).filter(Boolean)
          };
        });

        return {
          ...chap,
          lessons: updatedLessons
        };
      });

      return {
        ...mod,
        chapters: updatedChapters
      };
    });

    const updated = {
      ...space,
      modules: updatedModules,
      updatedDate: new Date().toISOString().split('T')[0]
    };

    saveUpdatedSpace(updated);
    setEditingLessonId(null);
  };

  const handleDeleteLesson = (moduleId: string, chapterId: string, lessonId: string) => {
    const updatedModules = space.modules.map(mod => {
      if (mod.id !== moduleId) return mod;
      
      const updatedChapters = mod.chapters.map(chap => {
        if (chap.id !== chapterId) return chap;
        return {
          ...chap,
          lessons: chap.lessons.filter(les => les.id !== lessonId)
        };
      });

      return {
        ...mod,
        chapters: updatedChapters
      };
    });

    const updated = {
      ...space,
      modules: updatedModules,
      updatedDate: new Date().toISOString().split('T')[0]
    };

    saveUpdatedSpace(updated);
  };

  // 4. AI Test suite trigger
  const handleGenerateAiTest = async (testTitle: string, studyReferences: string) => {
    setIsTestGenerating(true);
    setActiveTest(null);
    setIsCourseAssessment(false);

    try {
      const response = await fetch('/api/gemini/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: testTitle,
          notes: studyReferences,
          count: requestedQuestionCount
        })
      });
      const data = await response.json();
      
      if (Array.isArray(data) && data.length > 0) {
        setActiveTest({
          title: testTitle,
          questions: data,
          currentIndex: 0,
          selectedOption: null,
          hasSubmittedAnswer: false,
          score: 0,
          userChoices: new Array(data.length).fill(null)
        });
      } else {
        throw new Error("Invalid dynamic test layout");
      }
    } catch (err) {
      console.error("AI quiz fetch failure", err);
    } finally {
      setIsTestGenerating(false);
    }
  };

  // 4b. AI Course-level Comprehensive Assessment trigger
  const handleGenerateCourseAssessment = async () => {
    setIsTestGenerating(true);
    setActiveTest(null);
    setIsCourseAssessment(true);

    try {
      const response = await fetch('/api/gemini/course-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: space.title,
          modules: space.modules,
          count: requestedQuestionCount,
          difficulty: assessmentDifficulty
        })
      });
      const data = await response.json();
      
      if (Array.isArray(data) && data.length > 0) {
        setActiveTest({
          title: `${space.title} Core Exam`,
          questions: data,
          currentIndex: 0,
          selectedOption: null,
          hasSubmittedAnswer: false,
          score: 0,
          userChoices: new Array(data.length).fill(null)
        });
      } else {
        throw new Error("Invalid course exam layout");
      }
    } catch (err) {
      console.error("AI course comprehensive evaluation fetch failure", err);
    } finally {
      setIsTestGenerating(false);
    }
  };

  const handleCreateTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!todoTitle.trim()) return;
    onAddTodo(todoTitle, todoPriority, todoDueDate || undefined);
    setTodoTitle('');
    setTodoPriority('medium');
    setTodoDueDate('');
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projName.trim()) return;
    onAddProject({
      name: projName,
      status: projStatus,
      githubUrl: projGithub || undefined,
      liveUrl: projLive || undefined,
      techStack: projStack.split(',').map(s => s.trim()).filter(Boolean),
      notes: projNotes || undefined
    });
    // Reset form
    setProjName('');
    setProjStatus('In Progress');
    setProjGithub('');
    setProjLive('');
    setProjStack('');
    setProjNotes('');
    setShowProjForm(false);
  };

  const themeCardBg = themeMode === 'light' ? 'bg-white border-zinc-200' : 'bg-zinc-900 border-zinc-800/80';
  const themeInputBg = themeMode === 'light' ? 'bg-zinc-50 border-zinc-200 text-zinc-900 placeholder:text-zinc-400' : 'bg-zinc-950 border-zinc-850 text-zinc-100 placeholder:text-zinc-650';
  const themeHeaderBorder = themeMode === 'light' ? 'border-zinc-200/60' : 'border-zinc-800/10';
  const themeTitleText = themeMode === 'light' ? 'text-zinc-950 font-bold' : 'text-zinc-100 font-bold';
  const themeHeadingText = themeMode === 'light' ? 'text-zinc-800 font-semibold' : 'text-zinc-200 font-semibold';
  const themeBodyText = themeMode === 'light' ? 'text-zinc-750' : 'text-zinc-300';
  const themeMutedText = themeMode === 'light' ? 'text-zinc-500' : 'text-zinc-400';
  const themeItemBg = themeMode === 'light' ? 'bg-zinc-50/50 border-zinc-150 hover:bg-zinc-100/70 hover:border-indigo-300' : 'bg-zinc-950/20 border-zinc-850 hover:border-indigo-500/50';
  const themeBadgeBg = themeMode === 'light' ? 'bg-zinc-100 border-zinc-200 text-zinc-600' : 'bg-zinc-900 border-zinc-800 text-zinc-400';

  return (
    <div className="max-w-[90rem] mx-auto px-6 py-8 flex flex-col gap-6 animate-fade-in">
      
      {/* Cover Banner Header or Edit Form */}
      {isEditingSpace ? (
        <form onSubmit={handleSaveSpaceDetails} className={`p-6 rounded-2xl border flex flex-col gap-4 animate-fade-in ${themeCardBg}`}>
          <div className="flex items-center justify-between border-b border-zinc-800/15 pb-3">
            <h3 className="text-sm font-semibold text-zinc-150 font-mono uppercase tracking-wider flex items-center gap-2">
              <Pencil className="w-4 h-4 text-indigo-400" />
              <span>Edit Learning Space Details</span>
            </h3>
            <span className="text-[10px] font-mono text-zinc-550">ID: {space.id}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono text-zinc-400 uppercase">Track Title</label>
              <input
                type="text"
                required
                value={editSpaceTitle}
                onChange={(e) => setEditSpaceTitle(e.target.value)}
                className={`px-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${themeInputBg}`}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono text-zinc-400 uppercase">Instructor / Mentor</label>
              <input
                type="text"
                required
                value={editSpaceMentor}
                onChange={(e) => setEditSpaceMentor(e.target.value)}
                className={`px-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${themeInputBg}`}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono text-zinc-400 uppercase">Category</label>
              <input
                type="text"
                required
                value={editSpaceCategory}
                onChange={(e) => setEditSpaceCategory(e.target.value)}
                className={`px-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${themeInputBg}`}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono text-zinc-400 uppercase">Difficulty</label>
              <select
                value={editSpaceDifficulty}
                onChange={(e) => setEditSpaceDifficulty(e.target.value as any)}
                className={`px-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${themeInputBg}`}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono text-zinc-400 uppercase">Estimated Hours</label>
              <input
                type="number"
                required
                value={editSpaceEstimatedHours}
                onChange={(e) => setEditSpaceEstimatedHours(Number(e.target.value))}
                className={`px-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${themeInputBg}`}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono text-zinc-400 uppercase">Tags (comma separated)</label>
              <input
                type="text"
                placeholder="TypeScript, General Tech, Database"
                value={editSpaceTags}
                onChange={(e) => setEditSpaceTags(e.target.value)}
                className={`px-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${themeInputBg}`}
              />
            </div>

            <div className="flex flex-col gap-1.5 sm:col-span-2 lg:col-span-3">
              <label className="text-[10px] font-mono text-zinc-400 uppercase">Track Description</label>
              <textarea
                rows={3}
                required
                value={editSpaceDescription}
                onChange={(e) => setEditSpaceDescription(e.target.value)}
                className={`px-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${themeInputBg}`}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-zinc-800/15 pt-3 mt-1">
            <button
              type="button"
              onClick={() => setIsEditingSpace(false)}
              className="px-4 py-2 border border-zinc-800 text-zinc-400 hover:text-zinc-200 rounded-xl text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-lg shadow-indigo-500/15"
            >
              Save Track Details
            </button>
          </div>
        </form>
      ) : (
        <div className="relative h-48 rounded-2xl overflow-hidden border border-zinc-800/30">
          <img
            src={space.banner}
            alt={space.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
          
          {/* Back navigation button */}
          <button
            onClick={onBack}
            className="absolute top-4 left-4 p-2 bg-zinc-950/80 hover:bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-300 hover:text-white transition-all cursor-pointer backdrop-blur-md text-xs font-mono flex items-center gap-1.5 shadow-lg animate-fade-in"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Exit Space</span>
          </button>

          {/* Edit space track button */}
          <button
            onClick={() => {
              setIsEditingSpace(true);
              setEditSpaceTitle(space.title);
              setEditSpaceDescription(space.description || '');
              setEditSpaceMentor(space.mentor || '');
              setEditSpaceCategory(space.category || '');
              setEditSpaceDifficulty(space.difficulty || 'Intermediate');
              setEditSpaceEstimatedHours(space.estimatedHours || 10);
              setEditSpaceTags(space.tags.join(', '));
            }}
            className="absolute top-4 right-36 p-2 bg-indigo-950/85 hover:bg-indigo-600 border border-indigo-900/30 rounded-xl text-indigo-200 hover:text-white transition-all cursor-pointer backdrop-blur-md text-xs font-mono flex items-center gap-1.5 shadow-lg"
            title="Edit this learning track's details"
          >
            <Pencil className="w-3.5 h-3.5 animate-pulse" />
            <span>Edit Details</span>
          </button>

          {/* Delete space track button */}
          {onDeleteSpace && (
            <button
              onClick={() => {
                if (window.confirm(`Are you absolutely sure you want to delete "${space.title}"? This will permanently remove all modules, chapters, lessons, custom notes, local todos, and projects.`)) {
                  onDeleteSpace(space.id);
                }
              }}
              className="absolute top-4 right-4 p-2 bg-red-950/85 hover:bg-red-600 border border-red-900/30 rounded-xl text-red-200 hover:text-white transition-all cursor-pointer backdrop-blur-md text-xs font-mono flex items-center gap-1.5 shadow-lg"
              title="Delete this learning track"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Track</span>
            </button>
          )}

          {/* Banner metadata overlay */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div className="flex flex-col gap-1.5 max-w-xl">
              <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest">{space.category}</span>
              <h2 className="text-lg sm:text-2xl font-display font-bold text-zinc-100 tracking-tight leading-snug">
                {space.title}
              </h2>
            </div>
            <span className="px-3 py-1 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono">
              Instructor: {space.mentor}
            </span>
          </div>
        </div>
      )}

      {/* Tabs list inside Study Space */}
      <div className="flex items-center gap-1.5 border-b border-zinc-800/10 pb-1.5">
        {[
          { id: 'syllabus', name: 'Syllabus & Curriculum', icon: BookOpen },
          { id: 'todos', name: 'Space Tasks & Todos', icon: CheckSquare },
          { id: 'projects', name: 'Connected Projects', icon: Briefcase },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setActiveTest(null);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium font-mono cursor-pointer transition-all ${
                isActive
                  ? themeMode === 'light'
                    ? 'bg-zinc-950 text-white font-semibold'
                    : 'bg-zinc-100 text-zinc-950 font-semibold'
                  : 'text-zinc-500 hover:text-zinc-350'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Main Tab content router */}
      <div className="w-full">
        
        {/* SYLLABUS TAB */}
        {activeTab === 'syllabus' && (
          <div className="flex flex-col gap-6">
            
            {/* AI Test Taking Dialog Panel */}
            {activeTest ? (
              <div className="p-6 rounded-2xl border border-indigo-500/30 bg-zinc-950/60 flex flex-col gap-5 animate-fade-in relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <BrainCircuit className="w-48 h-48 text-indigo-400" />
                </div>

                <div className="flex items-center justify-between border-b border-zinc-800/40 pb-3 z-10">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-indigo-400 animate-pulse" />
                    <span className="text-xs font-mono font-bold uppercase text-zinc-400">Gemini Quiz Suite: {activeTest.title}</span>
                  </div>
                  <button
                    onClick={() => setActiveTest(null)}
                    className="px-3 py-1 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white rounded-lg text-[10px] font-mono cursor-pointer"
                  >
                    Close Test Taker
                  </button>
                </div>

                {activeTest.currentIndex < activeTest.questions.length ? (
                  <div className="flex flex-col gap-4 z-10">
                    <div className="flex items-center justify-between text-xs font-mono text-zinc-500">
                      <span>Question {activeTest.currentIndex + 1} of {activeTest.questions.length}</span>
                      <span className="text-indigo-400">Current Score: {activeTest.score} pts</span>
                    </div>

                    <h3 className="text-sm font-semibold text-zinc-200 font-sans tracking-tight">
                      {activeTest.questions[activeTest.currentIndex].question}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                      {activeTest.questions[activeTest.currentIndex].options.map((opt, oIdx) => {
                        const isCorrect = oIdx === activeTest.questions[activeTest.currentIndex].correctIndex;
                        const isSelected = oIdx === activeTest.selectedOption;
                        let optStyle = 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/30';
                        
                        if (activeTest.hasSubmittedAnswer) {
                          if (isCorrect) {
                            optStyle = 'border-emerald-500 bg-emerald-500/10 text-emerald-300';
                          } else if (isSelected) {
                            optStyle = 'border-rose-500 bg-rose-500/10 text-rose-300';
                          } else {
                            optStyle = 'border-zinc-900 bg-zinc-950/20 text-zinc-600';
                          }
                        } else if (isSelected) {
                          optStyle = 'border-indigo-500 bg-indigo-500/10 text-indigo-300 shadow-md shadow-indigo-500/5';
                        }

                        return (
                          <button
                            key={oIdx}
                            disabled={activeTest.hasSubmittedAnswer}
                            onClick={() => {
                              setActiveTest({
                                ...activeTest,
                                selectedOption: oIdx
                              });
                            }}
                            className={`p-3.5 rounded-xl border text-xs text-left transition-all font-sans cursor-pointer flex items-start gap-2.5 ${optStyle}`}
                          >
                            <span className="w-5 h-5 rounded bg-zinc-950/80 border border-zinc-800 text-[10px] font-mono flex items-center justify-center shrink-0">
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanations rationale summary */}
                    {activeTest.hasSubmittedAnswer && (
                      <div className="p-4 rounded-xl bg-zinc-950/50 border border-zinc-850 text-xs leading-relaxed text-zinc-400 mt-2">
                        <p className="font-mono text-[10px] uppercase font-bold text-indigo-400 mb-1">AI Explains</p>
                        <p className="font-sans">{activeTest.questions[activeTest.currentIndex].explanation}</p>
                      </div>
                    )}

                    {/* Submit / Next navigation controls */}
                    <div className="flex items-center justify-end mt-2">
                      {!activeTest.hasSubmittedAnswer ? (
                        <button
                          disabled={activeTest.selectedOption === null}
                          onClick={() => {
                            const isCorrect = activeTest.selectedOption === activeTest.questions[activeTest.currentIndex].correctIndex;
                            const updatedChoices = activeTest.userChoices ? [...activeTest.userChoices] : [];
                            if (updatedChoices.length > 0) {
                              updatedChoices[activeTest.currentIndex] = activeTest.selectedOption;
                            }
                            setActiveTest({
                              ...activeTest,
                              hasSubmittedAnswer: true,
                              score: isCorrect ? activeTest.score + 10 : activeTest.score,
                              userChoices: updatedChoices
                            });
                          }}
                          className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-500 hover:bg-indigo-600 disabled:opacity-40 text-white cursor-pointer"
                        >
                          Submit Answer
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setActiveTest({
                              ...activeTest,
                              currentIndex: activeTest.currentIndex + 1,
                              selectedOption: null,
                              hasSubmittedAnswer: false
                            });
                          }}
                          className="px-5 py-2 rounded-xl text-xs font-semibold bg-zinc-100 text-zinc-950 hover:bg-zinc-200 cursor-pointer"
                        >
                          {activeTest.currentIndex + 1 === activeTest.questions.length ? 'See Performance' : 'Next Question'}
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  // Quiz completed results page
                  <div className="text-center py-6 flex flex-col gap-4 items-center z-10 animate-fade-in w-full">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                      <Award className="w-8 h-8 text-emerald-400" />
                    </div>

                    <div className="flex flex-col">
                      <h4 className="text-base font-bold text-zinc-100 font-display">
                        {isCourseAssessment ? 'Comprehensive Course Exam Completed!' : 'Chapter Test Completed!'}
                      </h4>
                      <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                        Amazing job! You scored **{activeTest.score} / {activeTest.questions.length * 10}** points total.
                      </p>
                    </div>

                    {/* Performance Diagnosis Block for Course Level Exams */}
                    {isCourseAssessment && (() => {
                      const diagnosis: { [lesson: string]: { total: number; correct: number } } = {};
                      activeTest.questions.forEach((q, qIdx) => {
                        const ref = q.lessonRef || 'General Core Concept';
                        if (!diagnosis[ref]) {
                          diagnosis[ref] = { total: 0, correct: 0 };
                        }
                        diagnosis[ref].total += 1;
                        const userChoice = activeTest.userChoices ? activeTest.userChoices[qIdx] : null;
                        if (userChoice !== null && userChoice === q.correctIndex) {
                          diagnosis[ref].correct += 1;
                        }
                      });

                      return (
                        <div className="w-full flex flex-col gap-4 mt-4 text-left border-t border-zinc-800/25 pt-5 z-10">
                          <div className="flex flex-col">
                            <h5 className="text-xs font-bold text-zinc-200 font-mono uppercase tracking-wider flex items-center gap-1.5">
                              <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
                              <span>AI Diagnostic Performance Report</span>
                            </h5>
                            <p className="text-[10px] text-zinc-500 mt-0.5">Automated deep analysis of your topic mastery across individual syllabus lessons</p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full">
                            {Object.entries(diagnosis).map(([lessonName, stats]) => {
                              const pct = Math.round((stats.correct / stats.total) * 100);
                              const isMastered = pct >= 70;
                              
                              // Locate real lesson ID for quick shortcut links
                              let linkedLessonId: string | null = null;
                              for (const m of space.modules) {
                                for (const c of m.chapters) {
                                  const found = c.lessons.find(l => 
                                    l.title.toLowerCase().trim() === lessonName.toLowerCase().trim() || 
                                    lessonName.toLowerCase().trim().includes(l.title.toLowerCase().trim())
                                  );
                                  if (found) {
                                    linkedLessonId = found.id;
                                    break;
                                  }
                                }
                                if (linkedLessonId) break;
                              }

                              return (
                                <div key={lessonName} className="p-4 rounded-2xl border border-zinc-800 bg-zinc-900/30 flex flex-col gap-2.5">
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="text-xs font-semibold text-zinc-200 truncate pr-2" title={lessonName}>{lessonName}</span>
                                    <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase shrink-0 ${
                                      isMastered ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                    }`}>
                                      {isMastered ? 'Mastered' : 'Needs Work'}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-3">
                                    <div className="flex-1 bg-zinc-950 h-2 rounded-full overflow-hidden border border-zinc-850">
                                      <div 
                                        className={`h-full rounded-full transition-all duration-500 ${isMastered ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                                        style={{ width: `${pct}%` }} 
                                      />
                                    </div>
                                    <span className="text-xs font-mono font-bold text-zinc-350 w-10 text-right">{pct}%</span>
                                  </div>

                                  <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 mt-0.5 border-t border-zinc-850 pt-2">
                                    <span>Correct: {stats.correct} / {stats.total}</span>
                                    {linkedLessonId && (
                                      <button
                                        onClick={() => {
                                          if (linkedLessonId) onSelectLesson(linkedLessonId);
                                        }}
                                        className="text-indigo-400 hover:text-indigo-300 font-bold hover:underline cursor-pointer transition-colors"
                                      >
                                        Study Lesson →
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })()}

                    {/* Passing metrics statement */}
                    {!isCourseAssessment && (
                      <div className="px-4 py-2 bg-zinc-950/80 border border-zinc-850 rounded-xl text-[11px] font-mono text-indigo-400 flex items-center gap-1.5 mt-2">
                        <BrainCircuit className="w-4 h-4 text-indigo-400 animate-pulse" />
                        <span>Recommended study: Repeat questions or move to the next roadmap milestone.</span>
                      </div>
                    )}

                    <div className="flex gap-2.5 mt-4">
                      <button
                        onClick={() => {
                          if (isCourseAssessment) {
                            handleGenerateCourseAssessment();
                          } else {
                            handleGenerateAiTest(activeTest.title, activeTest.title);
                          }
                        }}
                        className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-xs font-semibold cursor-pointer flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Retake Test</span>
                      </button>
                      <button
                        onClick={() => setActiveTest(null)}
                        className="px-4 py-2 border border-zinc-800 text-zinc-400 hover:text-zinc-100 rounded-xl text-xs font-semibold cursor-pointer"
                      >
                        Exit Suite
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : null}

            {/* Syllabus guidelines tip row */}
            {!activeTest && (
              <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs leading-relaxed ${
                themeMode === 'light'
                  ? 'bg-indigo-50/40 border-indigo-100 text-zinc-700'
                  : 'bg-indigo-950/10 border-indigo-500/10 text-zinc-300'
              }`}>
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5 animate-pulse" />
                  <span>
                    <strong>Curriculum Builder Mode:</strong> Click <strong>Add Module</strong> or <strong>Add Chapter</strong> to custom-tailor your learning roadmaps. You can generate comprehensive MCQ tests for each chapter using the AI test suite.
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 mt-2 sm:mt-0">
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase flex items-center">
                      <span>Size</span>
                      <InfoTooltip text="Total number of MCQ questions to generate for the test suite." />
                      <span>:</span>
                    </span>
                    <select
                      value={requestedQuestionCount}
                      onChange={(e) => setRequestedQuestionCount(Number(e.target.value))}
                      className="px-2 py-1 text-[10px] font-mono bg-zinc-950 border border-zinc-850 rounded-lg text-zinc-350 focus:outline-none"
                      title="Number of questions to request"
                    >
                      <option value={5}>5 Questions</option>
                      <option value={10}>10 Questions</option>
                      <option value={15}>15 Questions</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase flex items-center">
                      <span>Difficulty</span>
                      <InfoTooltip text="Select custom cognitive depth for MCQ question formulations." />
                      <span>:</span>
                    </span>
                    <select
                      value={assessmentDifficulty}
                      onChange={(e) => setAssessmentDifficulty(e.target.value as any)}
                      className="px-2 py-1 text-[10px] font-mono bg-zinc-950 border border-zinc-850 rounded-lg text-zinc-350 focus:outline-none"
                      title="Assessment difficulty"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>

                  <button
                    onClick={handleGenerateCourseAssessment}
                    disabled={isTestGenerating || space.modules.length === 0}
                    className="px-3 py-1.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-[10px] font-mono font-bold flex items-center gap-1 transition-all cursor-pointer shadow-lg disabled:opacity-50"
                  >
                    {isTestGenerating ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>AI Assessing...</span>
                      </>
                    ) : (
                      <>
                        <BrainCircuit className="w-3.5 h-3.5" />
                        <span>Take Final Course Exam</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Modules Listing */}
            {space.modules.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-zinc-800/40 rounded-xl flex flex-col items-center gap-3">
                <p className="text-sm text-zinc-400 font-semibold">Curriculum under design.</p>
                <p className="text-xs text-zinc-500 max-w-sm">There are currently no modules configured. Create custom modules manually using the buttons below.</p>
              </div>
            ) : (
              space.modules.map((mod, mIdx) => (
                <div key={mod.id} className={`p-5 rounded-2xl border flex flex-col gap-4 relative ${themeCardBg}`}>
                  
                  {/* Module header */}
                  <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b ${themeHeaderBorder}`}>
                    {editingModuleId === mod.id ? (
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <input
                          type="text"
                          required
                          value={editModuleTitle}
                          onChange={(e) => setEditModuleTitle(e.target.value)}
                          className={`px-2.5 py-1 text-xs font-sans rounded-lg outline-none focus:ring-1 focus:ring-indigo-500 w-full sm:w-60 border ${themeInputBg}`}
                        />
                        <button
                          onClick={() => handleUpdateModule(mod.id, editModuleTitle)}
                          className="px-2.5 py-1 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-[10px] font-mono font-bold cursor-pointer"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingModuleId(null)}
                          className={`px-2 py-1 border rounded-lg text-[10px] font-mono cursor-pointer ${
                            themeMode === 'light' ? 'border-zinc-200 text-zinc-500 hover:bg-zinc-50' : 'border-zinc-800 text-zinc-400'
                          }`}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        <span className="text-[9px] font-mono text-indigo-400 uppercase font-semibold flex items-center gap-2">
                          <span>Module {mIdx + 1}</span>
                          <span className="flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => {
                                setEditingModuleId(mod.id);
                                setEditModuleTitle(mod.title);
                              }}
                              className="p-0.5 text-zinc-400 hover:text-indigo-400 transition-colors cursor-pointer"
                              title="Edit Module Title"
                            >
                              <Pencil className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm('Are you sure you want to delete this entire Module and all of its Chapters/Lessons?')) {
                                  handleDeleteModule(mod.id);
                                }
                              }}
                              className="p-0.5 text-zinc-400 hover:text-rose-400 transition-colors cursor-pointer"
                              title="Delete Module"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </span>
                        </span>
                        <h3 className={`text-sm font-semibold tracking-tight ${themeMode === 'light' ? 'text-zinc-900' : 'text-zinc-100'}`}>{mod.title}</h3>
                      </div>
                    )}

                    {/* Chapter creation form button */}
                    {activeAddChapterModId !== mod.id ? (
                      <button
                        onClick={() => {
                          setActiveAddChapterModId(mod.id);
                          setNewChapterTitle('');
                        }}
                        className={`flex items-center gap-1 px-2.5 py-1 text-[10px] font-mono border rounded-lg transition-all cursor-pointer self-start ${
                          themeMode === 'light'
                            ? 'border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 text-zinc-650'
                            : 'border-zinc-800 hover:border-zinc-700 hover:text-zinc-150 text-zinc-400'
                        }`}
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Chapter</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <input
                          type="text"
                          required
                          value={newChapterTitle}
                          onChange={(e) => setNewChapterTitle(e.target.value)}
                          placeholder="Chapter name..."
                          className={`px-2 py-1 text-[11px] font-sans rounded-lg outline-none focus:ring-1 focus:ring-indigo-500 w-full sm:w-40 border ${themeInputBg}`}
                        />
                        <button
                          onClick={() => handleCreateChapter(mod.id)}
                          className="px-2.5 py-1 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-[10px] font-mono font-bold cursor-pointer"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setActiveAddChapterModId(null)}
                          className={`px-2 py-1 border rounded-lg text-[10px] font-mono cursor-pointer ${
                            themeMode === 'light' ? 'border-zinc-200 text-zinc-500 hover:bg-zinc-50' : 'border-zinc-800 text-zinc-400'
                          }`}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Chapters List */}
                  <div className={`flex flex-col gap-6 mt-2 pl-2 border-l ${
                    themeMode === 'light' ? 'border-zinc-200' : 'border-zinc-800/30'
                  }`}>
                    {mod.chapters.map((chap, cIdx) => {
                      const chapTitleRef = `Module ${mIdx + 1} Chapter ${cIdx + 1}: ${chap.title}`;
                      const lessonRefs = chap.lessons.map(l => `${l.title}: ${l.notes}`).join('\n');
                      return (
                        <div key={chap.id} className="flex flex-col gap-3">
                          
                          {/* Chapter Title block */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 pb-1 border-b border-dashed border-zinc-800/10">
                            {editingChapterId === chap.id ? (
                              <div className="flex items-center gap-2 w-full sm:w-auto">
                                <input
                                  type="text"
                                  required
                                  value={editChapterTitle}
                                  onChange={(e) => setEditChapterTitle(e.target.value)}
                                  className={`px-2.5 py-1 text-xs font-sans rounded-lg outline-none focus:ring-1 focus:ring-indigo-500 w-full sm:w-60 border ${themeInputBg}`}
                                />
                                <button
                                  onClick={() => handleUpdateChapter(mod.id, chap.id, editChapterTitle)}
                                  className="px-2.5 py-1 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-[10px] font-mono font-bold cursor-pointer"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingChapterId(null)}
                                  className={`px-2 py-1 border rounded-lg text-[10px] font-mono cursor-pointer ${
                                    themeMode === 'light' ? 'border-zinc-200 text-zinc-500 hover:bg-zinc-50' : 'border-zinc-800 text-zinc-400'
                                  }`}
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                                <span className={themeMode === 'light' ? 'text-zinc-800 font-semibold' : 'text-zinc-400'}>Chapter {cIdx + 1}: {chap.title}</span>
                                <span className="flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => {
                                      setEditingChapterId(chap.id);
                                      setEditChapterTitle(chap.title);
                                    }}
                                    className="p-0.5 text-zinc-400 hover:text-indigo-400 transition-colors cursor-pointer"
                                    title="Edit Chapter Title"
                                  >
                                    <Pencil className="w-2.5 h-2.5" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (window.confirm('Are you sure you want to delete this Chapter and all of its Lessons?')) {
                                        handleDeleteChapter(mod.id, chap.id);
                                      }
                                    }}
                                    className="p-0.5 text-zinc-400 hover:text-rose-400 transition-colors cursor-pointer"
                                    title="Delete Chapter"
                                  >
                                    <Trash2 className="w-2.5 h-2.5" />
                                  </button>
                                </span>
                              </span>
                            )}

                            <div className="flex items-center gap-2">
                              {/* Chapter Test Generator trigger */}
                              <button
                                onClick={() => handleGenerateAiTest(chapTitleRef, lessonRefs || chap.title)}
                                disabled={isTestGenerating}
                                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-mono font-bold bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/25 transition-all cursor-pointer"
                              >
                                <BrainCircuit className="w-3 h-3 text-indigo-400" />
                                <span>Start Chapter Test</span>
                              </button>

                              {/* Lesson creation form trigger */}
                              {activeAddLessonChapId !== chap.id ? (
                                <button
                                  onClick={() => {
                                    setActiveAddLessonChapId(chap.id);
                                    setActiveAddLessonModId(mod.id);
                                  }}
                                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-mono border border-zinc-850 text-zinc-400 hover:border-zinc-800 transition-all cursor-pointer"
                                >
                                  <Plus className="w-3 h-3" />
                                  <span>Add Lesson</span>
                                </button>
                              ) : null}
                            </div>
                          </div>

                          {/* Inline Custom Lesson Creator Form */}
                          {activeAddLessonChapId === chap.id && activeAddLessonModId === mod.id && (
                            <div className={`p-4 rounded-xl border border-dashed flex flex-col gap-3 animate-fade-in ${
                              themeMode === 'light' ? 'border-indigo-500/30 bg-indigo-50/10' : 'border-indigo-500/20 bg-zinc-950/40'
                            }`}>
                              <span className="text-[9px] font-mono text-indigo-400 uppercase font-bold tracking-wider flex items-center">
                                <span>Lesson Curriculum Builder</span>
                                <InfoTooltip text="Add standalone lecture modules, documentation links, or file paths." />
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                <div className="flex flex-col gap-1">
                                  <label className="text-[8px] font-mono text-zinc-400 uppercase flex items-center">
                                    <span>Lesson Title</span>
                                    <InfoTooltip text="The descriptive header name of the specific study lesson." />
                                  </label>
                                  <input
                                    type="text"
                                    required
                                    placeholder="e.g., Introduction to PostgreSQL Schemas"
                                    value={newLessonTitle}
                                    onChange={(e) => setNewLessonTitle(e.target.value)}
                                    className={`px-2.5 py-1.5 text-xs rounded-lg border outline-none focus:border-indigo-500 ${themeInputBg}`}
                                  />
                                </div>

                                <div className="flex flex-col gap-1">
                                  <label className="text-[8px] font-mono text-zinc-400 uppercase flex items-center">
                                    <span>Content Format</span>
                                    <InfoTooltip text="The media format or visual interface template that handles this lesson content." />
                                  </label>
                                  <select
                                    value={newLessonContentType}
                                    onChange={(e) => setNewLessonContentType(e.target.value as any)}
                                    className={`px-2 py-1.5 text-xs rounded-lg border outline-none focus:border-indigo-500 ${themeInputBg}`}
                                  >
                                    <option value="video">YouTube/Vimeo Embed URL</option>
                                    <option value="pdf">PDF Document URL Link</option>
                                    <option value="image">Diagram / Blueprint Image URL</option>
                                    <option value="web">Web Resource Link</option>
                                    <option value="text">Rich text Outline Only</option>
                                  </select>
                                </div>

                                <div className="flex flex-col gap-1 sm:col-span-2">
                                  <label className="text-[8px] font-mono text-zinc-400 uppercase flex items-center">
                                    <span>Source Content Link / URL</span>
                                    <InfoTooltip text="Embed link, hosted file path, or external scientific repository reference." />
                                  </label>
                                  <input
                                    type="url"
                                    placeholder="Paste YouTube links, Google Drive public PDF links, diagram URLs..."
                                    value={newLessonUrl}
                                    onChange={(e) => setNewLessonUrl(e.target.value)}
                                    className={`px-2.5 py-1.5 text-xs rounded-lg border outline-none focus:border-indigo-500 ${themeInputBg}`}
                                  />
                                </div>

                                <div className="flex flex-col gap-1">
                                  <label className="text-[8px] font-mono text-zinc-400 uppercase flex items-center">
                                    <span>Duration (mins)</span>
                                    <InfoTooltip text="Estimated time required to absorb lesson and practical exercises." />
                                  </label>
                                  <input
                                    type="number"
                                    value={newLessonDuration}
                                    onChange={(e) => setNewLessonDuration(Number(e.target.value))}
                                    className={`px-2.5 py-1.5 text-xs rounded-lg border outline-none focus:border-indigo-500 ${themeInputBg}`}
                                  />
                                </div>

                                <div className="flex flex-col gap-1">
                                  <label className="text-[8px] font-mono text-zinc-400 uppercase flex items-center">
                                    <span>Custom Tags (comma separated)</span>
                                    <InfoTooltip text="Tags used for granular filtering, indexing, and command palette matches." />
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="e.g., db-design, security, sql"
                                    value={newLessonTags}
                                    onChange={(e) => setNewLessonTags(e.target.value)}
                                    className={`px-2.5 py-1.5 text-xs rounded-lg border outline-none focus:border-indigo-500 ${themeInputBg}`}
                                  />
                                </div>

                                <div className="flex flex-col gap-1 sm:col-span-2">
                                  <label className="text-[8px] font-mono text-zinc-400 uppercase flex items-center">
                                    <span>Lesson Outline notes (Optional)</span>
                                    <InfoTooltip text="Draft markdown guidelines, key reference rules, or quick equations." />
                                  </label>
                                  <textarea
                                    rows={2}
                                    placeholder="Summarize objectives, formulas, or copy-paste transcripts..."
                                    value={newLessonNotes}
                                    onChange={(e) => setNewLessonNotes(e.target.value)}
                                    className={`px-2.5 py-1.5 text-xs rounded-lg border outline-none focus:border-indigo-500 ${themeInputBg}`}
                                  />
                                </div>
                              </div>

                              <div className="flex justify-end gap-2.5 mt-2.5">
                                <button
                                  onClick={() => {
                                    setActiveAddLessonChapId(null);
                                    setActiveAddLessonModId(null);
                                  }}
                                  className={`px-3.5 py-1.5 border rounded-xl text-xs font-semibold cursor-pointer ${
                                    themeMode === 'light' ? 'border-zinc-200 text-zinc-500 hover:bg-zinc-50' : 'border-zinc-800 text-zinc-400 hover:text-zinc-200'
                                  }`}
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleCreateLesson(mod.id, chap.id)}
                                  className="px-4 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-md"
                                >
                                  Add Lesson
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Lessons List inside Chapter */}
                          <div className="flex flex-col gap-2">
                            {chap.lessons.length === 0 ? (
                              <p className="text-[11px] text-zinc-550 italic pl-1">No lessons configured under this chapter yet. Click "Add Lesson" to build the curriculum.</p>
                            ) : (
                              chap.lessons.map(les => {
                                let formatIcon = <Play className="w-3.5 h-3.5 text-zinc-500" />;
                                if (les.pdfUrl) formatIcon = <FileText className="w-3.5 h-3.5 text-red-400" />;
                                if (les.imageUrl) formatIcon = <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />;
                                if (les.resourceLink) formatIcon = <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />;

                                if (editingLessonId === les.id) {
                                  return (
                                    <div
                                      key={les.id}
                                      onClick={(e) => e.stopPropagation()}
                                      className="p-4 rounded-xl border border-dashed border-indigo-500/40 bg-zinc-950/40 flex flex-col gap-3 animate-fade-in"
                                    >
                                      <span className="text-[9px] font-mono text-indigo-400 uppercase font-bold tracking-wider flex items-center">
                                        <span>Lesson Curriculum Editor</span>
                                      </span>
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                        <div className="flex flex-col gap-1">
                                          <label className="text-[8px] font-mono text-zinc-400 uppercase">Lesson Title</label>
                                          <input
                                            type="text"
                                            required
                                            value={editLessonTitle}
                                            onChange={(e) => setEditLessonTitle(e.target.value)}
                                            className="px-2.5 py-1.5 text-xs rounded-lg border border-zinc-850 bg-zinc-950 text-zinc-200 outline-none focus:border-indigo-500"
                                          />
                                        </div>

                                        <div className="flex flex-col gap-1">
                                          <label className="text-[8px] font-mono text-zinc-400 uppercase">Content Format</label>
                                          <select
                                            value={editLessonContentType}
                                            onChange={(e) => setEditLessonContentType(e.target.value as any)}
                                            className="px-2 py-1.5 text-xs rounded-lg border border-zinc-850 bg-zinc-950 text-zinc-200 outline-none focus:border-indigo-500"
                                          >
                                            <option value="video">YouTube/Vimeo Embed URL</option>
                                            <option value="pdf">PDF Document URL Link</option>
                                            <option value="image">Diagram / Blueprint Image URL</option>
                                            <option value="web">Web Resource Link</option>
                                            <option value="text">Rich text Outline Only</option>
                                          </select>
                                        </div>

                                        <div className="flex flex-col gap-1 sm:col-span-2">
                                          <label className="text-[8px] font-mono text-zinc-400 uppercase">Source Content Link / URL</label>
                                          <input
                                            type="url"
                                            placeholder="Paste Link..."
                                            value={editLessonUrl}
                                            onChange={(e) => setEditLessonUrl(e.target.value)}
                                            className="px-2.5 py-1.5 text-xs rounded-lg border border-zinc-850 bg-zinc-950 text-zinc-200 outline-none focus:border-indigo-500"
                                          />
                                        </div>

                                        <div className="flex flex-col gap-1">
                                          <label className="text-[8px] font-mono text-zinc-400 uppercase">Duration (mins)</label>
                                          <input
                                            type="number"
                                            value={editLessonDuration}
                                            onChange={(e) => setEditLessonDuration(Number(e.target.value))}
                                            className="px-2.5 py-1.5 text-xs rounded-lg border border-zinc-850 bg-zinc-950 text-zinc-200 outline-none focus:border-indigo-500"
                                          />
                                        </div>

                                        <div className="flex flex-col gap-1">
                                          <label className="text-[8px] font-mono text-zinc-400 uppercase">Custom Tags (comma separated)</label>
                                          <input
                                            type="text"
                                            placeholder="e.g., db-design, security"
                                            value={editLessonTags}
                                            onChange={(e) => setEditLessonTags(e.target.value)}
                                            className="px-2.5 py-1.5 text-xs rounded-lg border border-zinc-850 bg-zinc-950 text-zinc-200 outline-none focus:border-indigo-500"
                                          />
                                        </div>

                                        <div className="flex flex-col gap-1 sm:col-span-2">
                                          <label className="text-[8px] font-mono text-zinc-400 uppercase">Lesson Outline notes (Optional)</label>
                                          <textarea
                                            rows={2}
                                            placeholder="Outline notes..."
                                            value={editLessonNotes}
                                            onChange={(e) => setEditLessonNotes(e.target.value)}
                                            className="px-2.5 py-1.5 text-xs rounded-lg border border-zinc-850 bg-zinc-950 text-zinc-200 outline-none focus:border-indigo-500"
                                          />
                                        </div>
                                      </div>

                                      <div className="flex justify-end gap-2 mt-2">
                                        <button
                                          onClick={() => setEditingLessonId(null)}
                                          className="px-3.5 py-1.5 border border-zinc-800 text-zinc-400 hover:text-zinc-200 rounded-xl text-xs font-semibold cursor-pointer"
                                        >
                                          Cancel
                                        </button>
                                        <button
                                          onClick={() => handleUpdateLesson(mod.id, chap.id, les.id)}
                                          className="px-4 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-xs font-semibold cursor-pointer"
                                        >
                                          Save
                                        </button>
                                      </div>
                                    </div>
                                  );
                                }

                                return (
                                  <div
                                    key={les.id}
                                    onClick={() => onSelectLesson(les.id)}
                                    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer group transition-all border ${themeItemBg}`}
                                  >
                                    <div className="flex items-center gap-3 min-w-0">
                                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center border text-[10px] font-bold shrink-0 transition-colors ${
                                        les.completed
                                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
                                          : (themeMode === 'light' ? 'bg-zinc-100 border-zinc-200 text-zinc-600' : 'bg-zinc-900 border-zinc-800 text-zinc-400 group-hover:border-zinc-700')
                                      }`}>
                                        {les.completed ? '✓' : '•'}
                                      </div>
                                      <div className="min-w-0 flex items-center gap-2">
                                        <div className="shrink-0">{formatIcon}</div>
                                        <h4 className={`text-xs font-semibold truncate ${
                                          les.completed
                                            ? 'text-zinc-400 line-through'
                                            : (themeMode === 'light' ? 'text-zinc-800 group-hover:text-indigo-600' : 'text-zinc-200 group-hover:text-indigo-400')
                                        }`}>
                                          {les.title}
                                        </h4>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-3 font-mono text-[10px] text-zinc-500 shrink-0">
                                      <span className="hidden sm:inline-flex items-center gap-1">
                                        {les.duration} mins
                                      </span>

                                      {/* Action buttons (always visible & optimized for accessibility) */}
                                      <div className="flex items-center gap-1 opacity-60 hover:opacity-100 transition-opacity">
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            startEditingLesson(les);
                                          }}
                                          className="p-1 text-zinc-400 hover:text-indigo-400 rounded-lg hover:bg-zinc-900 transition-colors cursor-pointer"
                                          title="Edit Lesson"
                                        >
                                          <Pencil className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            if (window.confirm('Are you sure you want to delete this lesson from the syllabus?')) {
                                              handleDeleteLesson(mod.id, chap.id, les.id);
                                            }
                                          }}
                                          className="p-1 text-zinc-400 hover:text-rose-400 rounded-lg hover:bg-zinc-900 transition-colors cursor-pointer"
                                          title="Delete Lesson"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>

                                      <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[8px] font-bold group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                                        STUDY
                                      </span>
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}

            {/* Custom Module adder row */}
            {!showAddModule ? (
              <button
                onClick={() => setShowAddModule(true)}
                className="mt-2 py-3.5 border border-dashed border-zinc-800 hover:border-indigo-500/40 rounded-xl text-xs font-mono text-zinc-550 hover:text-indigo-400 flex items-center justify-center gap-1.5 cursor-pointer transition-all bg-zinc-950/10"
              >
                <Plus className="w-4 h-4" />
                <span>Add Module to Study Track</span>
              </button>
            ) : (
              <div className={`p-5 rounded-2xl border ${themeCardBg} animate-fade-in`}>
                <h4 className="text-xs font-semibold text-zinc-100 font-mono uppercase tracking-wider mb-3">Add Custom Syllabus Module</h4>
                <form onSubmit={handleCreateModule} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    required
                    placeholder="e.g., Database Foundations & Indexing Optimization"
                    value={newModuleTitle}
                    onChange={(e) => setNewModuleTitle(e.target.value)}
                    className={`flex-1 px-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${themeInputBg}`}
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-lg"
                    >
                      Create Module
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddModule(false);
                        setNewModuleTitle('');
                      }}
                      className="px-4 py-2 border border-zinc-800 text-zinc-400 rounded-xl text-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>
        )}

        {/* TODOS TAB */}
        {activeTab === 'todos' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left: Add Todo Form */}
            <div className={`p-5 rounded-2xl border flex flex-col gap-4 self-start ${themeCardBg}`}>
              <div>
                <h3 className="text-xs font-semibold text-zinc-100 font-mono uppercase tracking-wider">Add Space Task</h3>
                <p className="text-[10px] text-zinc-500 mt-0.5">Define milestones and study checklists</p>
              </div>

              <form onSubmit={handleCreateTodo} className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider flex items-center">
                    <span>Task Title</span>
                    <InfoTooltip text="The objective description of your study checklist milestone." />
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Watch HTTP/3 deep dive"
                    value={todoTitle}
                    onChange={(e) => setTodoTitle(e.target.value)}
                    className={`px-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${themeInputBg}`}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider flex items-center">
                    <span>Priority</span>
                    <InfoTooltip text="Sort priority to prioritize task execution inside the checklist tracker." />
                  </label>
                  <select
                    value={todoPriority}
                    onChange={(e) => setTodoPriority(e.target.value as any)}
                    className={`px-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${themeInputBg}`}
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider flex items-center">
                    <span>Due Date (Optional)</span>
                    <InfoTooltip text="Set a targeted completion date for automated timeline pacing alerts." />
                  </label>
                  <input
                    type="date"
                    value={todoDueDate}
                    onChange={(e) => setTodoDueDate(e.target.value)}
                    className={`px-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${themeInputBg}`}
                  />
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors shadow-lg shadow-indigo-500/10 flex items-center justify-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Space Task</span>
                </button>
              </form>
            </div>

            {/* Right: Todos List */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <div className="flex flex-col">
                <h3 className="text-xs font-semibold text-zinc-100 font-mono uppercase tracking-wider">Space Checklist</h3>
                <p className="text-[10px] text-zinc-500 mt-0.5">Checklist tasks belonging to this track</p>
              </div>

              <div className="flex flex-col gap-3">
                {space.todos.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-zinc-800/40 rounded-2xl bg-zinc-900/10">
                    <p className="text-xs text-zinc-500">No tasks added to this space checklist.</p>
                  </div>
                ) : (
                  space.todos.map(todo => (
                    <div
                      key={todo.id}
                      className="flex items-start justify-between gap-4 p-3.5 bg-zinc-950/20 border border-zinc-850 rounded-xl"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <input
                          type="checkbox"
                          checked={todo.completed}
                          onChange={() => onToggleTodo(todo.id)}
                          className="mt-0.5 rounded border-zinc-800 text-indigo-500 focus:ring-0 cursor-pointer"
                        />
                        <div className="min-w-0">
                          <p className={`text-xs font-medium ${todo.completed ? 'text-zinc-500 line-through' : 'text-zinc-200'}`}>
                            {todo.title}
                          </p>
                          <div className="flex items-center gap-3 mt-1 text-[9px] font-mono text-zinc-500">
                            <span>Due: {todo.dueDate || 'No Target Date'}</span>
                            <span className="text-zinc-700">•</span>
                            <span className="uppercase">{todo.priority} priority</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => onDeleteTodo(todo.id)}
                        className="p-1.5 hover:bg-zinc-900 hover:text-rose-500 border border-transparent hover:border-zinc-800 rounded-lg text-zinc-500 transition-colors cursor-pointer"
                        title="Delete task"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        )}

        {/* PROJECTS TAB */}
        {activeTab === 'projects' && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <h3 className="text-xs font-semibold text-zinc-100 font-mono uppercase tracking-wider">Practice Projects</h3>
                <p className="text-[10px] text-zinc-500 mt-0.5">Projects built to cement understanding of this study track</p>
              </div>

              {!showProjForm && (
                <button
                  onClick={() => setShowProjForm(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-950 transition-all cursor-pointer shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Attach Project</span>
                </button>
              )}
            </div>

            {/* Create Project Form Overlay */}
            {showProjForm && (
              <div className={`p-5 rounded-2xl border ${themeCardBg}`}>
                <h4 className="text-xs font-semibold text-zinc-100 font-mono uppercase tracking-wider mb-4">Attach Practice Project</h4>
                <form onSubmit={handleCreateProject} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider flex items-center">
                      <span>Project Name</span>
                      <InfoTooltip text="The descriptive application header name of your codebase." />
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., EdgeAuth Service"
                      value={projName}
                      onChange={(e) => setProjName(e.target.value)}
                      className={`px-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${themeInputBg}`}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider flex items-center">
                      <span>Status</span>
                      <InfoTooltip text="The current phase of software implementation." />
                    </label>
                    <select
                      value={projStatus}
                      onChange={(e) => setProjStatus(e.target.value as any)}
                      className={`px-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${themeInputBg}`}
                    >
                      <option value="Planning">Planning</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="On Hold">On Hold</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider flex items-center">
                      <span>GitHub Link</span>
                      <InfoTooltip text="Full relative or absolute URL path to the repository codebase." />
                    </label>
                    <input
                      type="url"
                      placeholder="https://github.com/alex/..."
                      value={projGithub}
                      onChange={(e) => setProjGithub(e.target.value)}
                      className={`px-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${themeInputBg}`}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider flex items-center">
                      <span>Live Deploy URL</span>
                      <InfoTooltip text="A preview link or active sandbox link where the app resides." />
                    </label>
                    <input
                      type="url"
                      placeholder="https://myproject.vercel.app"
                      value={projLive}
                      onChange={(e) => setProjLive(e.target.value)}
                      className={`px-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${themeInputBg}`}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider flex items-center">
                      <span>Technology Stack (Comma separated)</span>
                      <InfoTooltip text="Framework, languages, libraries, database engines, and runtime systems." />
                    </label>
                    <input
                      type="text"
                      placeholder="Next.js, Tailwind CSS, Prisma, Postgres"
                      value={projStack}
                      onChange={(e) => setProjStack(e.target.value)}
                      className={`px-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${themeInputBg}`}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider flex items-center">
                      <span>Architecture / Implementation Notes</span>
                      <InfoTooltip text="Document configurations, service design layout, or core algorithms." />
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Describe edge functions, server components routing, indexing schemas..."
                      value={projNotes}
                      onChange={(e) => setProjNotes(e.target.value)}
                      className={`px-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${themeInputBg}`}
                    />
                  </div>

                  <div className="sm:col-span-2 flex items-center justify-end gap-2.5 mt-2">
                    <button
                      type="button"
                      onClick={() => setShowProjForm(false)}
                      className="px-4 py-2 border border-zinc-800 text-zinc-400 hover:text-zinc-100 rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors shadow-lg"
                    >
                      Attach Project
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Attached projects grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {space.projects.length === 0 ? (
                <div className="md:col-span-2 text-center py-12 border border-dashed border-zinc-800/40 rounded-2xl bg-zinc-900/10">
                  <p className="text-xs text-zinc-500">No projects attached to this study space yet.</p>
                </div>
              ) : (
                space.projects.map(proj => (
                  <div
                    key={proj.id}
                    className={`p-5 rounded-2xl border flex flex-col gap-4 relative ${themeCardBg}`}
                  >
                    <button
                      onClick={() => onDeleteProject(proj.id)}
                      className="absolute top-4 right-4 p-1.5 hover:bg-zinc-950/40 hover:text-rose-500 rounded-lg text-zinc-500 border border-transparent hover:border-zinc-850 transition-colors cursor-pointer"
                      title="Remove project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex flex-col gap-1.5">
                      <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">Status: {proj.status}</span>
                      <h4 className="text-sm font-semibold text-zinc-100 truncate pr-8">{proj.name}</h4>
                    </div>

                    {proj.notes && (
                      <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed">
                        {proj.notes}
                      </p>
                    )}

                    {/* Tech Stack list */}
                    <div className="flex flex-wrap gap-1.5">
                      {proj.techStack.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-zinc-950/40 border border-zinc-850 text-[9px] font-mono text-zinc-400"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Project external launcher links */}
                    <div className="flex items-center gap-3 border-t border-zinc-800/10 pt-3.5 mt-2 font-mono text-[10px]">
                      {proj.githubUrl && (
                        <a
                          href={proj.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-zinc-400 hover:text-indigo-400 flex items-center gap-1"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Code Repository</span>
                        </a>
                      )}
                      {proj.liveUrl && (
                        <a
                          href={proj.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-500 hover:text-emerald-400 flex items-center gap-1 ml-auto"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Live Demo</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
