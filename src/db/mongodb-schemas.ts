import mongoose, { Schema, Document } from 'mongoose';
import {
  WorkspaceInfo,
  LessonResource,
  QuizQuestion,
  Assignment,
  Lesson,
  Chapter,
  Module,
  Todo,
  Project,
  Mentor,
  Bookmark,
  ActivityLog,
  Achievement,
  Course
} from '../types/cms';

// ==========================================
// 1. NESTED / SUB-DOCUMENT SCHEMAS
// ==========================================

// Workspace Info Schema
export const WorkspaceInfoSchema = new Schema<WorkspaceInfo>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true }
}, { _id: false });

// Lesson Resource Schema
export const LessonResourceSchema = new Schema<LessonResource>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  type: {
    type: String,
    enum: [
      'pdf', 'video', 'youtube', 'vimeo', 'image', 'markdown', 'richtext', 'html', 
      'code', 'github', 'googledoc', 'external', 'audio', 'zip', 'presentation', 'attachment'
    ],
    required: true
  },
  url: { type: String, required: true },
  groupName: { type: String },
  thumbnailUrl: { type: String },
  content: { type: String }
}, { _id: false });

// Quiz Question Schema
export const QuizQuestionSchema = new Schema<QuizQuestion>({
  id: { type: String, required: true },
  question: { type: String, required: true },
  options: { type: [String], required: true },
  correctIndex: { type: Number, required: true },
  explanation: { type: String, required: true },
  type: {
    type: String,
    enum: ['MCQ', 'True/False', 'Fill in the blanks', 'Short Answer', 'Coding', 'Scenario', 'Case Study'],
    required: true
  },
  userAnswerIndex: { type: Number },
  userAnswerText: { type: String },
  isCorrect: { type: Boolean }
}, { _id: false });

// Assignment Schema
export const AssignmentSchema = new Schema<Assignment>({
  id: { type: String, required: true },
  type: {
    type: String,
    enum: ['coding', 'essay', 'file', 'project', 'mcq', 'peer_review'],
    required: true
  },
  title: { type: String, required: true },
  requirements: { type: String, required: true },
  resources: { type: [String], default: [] },
  submitted: { type: Boolean, default: false },
  submissionText: { type: String },
  feedback: { type: String },
  grade: { type: String },
  evaluation: { type: String }
}, { _id: false });

// Lesson Schema
export const LessonSchema = new Schema<Lesson>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  duration: { type: Number, required: true, default: 0 },
  description: { type: String },
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'] },
  objectives: { type: [String], default: [] },
  videoUrl: { type: String },
  pdfUrl: { type: String },
  imageUrl: { type: String },
  resourceLink: { type: String },
  notes: { type: String, default: '' },
  summary: { type: String },
  attachments: { type: [String], default: [] },
  tags: { type: [String], default: [] },
  lastPosition: { type: Number },
  resources: { type: [LessonResourceSchema], default: [] },
  quiz: { type: [QuizQuestionSchema], default: [] },
  quizTaken: { type: Boolean, default: false },
  quizScore: { type: Number },
  quizTimeTaken: { type: Number },
  quizConfidenceScore: { type: Number },
  quizWeakConcepts: { type: [String], default: [] },
  assignments: { type: [AssignmentSchema], default: [] },
  aiNotes: { type: String },
  pinnedNotes: { type: String }
}, { _id: false });

// Chapter Schema
export const ChapterSchema = new Schema<Chapter>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  lessons: { type: [LessonSchema], default: [] }
}, { _id: false });

// Module Schema
export const ModuleSchema = new Schema<Module>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  chapters: { type: [ChapterSchema], default: [] },
  completed: { type: Boolean, default: false },
  score: { type: Number },
  aiFeedback: { type: String },
  revisionSuggestions: { type: String }
}, { _id: false });

// Todo Schema
export const TodoSchema = new Schema<Todo>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  dueDate: { type: String },
  completed: { type: Boolean, default: false },
  tags: { type: [String], default: [] }
}, { _id: false });

// Project Schema
export const ProjectSchema = new Schema<Project>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['mini', 'major', 'portfolio', 'capstone'], default: 'mini' },
  status: { type: String, enum: ['Planning', 'In Progress', 'Completed', 'On Hold'], default: 'Planning' },
  githubUrl: { type: String },
  liveUrl: { type: String },
  techStack: { type: [String], default: [] },
  completionDate: { type: String },
  notes: { type: String },
  requirements: { type: String },
  resources: { type: [String], default: [] },
  submitted: { type: Boolean, default: false },
  submissionText: { type: String },
  feedback: { type: String },
  evaluation: { type: String }
}, { _id: false });

// Mentor Schema
export const MentorSchema = new Schema<Mentor>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  avatar: { type: String, required: true },
  specialty: { type: String, required: true },
  bio: { type: String },
  company: { type: String }
});

// Bookmark Schema
export const BookmarkSchema = new Schema<Bookmark>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  url: { type: String },
  type: {
    type: String,
    enum: ['video', 'lesson', 'note', 'article', 'pdf', 'repository', 'paragraph', 'image', 'other'],
    required: true
  },
  studySpaceId: { type: String },
  folderName: { type: String },
  createdDate: { type: String, required: true }
});

// Activity Log Schema
export const ActivityLogSchema = new Schema<ActivityLog>({
  id: { type: String, required: true },
  type: {
    type: String,
    enum: [
      'complete_lesson', 'complete_module', 'add_note', 'solve_problem', 'start_course', 
      'bookmark_resource', 'study_session', 'submit_assignment', 'submit_project', 'complete_course'
    ],
    required: true
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  timestamp: { type: String, required: true },
  studySpaceId: { type: String },
  duration: { type: Number }
});

// Achievement Schema
export const AchievementSchema = new Schema<Achievement>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  unlockedAt: { type: String, required: true }
});

// Course (StudySpace) Schema
export const CourseSchema = new Schema<Course>({
  id: { type: String, required: true },
  workspaceId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  coverImage: { type: String, required: true },
  banner: { type: String, required: true },
  mentor: { type: String, required: true },
  category: { type: String, required: true },
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], required: true },
  estimatedHours: { type: Number, default: 0 },
  modules: { type: [ModuleSchema], default: [] },
  todos: { type: [TodoSchema], default: [] },
  projects: { type: [ProjectSchema], default: [] },
  assignments: { type: [AssignmentSchema], default: [] },
  tags: { type: [String], default: [] },
  createdDate: { type: String, required: true },
  updatedDate: { type: String, required: true },
  lastOpened: { type: String },
  completed: { type: Boolean, default: false },
  certificateEligible: { type: Boolean, default: false },
  finalExamScore: { type: Number },
  finalExamTaken: { type: Boolean, default: false },
  finalExamQuestions: { type: [QuizQuestionSchema], default: [] },
  finalExamFeedback: { type: String },
  finalExamRevisionPlan: { type: String }
});

// ==========================================
// 2. ROOT USER STATE SCHEMA (THE MASTER TABLE)
// ==========================================

export interface IUserCMSDataDocument extends Document {
  userId: string;
  workspaces: WorkspaceInfo[];
  activeWorkspaceId: string;
  studySpaces: Course[];
  bookmarks: Bookmark[];
  activityLog: ActivityLog[];
  mentors: Mentor[];
  dailyStudyHours: Record<string, number>;
  currentStreak: number;
  longestStreak: number;
  todaysGoalHours: number;
  weeklyGoalHours: number;
  monthlyGoalHours: number;
  studyTimeSeconds: number;
  achievements: Achievement[];
  resumeState: {
    lastSpaceId?: string;
    lastModuleId?: string;
    lastChapterId?: string;
    lastLessonId?: string;
    lastResourceUrl?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserCMSDataSchema = new Schema<IUserCMSDataDocument>({
  userId: { type: String, required: true, unique: true, index: true },
  workspaces: { type: [WorkspaceInfoSchema], default: [] },
  activeWorkspaceId: { type: String, default: '' },
  studySpaces: { type: [CourseSchema], default: [] },
  bookmarks: { type: [BookmarkSchema], default: [] },
  activityLog: { type: [ActivityLogSchema], default: [] },
  mentors: { type: [MentorSchema], default: [] },
  dailyStudyHours: { type: Schema.Types.Mixed, default: {} },
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  todaysGoalHours: { type: Number, default: 1 },
  weeklyGoalHours: { type: Number, default: 5 },
  monthlyGoalHours: { type: Number, default: 20 },
  studyTimeSeconds: { type: Number, default: 0 },
  achievements: { type: [AchievementSchema], default: [] },
  resumeState: {
    lastSpaceId: { type: String },
    lastModuleId: { type: String },
    lastChapterId: { type: String },
    lastLessonId: { type: String },
    lastResourceUrl: { type: String }
  }
}, {
  timestamps: true,
  minimize: false
});

// Index options for high speed query routing
UserCMSDataSchema.index({ userId: 1 });

export const UserCMSData = mongoose.models.UserCMSData || mongoose.model<IUserCMSDataDocument>('UserCMSData', UserCMSDataSchema);
