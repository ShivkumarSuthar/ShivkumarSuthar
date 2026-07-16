/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { defaultCMSData } from '../../data/defaultCMSData';
import { CMSData, StudySpace, Lesson, Todo, Project, Bookmark, ActivityLog } from '../../types/cms';
import { ThemeColors } from '../../types';
import { Download, Upload, Trash2, RotateCcw, ShieldCheck, RefreshCw, HelpCircle } from 'lucide-react';
import CMSHeader from './CMSHeader';
import CMSDashboard from './CMSDashboard';
import StudySpaceDetail from './StudySpaceDetail';
import LessonViewer from './LessonViewer';
import ResourceLibrary from './ResourceLibrary';
import RoadmapView from './RoadmapView';
import MentorView from './MentorView';
import AnalyticsView from './AnalyticsView';
import CommandPalette from './CommandPalette';
import InteractiveTour from './InteractiveTour';
import CourseCreator from './CourseCreator';
import StudySpaceCard from './StudySpaceCard';
import { Plus, BookOpen, BrainCircuit } from 'lucide-react';

interface WorkspaceProps {
  colors: ThemeColors;
  themeMode: 'light' | 'dark';
  onExitWorkspace: () => void;
}

const LOCAL_STORAGE_CMS_KEY = 'portfolio_learning_cms_data_v1';

export default function Workspace({ colors, themeMode, onExitWorkspace }: WorkspaceProps) {
  const [cmsData, setCmsData] = useState<CMSData>(defaultCMSData);
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [activeSpaceId, setActiveSpaceId] = useState<string | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [backupMessage, setBackupMessage] = useState<string | null>(null);
  const [showTour, setShowTour] = useState<boolean>(false);
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // Helper to save to backend MongoDB/local fallback
  const saveCmsDataToServer = async (newData: CMSData) => {
    try {
      const res = await fetch('/api/cms/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cmsData: newData }),
      });
      if (!res.ok) {
        console.error('Failed to sync CMS data to MongoDB backend:', res.statusText);
      } else {
        const result = await res.json();
        console.log('Successfully synchronized CMS data to backend:', result);
      }
    } catch (err) {
      console.error('Network error synchronizing CMS data to backend:', err);
    }
  };

  // 1. Load CMS Data from MongoDB/backend on Mount
  useEffect(() => {
    let active = true;
    const fetchCmsData = async () => {
      try {
        console.log('Loading CMS data from server...');
        const res = await fetch('/api/cms/data');
        if (res.ok) {
          const data = await res.json();
          if (data && active) {
            console.log('CMS data successfully loaded from server:', data);
            setCmsData(data);
            localStorage.setItem(LOCAL_STORAGE_CMS_KEY, JSON.stringify(data));
          } else if (active) {
            // If server returned null, fall back to localStorage or use defaultCMSData
            const stored = localStorage.getItem(LOCAL_STORAGE_CMS_KEY);
            if (stored) {
              const parsed = JSON.parse(stored);
              setCmsData(parsed);
              await saveCmsDataToServer(parsed);
            } else {
              // Both server and local are empty, use default and save to server
              setCmsData(defaultCMSData);
              localStorage.setItem(LOCAL_STORAGE_CMS_KEY, JSON.stringify(defaultCMSData));
              await saveCmsDataToServer(defaultCMSData);
            }
          }
        } else {
          throw new Error('Server returned error status: ' + res.status);
        }
      } catch (err) {
        console.warn('Failed to fetch CMS data from backend, falling back to localStorage:', err);
        const stored = localStorage.getItem(LOCAL_STORAGE_CMS_KEY);
        if (stored && active) {
          setCmsData(JSON.parse(stored));
        } else if (active) {
          setCmsData(defaultCMSData);
        }
      } finally {
        if (active) {
          setIsDataLoading(false);
        }
      }
    };

    fetchCmsData();

    // Auto start guided tour on first visit to CMS tab
    const tourDone = localStorage.getItem('cms_onboarding_tour_done_v1');
    if (!tourDone) {
      const timer = setTimeout(() => {
        if (active) {
          setShowTour(true);
        }
      }, 1200);
      return () => {
        active = false;
        clearTimeout(timer);
      };
    }
    return () => {
      active = false;
    };
  }, []);

  const handleTourComplete = () => {
    setShowTour(false);
    localStorage.setItem('cms_onboarding_tour_done_v1', 'true');
  };

  const handleStartTour = () => {
    setCurrentTab('dashboard');
    setActiveSpaceId(null);
    setActiveLessonId(null);
    setShowTour(true);
  };

  // 2. State synchronization with server and localStorage helper
  const syncCMSData = (newData: CMSData) => {
    setCmsData(newData);
    try {
      localStorage.setItem(LOCAL_STORAGE_CMS_KEY, JSON.stringify(newData));
    } catch (e) {
      console.error("Failed to save CMS data to local storage", e);
    }
    // Asynchronously synchronize to server backend (MongoDB)
    saveCmsDataToServer(newData);
  };

  // 3. Command Palette global keybind listener (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 4. Data Sync and Mutation Operations
  
  // Track last visited space/lesson
  const updateResumeState = (spaceId: string, lessonId?: string) => {
    const nextState = {
      ...cmsData.resumeState,
      lastSpaceId: spaceId,
      lastLessonId: lessonId || cmsData.resumeState.lastLessonId
    };
    syncCMSData({
      ...cmsData,
      resumeState: nextState
    });
  };

  const handleNavigateSpace = (spaceId: string) => {
    setActiveSpaceId(spaceId);
    setActiveLessonId(null);
    setCurrentTab('spaces');
    updateResumeState(spaceId);
  };

  const handleNavigateLesson = (spaceId: string, lessonId: string) => {
    setActiveSpaceId(spaceId);
    setActiveLessonId(lessonId);
    setCurrentTab('spaces');
    updateResumeState(spaceId, lessonId);
  };

  // Mark lesson completed
  const handleToggleLessonComplete = (lessonId: string) => {
    if (!activeSpaceId) return;

    const updatedSpaces = cmsData.studySpaces.map(space => {
      if (space.id !== activeSpaceId) return space;

      const updatedModules = space.modules.map(mod => {
        const updatedChapters = mod.chapters.map(chap => {
          const updatedLessons = chap.lessons.map(les => {
            if (les.id !== lessonId) return les;
            
            const nextCompleted = !les.completed;
            
            // Add activity log
            if (nextCompleted) {
              const newLog: ActivityLog = {
                id: `log-${Date.now()}`,
                type: 'complete_lesson',
                title: `Finished lesson: "${les.title}"`,
                description: ` ALEX completed lesson under "${space.title}"`,
                timestamp: new Date().toISOString(),
                studySpaceId: space.id,
                duration: les.duration
              };
              // Add to global logs
              cmsData.activityLog = [newLog, ...cmsData.activityLog];
            }

            return { ...les, completed: nextCompleted };
          });
          return { ...chap, lessons: updatedLessons };
        });
        return { ...mod, chapters: updatedChapters };
      });

      return { ...space, modules: updatedModules, updatedDate: new Date().toISOString().split('T')[0] };
    });

    syncCMSData({ ...cmsData, studySpaces: updatedSpaces });
  };

  // Autosave notes
  const handleSaveNotes = (lessonId: string, notes: string) => {
    if (!activeSpaceId) return;

    const updatedSpaces = cmsData.studySpaces.map(space => {
      if (space.id !== activeSpaceId) return space;

      const updatedModules = space.modules.map(mod => {
        const updatedChapters = mod.chapters.map(chap => {
          const updatedLessons = chap.lessons.map(les => {
            if (les.id !== lessonId) return les;
            return { ...les, notes };
          });
          return { ...chap, lessons: updatedLessons };
        });
        return { ...mod, chapters: updatedChapters };
      });

      return { ...space, modules: updatedModules, updatedDate: new Date().toISOString().split('T')[0] };
    });

    syncCMSData({ ...cmsData, studySpaces: updatedSpaces });
  };

  // Update generic lesson fields
  const handleUpdateLesson = (lessonId: string, updatedFields: Partial<Lesson>) => {
    if (!activeSpaceId) return;

    const updatedSpaces = cmsData.studySpaces.map(space => {
      if (space.id !== activeSpaceId) return space;

      const updatedModules = space.modules.map(mod => {
        const updatedChapters = mod.chapters.map(chap => {
          const updatedLessons = chap.lessons.map(les => {
            if (les.id !== lessonId) return les;
            return { ...les, ...updatedFields };
          });
          return { ...chap, lessons: updatedLessons };
        });
        return { ...mod, chapters: updatedChapters };
      });

      return { ...space, modules: updatedModules, updatedDate: new Date().toISOString().split('T')[0] };
    });

    syncCMSData({ ...cmsData, studySpaces: updatedSpaces });
  };

  // Bookmark toggler
  const handleToggleBookmark = (title: string, url: string, type: 'video' | 'lesson' | 'article') => {
    const existing = cmsData.bookmarks.find(b => b.url === url);
    let nextBookmarks: Bookmark[] = [];

    if (existing) {
      nextBookmarks = cmsData.bookmarks.filter(b => b.id !== existing.id);
    } else {
      const newBm: Bookmark = {
        id: `bm-${Date.now()}`,
        title,
        url,
        type,
        studySpaceId: activeSpaceId || undefined,
        createdDate: new Date().toISOString().split('T')[0]
      };
      nextBookmarks = [newBm, ...cmsData.bookmarks];
    }

    syncCMSData({ ...cmsData, bookmarks: nextBookmarks });
  };

  // Todo items handlers
  const handleAddTodo = (spaceId: string, title: string, priority: 'low' | 'medium' | 'high', dueDate?: string) => {
    const updatedSpaces = cmsData.studySpaces.map(space => {
      if (space.id !== spaceId) return space;
      const newTodo: Todo = {
        id: `todo-${Date.now()}`,
        title,
        priority,
        dueDate,
        completed: false,
        tags: []
      };
      return { ...space, todos: [newTodo, ...space.todos], updatedDate: new Date().toISOString().split('T')[0] };
    });

    syncCMSData({ ...cmsData, studySpaces: updatedSpaces });
  };

  const handleToggleTodo = (spaceId: string, todoId: string) => {
    const updatedSpaces = cmsData.studySpaces.map(space => {
      if (space.id !== spaceId) return space;
      const updatedTodos = space.todos.map(t => {
        if (t.id !== todoId) return t;
        return { ...t, completed: !t.completed };
      });
      return { ...space, todos: updatedTodos };
    });

    syncCMSData({ ...cmsData, studySpaces: updatedSpaces });
  };

  const handleDeleteTodo = (spaceId: string, todoId: string) => {
    const updatedSpaces = cmsData.studySpaces.map(space => {
      if (space.id !== spaceId) return space;
      return { ...space, todos: space.todos.filter(t => t.id !== todoId) };
    });

    syncCMSData({ ...cmsData, studySpaces: updatedSpaces });
  };

  // Project attachments handlers
  const handleAddProject = (spaceId: string, project: Omit<Project, 'id'>) => {
    const updatedSpaces = cmsData.studySpaces.map(space => {
      if (space.id !== spaceId) return space;
      const newProj: Project = {
        ...project,
        id: `proj-${Date.now()}`
      };
      return { ...space, projects: [newProj, ...space.projects], updatedDate: new Date().toISOString().split('T')[0] };
    });

    syncCMSData({ ...cmsData, studySpaces: updatedSpaces });
  };

  const handleDeleteProject = (spaceId: string, projectId: string) => {
    const updatedSpaces = cmsData.studySpaces.map(space => {
      if (space.id !== spaceId) return space;
      return { ...space, projects: space.projects.filter(p => p.id !== projectId) };
    });

    syncCMSData({ ...cmsData, studySpaces: updatedSpaces });
  };

  // Kanban / state status override handler
  const handleUpdateSpaceStatus = (spaceId: string, progressOverride: number) => {
    // If progress is complete, we'll mark all lessons in that space as complete
    const updatedSpaces = cmsData.studySpaces.map(space => {
      if (space.id !== spaceId) return space;
      
      const updatedModules = space.modules.map(mod => {
        const updatedChapters = mod.chapters.map(chap => {
          const updatedLessons = chap.lessons.map(les => {
            return { ...les, completed: progressOverride === 100 ? true : les.completed };
          });
          return { ...chap, lessons: updatedLessons };
        });
        return { ...mod, chapters: updatedChapters };
      });

      return { ...space, modules: updatedModules, updatedDate: new Date().toISOString().split('T')[0] };
    });

    syncCMSData({ ...cmsData, studySpaces: updatedSpaces });
  };

  // Full customized space updater callback
  const handleUpdateSpace = (updatedSpace: StudySpace) => {
    const updatedSpaces = cmsData.studySpaces.map(space => {
      if (space.id === updatedSpace.id) {
        return updatedSpace;
      }
      return space;
    });
    syncCMSData({ ...cmsData, studySpaces: updatedSpaces });
  };

  // Create new blank study space
  const handleCreateStudySpace = () => {
    const newSpace: StudySpace = {
      workspaceId: 'work-prog',
      id: `space-${Date.now()}`,
      title: "New Custom Study Track",
      description: "Define a beautiful roadmap, add resource links, track progress, write markdown notes, and manage connected coding projects.",
      coverImage: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=400&h=250&auto=format&fit=crop",
      banner: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&h=400&auto=format&fit=crop",
      mentor: "Alex Carter",
      category: "Computer Science",
      difficulty: "Intermediate",
      estimatedHours: 40,
      tags: ["TypeScript", "General Tech"],
      createdDate: new Date().toISOString().split('T')[0],
      updatedDate: new Date().toISOString().split('T')[0],
      todos: [],
      projects: [],
      modules: [
        {
          id: `mod-${Date.now()}`,
          title: "Introductory Fundamentals",
          description: "Establish core concepts and environment tooling configurations.",
          chapters: [
            {
              id: `chap-${Date.now()}`,
              title: "Getting Started",
              lessons: [
                {
                  id: `les-${Date.now()}`,
                  title: "Session 1: Launch and Hello World",
                  completed: false,
                  duration: 30,
                  notes: "### Hello World Session Notes\nWrite clear, structured notes as you watch lectures.",
                  attachments: [],
                  tags: ["Intro", "Tooling"]
                }
              ]
            }
          ]
        }
      ]
    };

    syncCMSData({
      ...cmsData,
      studySpaces: [...cmsData.studySpaces, newSpace]
    });

    setBackupMessage("Created a new blank Study Space! Open it to customize details.");
    setTimeout(() => setBackupMessage(null), 3500);
  };

  // Convert and add custom generated playlist track
  const handleAddCustomSpace = (newSpace: StudySpace) => {
    syncCMSData({
      ...cmsData,
      studySpaces: [...cmsData.studySpaces, newSpace]
    });
    
    // Automatically transition to the newly created space to start learning
    handleNavigateSpace(newSpace.id);

    setBackupMessage(`Syllabus generated successfully! Created "${newSpace.title}" with custom video lessons.`);
    setTimeout(() => setBackupMessage(null), 5000);
  };

  // Delete a study space completely
  const handleDeleteStudySpace = (spaceId: string) => {
    const updatedSpaces = cmsData.studySpaces.filter(s => s.id !== spaceId);
    syncCMSData({
      ...cmsData,
      studySpaces: updatedSpaces,
      resumeState: {
        ...cmsData.resumeState,
        lastSpaceId: cmsData.resumeState.lastSpaceId === spaceId ? null : cmsData.resumeState.lastSpaceId,
        lastLessonId: cmsData.resumeState.lastSpaceId === spaceId ? null : cmsData.resumeState.lastLessonId
      }
    });
    setActiveSpaceId(null);
    setBackupMessage("Study space track removed successfully.");
    setTimeout(() => setBackupMessage(null), 3000);
  };

  // JSON Import/Export synchronizer engine
  const handleExportJSON = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(cmsData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `portfolio_learning_cms_backup_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setBackupMessage("Backup exported successfully!");
      setTimeout(() => setBackupMessage(null), 3000);
    } catch (e) {
      console.error(e);
      setBackupMessage("Failed to export backup.");
      setTimeout(() => setBackupMessage(null), 3000);
    }
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const file = e.target.files?.[0];
    if (!file) return;

    fileReader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        // Robust structural verification
        if (parsed && Array.isArray(parsed.studySpaces) && Array.isArray(parsed.bookmarks)) {
          syncCMSData(parsed);
          setBackupMessage("CMS state restored successfully from backup!");
          setTimeout(() => setBackupMessage(null), 4000);
        } else {
          setBackupMessage("Error: Invalid backup file schema.");
          setTimeout(() => setBackupMessage(null), 4000);
        }
      } catch (err) {
        setBackupMessage("Error parsing backup JSON file.");
        setTimeout(() => setBackupMessage(null), 4000);
      }
    };
    fileReader.readAsText(file);
  };

  const handleResetDefaults = () => {
    if (window.confirm("Are you sure you want to reset your Study Workspace back to default mock data? All written notes, completed states, and attached projects will be cleared.")) {
      syncCMSData(defaultCMSData);
      setBackupMessage("Restored to default learning workspace.");
      setTimeout(() => setBackupMessage(null), 3000);
    }
  };

  // Locate current active space/lesson
  const currentSpace = cmsData.studySpaces.find(s => s.id === activeSpaceId);
  let currentLesson: Lesson | null = null;
  if (currentSpace && activeLessonId) {
    for (const mod of currentSpace.modules) {
      for (const chap of mod.chapters) {
        const found = chap.lessons.find(l => l.id === activeLessonId);
        if (found) {
          currentLesson = found;
          break;
        }
      }
      if (currentLesson) break;
    }
  }

  // Check if current lesson is bookmarked
  const isCurrentLessonBookmarked = currentLesson
    ? cmsData.bookmarks.some(b => b.url === (currentLesson?.videoUrl || currentLesson?.resourceLink))
    : false;

  const themeCardBg = themeMode === 'light' ? 'bg-white border-zinc-200' : 'bg-zinc-900 border-zinc-800/80';

  if (isDataLoading) {
    return (
      <div className={`flex-1 flex flex-col items-center justify-center p-12 min-h-[500px] ${
        themeMode === 'light' ? 'bg-zinc-50' : 'bg-zinc-950'
      }`}>
        <div className="flex flex-col items-center gap-3 max-w-sm text-center animate-pulse">
          <div className="w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
            <RefreshCw className="w-5 h-5 text-indigo-500 animate-spin" />
          </div>
          <h2 className={`text-sm font-semibold font-mono uppercase tracking-wider ${
            themeMode === 'light' ? 'text-zinc-800' : 'text-zinc-200'
          }`}>
            Synchronizing Workspace
          </h2>
          <p className={`text-[11px] leading-relaxed ${
            themeMode === 'light' ? 'text-zinc-500' : 'text-zinc-400'
          }`}>
            Connecting to MongoDB database and fetching your personalized tracks, logs, and homework submissions...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col relative">
      
      {/* Subheader Navigation */}
      <CMSHeader
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          setActiveSpaceId(null);
          setActiveLessonId(null);
          setIsCreatingCourse(false);
        }}
        colors={colors}
        themeMode={themeMode}
        onSearchClick={() => setIsSearchOpen(true)}
        onExitCMS={onExitWorkspace}
        streak={cmsData.currentStreak}
      />

      {/* Backup and Sync status alerts overlay */}
      {backupMessage && (
        <div className="bg-indigo-600 text-white text-xs font-mono py-2.5 px-6 text-center flex items-center justify-center gap-2 animate-fade-in z-20">
          <ShieldCheck className="w-4 h-4" />
          <span>{backupMessage}</span>
        </div>
      )}

      {/* Main Inner Router */}
      <div className="flex-1">
        {isCreatingCourse ? (
          <CourseCreator
            cmsData={cmsData}
            onCancel={() => setIsCreatingCourse(false)}
            onSave={(newSpace) => {
              handleAddCustomSpace(newSpace);
              setIsCreatingCourse(false);
            }}
            themeMode={themeMode}
          />
        ) : (
          <>
            {currentTab === 'dashboard' && (
              <CMSDashboard
                cmsData={cmsData}
                onNavigateSpace={handleNavigateSpace}
                onNavigateTab={(tab) => {
                  setCurrentTab(tab);
                  setActiveSpaceId(null);
                  setActiveLessonId(null);
                }}
                onNavigateLesson={handleNavigateLesson}
                onToggleTodoGlobal={handleToggleTodo}
                onCreateStudySpace={() => setIsCreatingCourse(true)}
                onAddCustomSpace={handleAddCustomSpace}
                themeMode={themeMode}
                onDeleteSpace={handleDeleteStudySpace}
              />
            )}

        {currentTab === 'spaces' && (
          currentSpace ? (
            currentLesson ? (
              <LessonViewer
                space={currentSpace}
                lesson={currentLesson}
                onBack={() => setActiveLessonId(null)}
                onToggleComplete={handleToggleLessonComplete}
                onSaveNotes={handleSaveNotes}
                onToggleBookmark={handleToggleBookmark}
                isBookmarked={isCurrentLessonBookmarked}
                themeMode={themeMode}
                onUpdateLesson={handleUpdateLesson}
              />
            ) : (
              <StudySpaceDetail
                space={currentSpace}
                onBack={() => setActiveSpaceId(null)}
                onSelectLesson={(lessonId) => setActiveLessonId(lessonId)}
                onAddTodo={(title, priority, dueDate) => handleAddTodo(currentSpace.id, title, priority, dueDate)}
                onToggleTodo={(todoId) => handleToggleTodo(currentSpace.id, todoId)}
                onDeleteTodo={(todoId) => handleDeleteTodo(currentSpace.id, todoId)}
                onAddProject={(project) => handleAddProject(currentSpace.id, project)}
                onDeleteProject={(projectId) => handleDeleteProject(currentSpace.id, projectId)}
                themeMode={themeMode}
                onUpdateSpace={handleUpdateSpace}
                onDeleteSpace={handleDeleteStudySpace}
              />
            )
          ) : (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800/10">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-[9px] font-bold font-mono text-indigo-400">
                      STUDY WORKSPACE
                    </span>
                    <span className="text-zinc-500 font-mono text-xs">• PERSISTENT SYLLABI ENGINE</span>
                  </div>
                  <h1 className="text-2xl font-display font-bold text-zinc-100 tracking-tight">Your Learning Paths & Courses</h1>
                  <p className="text-xs text-zinc-400">Select any space to manage its modules, solve chapters, track projects, or create custom syllabus structures.</p>
                </div>

                <button
                  onClick={() => setIsCreatingCourse(true)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-indigo-500 hover:bg-indigo-600 text-white transition-all cursor-pointer shadow-lg shadow-indigo-500/15"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Study Track</span>
                </button>
              </div>

              {/* Grid of tracks + quick creator */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Visual Direct Interactive Creator Card */}
                <div
                  onClick={() => setIsCreatingCourse(true)}
                  className={`group rounded-2xl border border-dashed flex flex-col items-center justify-center p-8 text-center cursor-pointer transition-all min-h-[320px] ${
                    themeMode === 'light'
                      ? 'border-zinc-300 hover:border-indigo-500 bg-zinc-50 hover:bg-zinc-100/50'
                      : 'border-zinc-800 hover:border-indigo-500 bg-zinc-900/30 hover:bg-zinc-900/60'
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform duration-300 mb-4">
                    <Plus className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-semibold text-zinc-100 group-hover:text-indigo-400 transition-colors">
                    Create Custom Track
                  </h3>
                  <p className="text-xs text-zinc-400 mt-2 max-w-[220px]">
                    Define your own syllabus, outline modules, attach projects, and add learning links.
                  </p>
                  <span className="mt-4 px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 text-[10px] font-mono font-bold group-hover:bg-indigo-500 group-hover:text-white transition-all">
                    Launch Syllabus Builder
                  </span>
                </div>

                {cmsData.studySpaces.map(space => (
                  <StudySpaceCard
                    key={space.id}
                    space={space}
                    onClick={() => handleNavigateSpace(space.id)}
                    themeMode={themeMode}
                  />
                ))}
              </div>
            </div>
          )
        )}

        {currentTab === 'library' && (
          <ResourceLibrary
            cmsData={cmsData}
            onNavigateLesson={handleNavigateLesson}
            themeMode={themeMode}
          />
        )}

        {currentTab === 'roadmaps' && (
          <RoadmapView
            cmsData={cmsData}
            onUpdateSpaceStatus={handleUpdateSpaceStatus}
            themeMode={themeMode}
          />
        )}

        {currentTab === 'mentors' && (
          <MentorView
            cmsData={cmsData}
            themeMode={themeMode}
          />
        )}

        {currentTab === 'analytics' && (
          <AnalyticsView
            cmsData={cmsData}
            themeMode={themeMode}
          />
        )}
          </>
        )}
      </div>

      {/* Cloud Sync & Local JSON Backup controls footer bar inside CMS */}
      <div className={`mt-auto py-8 border-t border-zinc-800/10 text-center text-xs text-zinc-500 ${
        themeMode === 'light' ? 'bg-zinc-50' : 'bg-zinc-950/40'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:items-start text-center sm:text-left gap-1">
            <span className="font-semibold text-zinc-300">Data Persistence & Sync Center</span>
            <span className="text-[10px]">All notes, checklists, and projects automatically synchronize offline to local storage.</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 font-mono text-[10px]">
            {/* Replay Guided Tour */}
            <button
              onClick={handleStartTour}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-800 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Replay Onboarding Tour</span>
            </button>

            {/* Export JSON backup */}
            <button
              onClick={handleExportJSON}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-800 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CMS Backup</span>
            </button>

            {/* Import JSON backup */}
            <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-800 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>Import CMS Backup</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportJSON}
                className="hidden"
              />
            </label>

            {/* Clear database */}
            <button
              onClick={handleResetDefaults}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-950/40 hover:bg-rose-950/10 text-rose-500/80 hover:text-rose-400 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Mock Defaults</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Guided Tour Spotlight System */}
      {showTour && (
        <InteractiveTour
          themeMode={themeMode}
          onComplete={handleTourComplete}
        />
      )}

      {/* Global Command Palette Dialog Modal */}
      <CommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        cmsData={cmsData}
        onNavigateSpace={handleNavigateSpace}
        onNavigateTab={(tab) => {
          setCurrentTab(tab);
          setActiveSpaceId(null);
          setActiveLessonId(null);
        }}
        onExitCMS={onExitWorkspace}
        themeMode={themeMode}
      />

    </div>
  );
}
