/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface WorkspaceInfo {
  id: string;
  name: string; // e.g. "Programming", "Design", "AI", "Languages", "Business", "College", "Interview Preparation"
  description: string;
  icon: string; // lucide icon name
}

export interface LessonResource {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'youtube' | 'vimeo' | 'image' | 'markdown' | 'richtext' | 'html' | 'code' | 'github' | 'googledoc' | 'external' | 'audio' | 'zip' | 'presentation' | 'attachment';
  url: string;
  groupName?: string;
  thumbnailUrl?: string;
  content?: string; // For markdown/code text preview
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  type: 'MCQ' | 'True/False' | 'Fill in the blanks' | 'Short Answer' | 'Coding' | 'Scenario' | 'Case Study';
  userAnswerIndex?: number;
  userAnswerText?: string;
  isCorrect?: boolean;
}

export interface Assignment {
  id: string;
  type: 'coding' | 'essay' | 'file' | 'project' | 'mcq' | 'peer_review';
  title: string;
  requirements: string;
  resources: string[];
  submitted: boolean;
  submissionText?: string;
  feedback?: string;
  grade?: string;
  evaluation?: string;
}

export interface Lesson {
  id: string;
  title: string;
  completed: boolean;
  duration: number; // in minutes
  description?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  objectives?: string[];
  videoUrl?: string;
  pdfUrl?: string;
  imageUrl?: string;
  resourceLink?: string;
  notes: string; // Markdown text
  summary?: string;
  attachments: string[]; // links or files
  tags: string[];
  lastPosition?: number; // Video playback position in seconds
  resources?: LessonResource[];
  quiz?: QuizQuestion[];
  quizTaken?: boolean;
  quizScore?: number; // percentage
  quizTimeTaken?: number; // seconds
  quizConfidenceScore?: number; // 1-5 scale
  quizWeakConcepts?: string[];
  assignments?: Assignment[];
  aiNotes?: string;
  pinnedNotes?: string;
  bookmarks?: Bookmark[];
}

export interface Chapter {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Module {
  id: string;
  title: string;
  description?: string;
  chapters: Chapter[];
  completed?: boolean;
  score?: number; // Module assessment score
  aiFeedback?: string;
  revisionSuggestions?: string;
}

export interface Todo {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  completed: boolean;
  tags: string[];
}

export interface Project {
  id: string;
  name: string;
  type?: 'mini' | 'major' | 'portfolio' | 'capstone';
  status: 'Planning' | 'In Progress' | 'Completed' | 'On Hold';
  githubUrl?: string;
  liveUrl?: string;
  techStack: string[];
  completionDate?: string;
  notes?: string;
  requirements?: string;
  resources?: string[];
  submitted?: boolean;
  submissionText?: string;
  feedback?: string;
  evaluation?: string;
}

export interface Mentor {
  id: string;
  name: string;
  avatar: string;
  specialty: string;
  bio?: string;
  company?: string;
}

export interface Bookmark {
  id: string;
  title: string;
  url?: string;
  type: 'video' | 'lesson' | 'note' | 'article' | 'pdf' | 'repository' | 'paragraph' | 'image' | 'other';
  studySpaceId?: string;
  folderName?: string;
  createdDate: string;
}

export interface ActivityLog {
  id: string;
  type: 'complete_lesson' | 'complete_module' | 'add_note' | 'solve_problem' | 'start_course' | 'bookmark_resource' | 'study_session' | 'submit_assignment' | 'submit_project' | 'complete_course';
  title: string;
  description: string;
  timestamp: string; // ISO string
  studySpaceId?: string;
  duration?: number; // in minutes
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string; // emoji or lucide icon name
  unlockedAt: string;
}

export interface Course {
  id: string;
  workspaceId: string; // connects to WorkspaceInfo
  title: string;
  description: string;
  coverImage: string;
  banner: string;
  mentor: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedHours: number;
  modules: Module[];
  todos: Todo[];
  projects: Project[];
  assignments?: Assignment[]; // Course-level assignments if any
  tags: string[];
  createdDate: string;
  updatedDate: string;
  lastOpened?: string;
  completed?: boolean;
  certificateEligible?: boolean;
  finalExamScore?: number;
  finalExamTaken?: boolean;
  finalExamQuestions?: QuizQuestion[];
  finalExamFeedback?: string;
  finalExamRevisionPlan?: string;
}

// Reuse Course as StudySpace to keep original components functional with our advanced objects
export type StudySpace = Course;

export interface CMSData {
  workspaces: WorkspaceInfo[];
  activeWorkspaceId: string;
  studySpaces: Course[]; // Maps directly to Courses
  bookmarks: Bookmark[];
  activityLog: ActivityLog[];
  mentors: Mentor[];
  dailyStudyHours: Record<string, number>; // date "YYYY-MM-DD" -> hours studied
  currentStreak: number;
  longestStreak: number;
  todaysGoalHours: number;
  weeklyGoalHours: number;
  monthlyGoalHours: number;
  studyTimeSeconds: number; // total study time accumulated (live tracker)
  achievements: Achievement[];
  resumeState: {
    lastSpaceId?: string;
    lastModuleId?: string;
    lastChapterId?: string;
    lastLessonId?: string;
    lastResourceUrl?: string;
  };
}
