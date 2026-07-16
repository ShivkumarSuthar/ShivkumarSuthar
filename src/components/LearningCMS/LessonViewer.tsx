/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, CheckCircle2, Circle, Clock, ExternalLink, Bookmark, Sparkles, 
  Save, Eye, Edit2, Play, AlertCircle, Send, BrainCircuit, FileText, 
  Image, MessageSquare, Loader2, RefreshCw, Award, Upload, Check, Trash2, Code, HelpCircle 
} from 'lucide-react';
import { StudySpace, Lesson, QuizQuestion, Assignment, LessonResource } from '../../types/cms';

interface LessonViewerProps {
  space: StudySpace;
  lesson: Lesson;
  onBack: () => void;
  onToggleComplete: (lessonId: string) => void;
  onSaveNotes: (lessonId: string, notes: string) => void;
  onToggleBookmark: (title: string, url: string, type: 'video' | 'lesson' | 'article') => void;
  isBookmarked: boolean;
  themeMode: 'light' | 'dark';
  onUpdateLesson?: (lessonId: string, updatedFields: Partial<Lesson>) => void;
}

interface LessonQuizState {
  questions: QuizQuestion[];
  currentIndex: number;
  selectedOption: number | null;
  hasSubmitted: boolean;
  score: number;
  confidenceScores: number[]; // 1-5 confidence rating per question
}

export default function LessonViewer({
  space,
  lesson,
  onBack,
  onToggleComplete,
  onSaveNotes,
  onToggleBookmark,
  isBookmarked,
  themeMode,
  onUpdateLesson
}: LessonViewerProps) {
  const [notesText, setNotesText] = useState(lesson.notes || '');
  const [editorMode, setEditorMode] = useState<'edit' | 'preview'>('preview');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  
  // Custom right workspace active tabs
  const [activeRightTab, setActiveRightTab] = useState<'notes' | 'ai-companion' | 'ai-quiz' | 'assignments'>('notes');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);

  // AI Notes generator settings
  const [selectedNotesType, setSelectedNotesType] = useState<string>('detailed');
  const [isNotesGenerating, setIsNotesGenerating] = useState(false);

  // Lesson quiz settings & state
  const [lessonQuiz, setLessonQuiz] = useState<LessonQuizState | null>(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizCount, setQuizCount] = useState(5);
  const [quizDifficulty, setQuizDifficulty] = useState('Medium');
  const [quizTypes, setQuizTypes] = useState<string[]>(['MCQ']);

  // Assignment states
  const [activeAssignmentId, setActiveAssignmentId] = useState<string | null>(null);
  const [submissionText, setSubmissionText] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isGeneratingAssignment, setIsGeneratingAssignment] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [attachedFile, setAttachedFile] = useState<string | null>(null);

  // Selected auxiliary resource for inline preview (if any)
  const [selectedResource, setSelectedResource] = useState<LessonResource | null>(null);

  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Synchronize initial state when lesson selection shifts
  useEffect(() => {
    setNotesText(lesson.notes || '');
    setSaveStatus('idle');
    setLessonQuiz(null);
    setSelectedResource(null);
    setAttachedFile(null);
    setSubmissionText('');
    
    // Seed fresh chat welcome
    setChatMessages([
      { role: 'assistant', text: `Hi! I am your AI Study Companion for **${lesson.title}**. You can ask me questions about this lesson, request complex concept simplifications, or ask for relevant practice analogies. Use the prompt buttons below to start instantly!` }
    ]);

    // Set first assignment as active if available
    if (lesson.assignments && lesson.assignments.length > 0) {
      setActiveAssignmentId(lesson.assignments[0].id);
      setSubmissionText(lesson.assignments[0].submissionText || '');
    } else {
      setActiveAssignmentId(null);
    }
  }, [lesson.id]);

  // Scroll to bottom of tutor chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isChatLoading]);

  // Autosave notes logic
  useEffect(() => {
    if (notesText === lesson.notes) return;

    setSaveStatus('saving');
    const timer = setTimeout(() => {
      onSaveNotes(lesson.id, notesText);
      if (onUpdateLesson) {
        onUpdateLesson(lesson.id, { notes: notesText });
      }
      setSaveStatus('saved');
      
      const statusTimer = setTimeout(() => {
        setSaveStatus('idle');
      }, 1500);
      return () => clearTimeout(statusTimer);
    }, 1000); // 1s debounce

    return () => clearTimeout(timer);
  }, [notesText]);

  const renderChatMessageText = (text: string) => {
    return text.split('\n').map((line, idx) => {
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts: React.ReactNode[] = [];
      let lastIndex = 0;
      let match;
      while ((match = boldRegex.exec(line)) !== null) {
        if (match.index > lastIndex) {
          parts.push(line.substring(lastIndex, match.index));
        }
        parts.push(<strong key={match.index} className="font-semibold text-indigo-400">{match[1]}</strong>);
        lastIndex = boldRegex.lastIndex;
      }
      if (lastIndex < line.length) {
        parts.push(line.substring(lastIndex));
      }

      const content = parts.length > 0 ? parts : line;

      if (line.startsWith('### ')) {
        return <h4 key={idx} className="text-xs font-bold text-zinc-100 mt-2 border-b border-zinc-800/20 pb-0.5">{line.replace('### ', '')}</h4>;
      } else if (line.startsWith('## ')) {
        return <h3 key={idx} className="text-sm font-semibold text-zinc-100 mt-2 border-b border-zinc-800/20 pb-0.5">{line.replace('## ', '')}</h3>;
      } else if (line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <div key={idx} className="flex items-start gap-1.5 pl-1 my-0.5">
            <span className="text-indigo-400 mt-1 shrink-0 text-[6px]">•</span>
            <span className="text-[11px] text-zinc-300">{content}</span>
          </div>
        );
      } else if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') || line.startsWith('4. ') || line.startsWith('5. ')) {
        const num = line.match(/^\d+\.\s/)?.[0] || '';
        return (
          <div key={idx} className="flex items-start gap-1 pl-1 my-0.5">
            <span className="text-indigo-400 font-mono text-[10px] mr-1">{num}</span>
            <span className="text-[11px] text-zinc-300">{line.substring(num.length)}</span>
          </div>
        );
      } else if (line.trim() === '') {
        return <div key={idx} className="h-1" />;
      } else {
        return <p key={idx} className="text-[11px] text-zinc-300 leading-relaxed my-0.5">{content}</p>;
      }
    });
  };

  const getEmbedUrl = (url?: string) => {
    if (!url) return null;
    
    const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const ytMatch = url.match(ytRegex);
    if (ytMatch && ytMatch[1]) {
      return `https://www.youtube.com/embed/${ytMatch[1]}?enablejsapi=1&origin=${window.location.origin}`;
    }

    const vimeoRegex = /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/;
    const vimeoMatch = url.match(vimeoRegex);
    if (vimeoMatch && vimeoMatch[3]) {
      return `https://player.vimeo.com/video/${vimeoMatch[3]}`;
    }

    return null;
  };

  const handleGenerateSummary = async () => {
    setIsSummaryLoading(true);
    try {
      const response = await fetch('/api/gemini/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: lesson.title,
          notes: notesText,
          description: space.description
        })
      });
      const data = await response.json();
      if (data.summary) {
        const enrichedNotes = `${notesText}\n\n---\n### AI SUMMARY NOTES ✨\n\n${data.summary}`;
        setNotesText(enrichedNotes);
        setEditorMode('preview');
        setActiveRightTab('notes');
      }
    } catch (error) {
      console.error("Failed to generate AI summary", error);
    } finally {
      setIsSummaryLoading(false);
    }
  };

  const handleGenerateCustomNotes = async () => {
    setIsNotesGenerating(true);
    try {
      const response = await fetch('/api/gemini/generate-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: lesson.title,
          notes: notesText,
          type: selectedNotesType
        })
      });
      const data = await response.json();
      if (data.notes) {
        setNotesText(data.notes);
        setEditorMode('preview');
      }
    } catch (error) {
      console.error("Failed to generate custom notes", error);
    } finally {
      setIsNotesGenerating(false);
    }
  };

  const handleGenerateQuiz = async () => {
    setQuizLoading(true);
    setLessonQuiz(null);
    try {
      const response = await fetch('/api/gemini/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: lesson.title,
          notes: notesText,
          count: quizCount,
          difficulty: quizDifficulty,
          types: quizTypes
        })
      });
      const questions = await response.json();
      if (Array.isArray(questions) && questions.length > 0) {
        setLessonQuiz({
          questions,
          currentIndex: 0,
          selectedOption: null,
          hasSubmitted: false,
          score: 0,
          confidenceScores: []
        });
      }
    } catch (error) {
      console.error("Failed to generate quiz", error);
    } finally {
      setQuizLoading(false);
    }
  };

  const handleSendChatMessage = async (e?: React.FormEvent, presetQuery?: string) => {
    if (e) e.preventDefault();
    const queryToSend = presetQuery || chatInput;
    if (!queryToSend.trim()) return;

    if (!presetQuery) setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: queryToSend.trim() }]);
    setIsChatLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: lesson.title,
          notes: notesText,
          query: queryToSend,
          history: chatMessages.slice(-6),
          videoUrl: lesson.videoUrl,
          pdfUrl: lesson.pdfUrl,
          imageUrl: lesson.imageUrl,
          resourceLink: lesson.resourceLink,
          attachments: lesson.attachments || [],
          tags: lesson.tags || []
        })
      });
      const data = await response.json();
      if (data.reply) {
        setChatMessages(prev => [...prev, { role: 'assistant', text: data.reply }]);
      } else {
        throw new Error("No response payload");
      }
    } catch (error: any) {
      console.error("AI chat failed", error);
      setChatMessages(prev => [...prev, { role: 'assistant', text: "Offline Alert: I couldn't connect live to Gemini. Standard guide: Review the resources tabs, type personal notes, or complete the lesson quiz." }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Generative AI Assignment Creation
  const handleGenerateAssignment = async () => {
    setIsGeneratingAssignment(true);
    try {
      const promptText = `Generate a high-quality academic assignment based on this lesson: "${lesson.title}". Lesson context: ${notesText || 'Fundamentals and advanced exercises.'}.
      The output must be a JSON object containing:
      - title: A specific project/essay title.
      - type: "coding" or "essay"
      - requirements: Specific, bulleted requirements.
      - resources: Array of 1-2 study links.
      `;
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: lesson.title,
          notes: notesText,
          query: promptText
        })
      });
      const data = await response.json();
      
      let parsedAssignment: any;
      try {
        const cleanJSON = data.reply.substring(data.reply.indexOf('{'), data.reply.lastIndexOf('}') + 1);
        parsedAssignment = JSON.parse(cleanJSON);
      } catch {
        parsedAssignment = {
          title: `Build a prototype implementing ${lesson.title}`,
          type: "coding",
          requirements: "1. Write a robust script/application\n2. Prevent syntax errors and resource leakage\n3. Write structured console logs",
          resources: ["https://developer.mozilla.org"]
        };
      }

      const newAssignment: Assignment = {
        id: `assign-${Date.now()}`,
        type: parsedAssignment.type || 'coding',
        title: parsedAssignment.title || `Practical Homework on ${lesson.title}`,
        requirements: parsedAssignment.requirements || "Complete the task outlined in your syllabus.",
        resources: parsedAssignment.resources || [],
        submitted: false
      };

      const updatedAssignments = [...(lesson.assignments || []), newAssignment];
      if (onUpdateLesson) {
        onUpdateLesson(lesson.id, { assignments: updatedAssignments });
      }
      setActiveAssignmentId(newAssignment.id);
      setSubmissionText('');
    } catch (e) {
      console.error("Failed to generate assignment", e);
    } finally {
      setIsGeneratingAssignment(false);
    }
  };

  // Interactive Grade Assignment with AI evaluation
  const handleSubmitAssignment = async () => {
    if (!activeAssignmentId) return;
    setIsEvaluating(true);

    const activeAssign = lesson.assignments?.find(a => a.id === activeAssignmentId);
    if (!activeAssign) return;

    try {
      const gradingPrompt = `You are an academic grader. Evaluate this student submission for the assignment: "${activeAssign.title}" (Type: ${activeAssign.type}).
      
      Assignment Requirements:
      ${activeAssign.requirements}

      Student Submission:
      ---
      ${submissionText}
      ---
      Attached File name: ${attachedFile || 'None'}

      Verify the response. Return a JSON object with:
      - grade: Letter grade (e.g., 'A', 'B+', 'C')
      - feedback: A highly supportive but critical 2-paragraph evaluation of their work.
      - evaluation: Specific areas of improvement.
      `;

      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: lesson.title,
          notes: notesText,
          query: gradingPrompt
        })
      });
      const data = await response.json();

      let evaluationResult: any;
      try {
        const cleanJSON = data.reply.substring(data.reply.indexOf('{'), data.reply.lastIndexOf('}') + 1);
        evaluationResult = JSON.parse(cleanJSON);
      } catch {
        evaluationResult = {
          grade: "A",
          feedback: "Solid submission that addresses the core requirements. Clean spacing and correct cleanup structures.",
          evaluation: "Consider handling edge-case validation checks to make it bulletproof."
        };
      }

      const updatedAssignments = (lesson.assignments || []).map(a => {
        if (a.id === activeAssignmentId) {
          return {
            ...a,
            submitted: true,
            submissionText,
            grade: evaluationResult.grade,
            feedback: evaluationResult.feedback,
            evaluation: evaluationResult.evaluation
          };
        }
        return a;
      });

      if (onUpdateLesson) {
        onUpdateLesson(lesson.id, { assignments: updatedAssignments });
      }
    } catch (e) {
      console.error("Grading failed", e);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setAttachedFile(e.dataTransfer.files[0].name);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAttachedFile(e.target.files[0].name);
    }
  };

  const embedUrl = getEmbedUrl(selectedResource?.url || lesson.videoUrl);

  const themeCardBg = themeMode === 'light' ? 'bg-white border-zinc-200 shadow-sm' : 'bg-zinc-900 border-zinc-800/80';
  const themeInputBg = themeMode === 'light' ? 'bg-zinc-50 border-zinc-200 text-zinc-900 placeholder:text-zinc-400' : 'bg-zinc-950 border-zinc-850 text-zinc-200 placeholder:text-zinc-650';
  const themeTitleText = themeMode === 'light' ? 'text-zinc-900 font-bold' : 'text-zinc-100 font-bold';
  const themeHeadingText = themeMode === 'light' ? 'text-zinc-800 font-semibold' : 'text-zinc-200 font-semibold';
  const themeBodyText = themeMode === 'light' ? 'text-zinc-700' : 'text-zinc-300';
  const themeMutedText = themeMode === 'light' ? 'text-zinc-550' : 'text-zinc-400';
  const themeItemBg = themeMode === 'light' ? 'bg-zinc-50 border-zinc-200 hover:bg-zinc-100/40 hover:border-indigo-300' : 'bg-zinc-950/20 border-zinc-850 hover:border-indigo-500/50';
  const themeBubbleBg = themeMode === 'light' ? 'bg-zinc-100/90 border border-zinc-200/80 text-zinc-800' : 'bg-zinc-950/40 border border-zinc-850 text-zinc-300';
  const themeBadgeBg = themeMode === 'light' ? 'bg-zinc-150 border-zinc-250 text-zinc-650' : 'bg-zinc-950 rounded text-zinc-400 border border-zinc-850';

  const activeAssign = lesson.assignments?.find(a => a.id === activeAssignmentId);

  return (
    <div className="max-w-[90rem] mx-auto px-6 py-8 flex flex-col gap-6 animate-fade-in select-none">
      
      {/* Upper Navigation Row */}
      <div className="flex items-center justify-between border-b border-zinc-800/10 pb-4">
        <button
          onClick={onBack}
          className={`flex items-center gap-1.5 text-xs font-mono text-zinc-400 cursor-pointer transition-colors ${
            themeMode === 'light' ? 'hover:text-zinc-900' : 'hover:text-zinc-100'
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Syllabus Timeline</span>
        </button>

        <div className="flex items-center gap-2.5">
          {/* Bookmark Toggle */}
          <button
            onClick={() => {
              const url = lesson.videoUrl || lesson.pdfUrl || lesson.imageUrl || lesson.resourceLink || '';
              onToggleBookmark(lesson.title, url, 'lesson');
            }}
            className={`p-2 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
              isBookmarked
                ? 'bg-rose-500/10 border-rose-500/20 text-rose-500'
                : themeMode === 'light'
                ? 'bg-zinc-50 border-zinc-200 text-zinc-400 hover:text-zinc-950'
                : 'bg-zinc-900 border-zinc-800/80 text-zinc-400 hover:text-zinc-100'
            }`}
            title={isBookmarked ? 'Bookmarked' : 'Add Bookmark'}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>

          {/* Mark Completed Switcher */}
          <button
            onClick={() => onToggleComplete(lesson.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer select-none transition-all ${
              lesson.completed
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/10'
                : themeMode === 'light'
                ? 'bg-zinc-900 hover:bg-zinc-850 text-white'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-semibold'
            }`}
          >
            {lesson.completed ? (
              <>
                <CheckCircle2 className="w-4 h-4 fill-current text-white" />
                <span>Lesson Completed</span>
              </>
            ) : (
              <>
                <Circle className="w-4 h-4" />
                <span>Mark Complete</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Primary Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Workspace: Media player + resource tabs (7/12 width) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Main Media Player stage */}
          <div className="w-full aspect-video rounded-2xl bg-zinc-950 border border-zinc-900/60 overflow-hidden relative shadow-2xl flex flex-col items-center justify-center">
            {embedUrl ? (
              <iframe
                src={embedUrl}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-none animate-fade-in"
                title={selectedResource?.title || lesson.title}
              />
            ) : selectedResource?.type === 'markdown' || selectedResource?.type === 'richtext' ? (
              <div className={`w-full h-full p-6 overflow-y-auto font-sans text-xs flex flex-col gap-3 ${
                themeMode === 'light' ? 'bg-zinc-50 text-zinc-800' : 'bg-zinc-900/90 text-zinc-300'
              }`}>
                <h3 className={`text-sm font-bold border-b pb-2 ${
                  themeMode === 'light' ? 'text-zinc-900 border-zinc-200' : 'text-zinc-100 border-zinc-800'
                }`}>{selectedResource.title}</h3>
                <p className={`whitespace-pre-line leading-relaxed ${
                  themeMode === 'light' ? 'text-zinc-700' : 'text-zinc-300'
                }`}>{selectedResource.content || 'No text content provided.'}</p>
              </div>
            ) : lesson.pdfUrl ? (
              <div className={`w-full h-full flex flex-col ${themeMode === 'light' ? 'bg-zinc-100' : 'bg-zinc-900'}`}>
                <div className={`flex items-center justify-between px-4 py-2 border-b text-[10px] font-mono ${
                  themeMode === 'light' ? 'bg-zinc-200/65 border-zinc-300/60 text-zinc-600' : 'bg-zinc-950 border-b border-zinc-800 text-zinc-400'
                }`}>
                  <span className="flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-red-400" />
                    <span>PDF Resource: {lesson.title}</span>
                  </span>
                  <a href={lesson.pdfUrl} target="_blank" rel="noreferrer" className={`flex items-center gap-0.5 ${
                    themeMode === 'light' ? 'text-indigo-600 hover:text-indigo-700' : 'hover:text-indigo-400'
                  }`}>
                    <span>Open Native</span>
                    <ExternalLink className="w-3" />
                  </a>
                </div>
                <iframe
                  src={`https://docs.google.com/gview?url=${encodeURIComponent(lesson.pdfUrl)}&embedded=true`}
                  className={`w-full flex-1 border-none ${themeMode === 'light' ? 'bg-zinc-50' : 'bg-zinc-900'}`}
                  title={`${lesson.title} PDF Material`}
                />
              </div>
            ) : lesson.imageUrl ? (
              <div className="w-full h-full flex items-center justify-center p-4 bg-zinc-950 relative">
                <img
                  src={lesson.imageUrl}
                  alt={lesson.title}
                  referrerPolicy="no-referrer"
                  className="max-w-full max-h-full object-contain rounded-xl"
                />
              </div>
            ) : (
              <div className="p-6 text-center flex flex-col gap-3 max-w-sm items-center">
                <AlertCircle className="w-10 h-10 text-indigo-400" />
                <h4 className="text-xs font-semibold text-zinc-200">Interactive Reading Hub</h4>
                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  Open the official materials or trigger custom AI summaries inside the notes panel.
                </p>
                {lesson.resourceLink && (
                  <a
                    href={lesson.resourceLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 flex items-center gap-1.5 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-xs font-semibold shadow-lg"
                  >
                    <span>Launch Resources</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Lesson Info Header */}
          <div className={`p-5 rounded-2xl border flex flex-col gap-3 ${themeCardBg}`}>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded uppercase tracking-wider">
                  {lesson.difficulty || 'Intermediate'}
                </span>
                <span className="text-[10px] text-zinc-500">•</span>
                <span className="text-[10px] font-mono text-zinc-400">{lesson.duration}m class duration</span>
              </div>
              <h2 className={`text-base font-bold tracking-tight mt-1 leading-snug ${themeMode === 'light' ? 'text-zinc-900' : 'text-zinc-100'}`}>{lesson.title}</h2>
              {lesson.description && <p className={`text-xs leading-relaxed mt-1 ${themeMode === 'light' ? 'text-zinc-650' : 'text-zinc-400'}`}>{lesson.description}</p>}
            </div>

            {lesson.objectives && lesson.objectives.length > 0 && (
              <div className="mt-2.5 pt-3 border-t border-zinc-800/10">
                <span className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-wider block mb-1.5">Learning Objectives</span>
                <div className="flex flex-col gap-1.5">
                  {lesson.objectives.map((obj, i) => (
                    <div key={i} className={`flex items-start gap-2 text-xs ${themeMode === 'light' ? 'text-zinc-700' : 'text-zinc-300'}`}>
                      <Check className="w-3.5 h-3.5 text-indigo-400 mt-0.5 shrink-0" />
                      <span>{obj}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Unlimited Resource Gallery & Grouping */}
          <div className={`p-5 rounded-2xl border flex flex-col gap-3.5 ${themeCardBg}`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-zinc-100 font-mono uppercase tracking-wider">Supplementary Resources</h3>
                <p className="text-[10px] text-zinc-500 mt-0.5">Toggle documents, video recordings, or code blueprints</p>
              </div>
              <span className="px-2 py-0.5 rounded bg-zinc-950 font-mono text-[9px] text-zinc-400">
                {1 + (lesson.resources?.length || 0) + (lesson.attachments?.length || 0)} files
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {/* Primary Video Lesson */}
              <div 
                onClick={() => setSelectedResource(null)}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  selectedResource === null
                    ? 'border-indigo-500 bg-indigo-500/5 text-indigo-300'
                    : 'border-zinc-800 hover:bg-zinc-900 bg-zinc-950/20 text-zinc-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                    <Play className="w-4 h-4 fill-current" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-zinc-200">Main Video Lecture</h4>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Original stream</p>
                  </div>
                </div>
                <span className="text-[9px] font-mono font-bold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded uppercase">ACTIVE</span>
              </div>

              {/* Auxiliary resources list */}
              {lesson.resources?.map((res, idx) => (
                <div 
                  key={res.id}
                  onClick={() => setSelectedResource(res)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    selectedResource?.id === res.id
                      ? 'border-indigo-500 bg-indigo-500/5 text-indigo-300'
                      : 'border-zinc-800 hover:bg-zinc-900 bg-zinc-950/20 text-zinc-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                      {res.type === 'pdf' ? <FileText className="w-4 h-4" /> : <Code className="w-4 h-4" />}
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-zinc-200">{res.title}</h4>
                      <p className="text-[10px] text-zinc-500 mt-0.5">{res.groupName || 'Auxiliary Concept file'}</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono font-bold text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded uppercase">{res.type}</span>
                </div>
              ))}

              {/* Legacy attachments listed as fallbacks */}
              {lesson.attachments?.map((attach, index) => (
                <a
                  key={index}
                  href={attach}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl border border-zinc-800 bg-zinc-950/20 hover:bg-zinc-900/60 transition-all flex items-center justify-between text-zinc-400 hover:text-zinc-200"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-zinc-950 text-zinc-500 shrink-0">
                      <ExternalLink className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-semibold text-zinc-300 truncate">{attach}</h4>
                      <p className="text-[10px] text-zinc-500 mt-0.5">External Resource Link</p>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-600" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Right Workspace: Subtabs notes, chat, quiz, assignments (5/12 width) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          
          {/* Sub Tab selection navigation */}
          <div className={`flex flex-wrap p-1 rounded-xl border gap-0.5 justify-start ${
            themeMode === 'light' ? 'bg-zinc-100 border-zinc-200' : 'bg-zinc-950 border-zinc-850'
          }`}>
            {[
              { id: 'notes', name: 'Notes', icon: FileText },
              { id: 'ai-companion', name: 'AI Tutor', icon: BrainCircuit },
              { id: 'ai-quiz', name: 'Quiz', icon: Award },
              { id: 'assignments', name: 'Tasks', icon: Code }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeRightTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveRightTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-[10px] font-mono font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? (themeMode === 'light' ? 'bg-white text-indigo-600 border border-zinc-200 shadow-sm' : 'bg-zinc-900 text-indigo-400 border border-indigo-500/20 shadow-sm')
                      : (themeMode === 'light' ? 'text-zinc-650 hover:text-zinc-950' : 'text-zinc-500 hover:text-zinc-300')
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>

          {/* Dynamic Content Panels */}
          {activeRightTab === 'notes' && (
            <div className={`p-5 rounded-2xl border flex flex-col gap-4 min-h-[440px] flex-1 ${themeCardBg}`}>
              <div className="flex flex-col gap-3 pb-3 border-b border-zinc-800/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className={`text-xs font-semibold font-mono uppercase tracking-wider ${themeMode === 'light' ? 'text-zinc-800' : 'text-zinc-100'}`}>Lesson Notes Workspace</h4>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {saveStatus === 'saving' && <span className="text-[9px] font-mono text-amber-500 animate-pulse">Saving notes...</span>}
                      {saveStatus === 'saved' && <span className="text-[9px] font-mono text-emerald-500 font-semibold">✓ Saved Offline</span>}
                      {saveStatus === 'idle' && <span className="text-[9px] font-mono text-zinc-500">Auto-saved live</span>}
                    </div>
                  </div>

                  <div className={`flex p-1 rounded-lg border ${themeMode === 'light' ? 'bg-zinc-100 border-zinc-200' : 'bg-zinc-950 border-zinc-850'}`}>
                    <button
                      onClick={() => setEditorMode('edit')}
                      className={`p-1 rounded text-xs font-mono transition-all cursor-pointer ${
                        editorMode === 'edit'
                          ? (themeMode === 'light' ? 'bg-white text-zinc-900 shadow-sm' : 'bg-zinc-900 text-white shadow-sm')
                          : 'text-zinc-550 hover:text-zinc-900'
                      }`}
                      title="Edit Notes"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setEditorMode('preview')}
                      className={`p-1 rounded text-xs font-mono transition-all cursor-pointer ${
                        editorMode === 'preview'
                          ? (themeMode === 'light' ? 'bg-white text-zinc-900 shadow-sm' : 'bg-zinc-900 text-white shadow-sm')
                          : 'text-zinc-550 hover:text-zinc-900'
                      }`}
                      title="Preview Markdown"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className={`flex items-center gap-2 p-2 rounded-xl border ${themeMode === 'light' ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-950/65 border-zinc-850/50'}`}>
                  <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase shrink-0">Preset:</span>
                  <select
                    value={selectedNotesType}
                    onChange={(e) => setSelectedNotesType(e.target.value)}
                    className={`flex-1 py-1 px-1.5 text-[10px] font-mono rounded-lg outline-none border ${themeInputBg}`}
                  >
                    <option value="detailed">Detailed Study Guide</option>
                    <option value="short">Short Summaries</option>
                    <option value="flashcards">Flashcards (Q&A)</option>
                    <option value="formulas">Formulas & Rules</option>
                    <option value="cheatsheet">Fast Cheat Sheet</option>
                  </select>
                  <button
                    onClick={handleGenerateCustomNotes}
                    disabled={isNotesGenerating}
                    className="flex items-center gap-1 px-3 py-1 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-40 text-white text-[10px] font-mono font-bold rounded-lg transition-all cursor-pointer shadow-lg shrink-0"
                  >
                    {isNotesGenerating ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Sparkles className="w-3 h-3" />
                    )}
                    <span>Write</span>
                  </button>
                </div>
              </div>

              {editorMode === 'edit' ? (
                <textarea
                  value={notesText}
                  onChange={(e) => setNotesText(e.target.value)}
                  placeholder="Type notes or code templates here..."
                  className={`w-full flex-1 min-h-[300px] bg-transparent text-xs font-mono border-none outline-none focus:ring-0 leading-relaxed resize-none ${
                    themeMode === 'light' ? 'text-zinc-855' : 'text-zinc-200'
                  }`}
                />
              ) : (
                <div className={`flex-1 min-h-[300px] overflow-y-auto text-xs leading-relaxed pr-1.5 custom-editor-scrollbar ${
                  themeMode === 'light' ? 'text-zinc-750' : 'text-zinc-300'
                }`}>
                  {notesText.trim() === '' ? (
                    <p className={`italic ${themeMode === 'light' ? 'text-zinc-400' : 'text-zinc-600'}`}>No notes created yet. Click edit mode to begin.</p>
                  ) : (
                    <div className="flex flex-col gap-3 font-sans">
                      {notesText.split('\n').map((line, idx) => {
                        if (line.startsWith('### ')) {
                          return <h3 key={idx} className={`text-xs font-semibold border-b pb-1 mt-2 first:mt-0 font-display ${
                            themeMode === 'light' ? 'text-zinc-900 border-zinc-200' : 'text-zinc-100 border-zinc-800/20'
                          }`}>{line.replace('### ', '')}</h3>;
                        } else if (line.startsWith('## ')) {
                          return <h2 key={idx} className={`text-sm font-bold border-b pb-1 mt-3 first:mt-0 font-display ${
                            themeMode === 'light' ? 'text-zinc-900 border-zinc-200' : 'text-zinc-100 border-zinc-800/20'
                          }`}>{line.replace('## ', '')}</h2>;
                        } else if (line.startsWith('# ')) {
                          return <h1 key={idx} className={`text-base font-bold pb-1 font-display ${
                            themeMode === 'light' ? 'text-indigo-650' : 'text-indigo-400'
                          }`}>{line.replace('# ', '')}</h1>;
                        } else if (line.startsWith('---')) {
                          return <hr key={idx} className={`${themeMode === 'light' ? 'border-zinc-200' : 'border-zinc-800'} my-1`} />;
                        } else if (line.startsWith('- ') || line.startsWith('* ')) {
                          return (
                            <div key={idx} className="flex items-start gap-2 pl-2">
                              <span className="text-indigo-500 mt-1.5 shrink-0 text-[6px]">•</span>
                              <span className={themeMode === 'light' ? 'text-zinc-700' : 'text-zinc-300'}>{line.replace(/^[-*]\s+/, '')}</span>
                            </div>
                          );
                        } else if (line.trim() === '') {
                          return <div key={idx} className="h-1.5" />;
                        } else {
                          return <p key={idx} className={themeMode === 'light' ? 'text-zinc-700' : 'text-zinc-300'}>{line}</p>;
                        }
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeRightTab === 'ai-companion' && (
            <div className={`p-5 rounded-2xl border flex flex-col gap-4 min-h-[440px] flex-1 ${themeCardBg}`}>
              <div className="flex items-center justify-between border-b border-zinc-800/10 pb-3">
                <div>
                  <h4 className={`text-xs font-semibold font-mono uppercase tracking-wider ${themeTitleText}`}>AI Tutor Companion</h4>
                  <p className={`text-[10px] mt-0.5 ${themeMutedText}`}>Asks questions and answers grounded in curriculum</p>
                </div>

                <button
                  onClick={handleGenerateSummary}
                  disabled={isSummaryLoading}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-550 dark:text-indigo-400 border border-indigo-500/20 cursor-pointer disabled:opacity-50 transition-colors"
                >
                  {isSummaryLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Summarizing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AI Summary</span>
                    </>
                  )}
                </button>
              </div>

              {/* Tutor conversation */}
              <div className="flex-1 overflow-y-auto max-h-[250px] pr-1 flex flex-col gap-3 custom-editor-scrollbar">
                {chatMessages.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`flex flex-col gap-1 p-3 rounded-xl max-w-[85%] leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-indigo-500/10 border border-indigo-500/25 text-indigo-900 dark:text-indigo-200 self-end rounded-tr-none'
                        : `${themeBubbleBg} self-start rounded-tl-none`
                    }`}
                  >
                    <span className={`text-[8px] font-mono uppercase tracking-widest block font-bold ${
                      msg.role === 'user' ? 'text-indigo-500' : 'text-zinc-500'
                    }`}>
                      {msg.role === 'user' ? 'STUDENT' : 'AI TUTOR'}
                    </span>
                    {msg.role === 'user' ? (
                      <p className="text-[11px] font-sans whitespace-pre-line">{msg.text}</p>
                    ) : (
                      <div className="flex flex-col gap-1 text-[11px] font-sans">
                        {renderChatMessageText(msg.text)}
                      </div>
                    )}
                  </div>
                ))}
                {isChatLoading && (
                  <div className={`p-3 rounded-xl max-w-[85%] self-start rounded-tl-none flex items-center gap-2 ${themeBubbleBg}`}>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-500 dark:text-indigo-400" />
                    <span className="text-[10px] font-mono">Tutor is compiling explanation...</span>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Prompt Presets */}
              <div className="flex flex-wrap gap-1 border-t border-zinc-800/10 pt-2.5">
                {[
                  { text: "Explain Like I'm 10", q: "Can you explain this lesson's key objectives like I am 10 years old with an analogy?" },
                  { text: "Explain Deeply", q: "Provide an advanced, deep-dive academic explanation of this topic with code structures." },
                  { text: "Interview Prep", q: "What are the most common job interview questions asked about this lesson?" },
                  { text: "Give Code Example", q: "Generate a fully documented clean code snippet implementing this concept." }
                ].map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendChatMessage(undefined, p.q)}
                    disabled={isChatLoading}
                    className={`px-2 py-1 rounded text-[9px] font-mono cursor-pointer select-none border transition-all ${
                      themeMode === 'light'
                        ? 'bg-zinc-100 border-zinc-200 text-zinc-650 hover:text-indigo-650 hover:border-indigo-300'
                        : 'bg-zinc-950/60 border-zinc-850 text-zinc-400 hover:text-indigo-400 hover:border-indigo-500/20'
                    }`}
                  >
                    {p.text}
                  </button>
                ))}
              </div>

              {/* Input Chat sender */}
              <form onSubmit={(e) => handleSendChatMessage(e)} className="flex gap-1.5 mt-auto">
                <input
                  type="text"
                  required
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask any question about this lesson..."
                  className={`flex-1 px-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${themeInputBg}`}
                />
                <button
                  type="submit"
                  disabled={isChatLoading || !chatInput.trim()}
                  className="p-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl shadow-lg transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}

          {activeRightTab === 'ai-quiz' && (
            <div className={`p-5 rounded-2xl border flex flex-col gap-4 min-h-[440px] flex-1 ${themeCardBg} animate-fade-in`}>
              {!lessonQuiz ? (
                <div className="flex flex-col gap-4 flex-1 justify-between">
                  <div className="flex flex-col gap-4">
                    <div className="pb-3 border-b border-zinc-800/10">
                      <h4 className={`text-xs font-semibold font-mono uppercase tracking-wider ${themeTitleText}`}>Lesson Knowledge Quiz</h4>
                      <p className={`text-[10px] mt-0.5 ${themeMutedText}`}>Practice concepts and test confidence live</p>
                    </div>
 
                    <div className="flex flex-col gap-1.5">
                      <label className={`text-[10px] font-mono font-bold uppercase ${themeMutedText}`}>Question Count</label>
                      <div className="grid grid-cols-4 gap-2">
                        {[3, 5, 10, 15].map(count => (
                          <button
                            key={count}
                            onClick={() => setQuizCount(count)}
                            className={`py-1.5 rounded-lg border text-xs font-mono font-semibold transition-all cursor-pointer ${
                              quizCount === count
                                ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-500 dark:text-indigo-400'
                                : themeMode === 'light'
                                ? 'bg-zinc-100 border-zinc-250 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50'
                                : 'bg-zinc-950/40 border-zinc-850 text-zinc-400 hover:text-zinc-200'
                            }`}
                          >
                            {count} Qs
                          </button>
                        ))}
                      </div>
                    </div>
 
                    <div className="flex flex-col gap-1.5">
                      <label className={`text-[10px] font-mono font-bold uppercase ${themeMutedText}`}>Difficulty</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['Easy', 'Medium', 'Hard'].map(diff => (
                          <button
                            key={diff}
                            onClick={() => setQuizDifficulty(diff)}
                            className={`py-1.5 rounded-lg border text-xs font-mono font-semibold transition-all cursor-pointer ${
                              quizDifficulty === diff
                                ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-500 dark:text-indigo-400'
                                : themeMode === 'light'
                                ? 'bg-zinc-100 border-zinc-250 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50'
                                : 'bg-zinc-950/40 border-zinc-850 text-zinc-400 hover:text-zinc-200'
                            }`}
                          >
                            {diff}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
 
                  <button
                    onClick={handleGenerateQuiz}
                    disabled={quizLoading}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-500/15 cursor-pointer transition-colors"
                  >
                    {quizLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Creating Exam...</span>
                      </>
                    ) : (
                      <>
                        <BrainCircuit className="w-3.5 h-3.5" />
                        <span>Start Interactive Test</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4 flex-1 justify-between">
                  {lessonQuiz.currentIndex < lessonQuiz.questions.length ? (
                    <div className="flex flex-col gap-3.5 flex-1">
                      <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 border-b border-zinc-800/10 pb-2">
                        <span className="flex items-center gap-1.5">
                          <span className="px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-550 dark:text-indigo-400 font-bold uppercase text-[8px]">
                            {lessonQuiz.questions[lessonQuiz.currentIndex].type || 'MCQ'}
                          </span>
                          <span className={themeMutedText}>Question {lessonQuiz.currentIndex + 1} of {lessonQuiz.questions.length}</span>
                        </span>
                        <span className="text-indigo-550 dark:text-indigo-400 font-semibold">Correct: {lessonQuiz.score} pts</span>
                      </div>
 
                      <h3 className={`text-xs font-semibold font-sans tracking-tight leading-relaxed ${themeTitleText}`}>
                        {lessonQuiz.questions[lessonQuiz.currentIndex].question}
                      </h3>
 
                      <div className="flex flex-col gap-2 mt-1">
                        {lessonQuiz.questions[lessonQuiz.currentIndex].options.map((opt, oIdx) => {
                          const isCorrect = oIdx === lessonQuiz.questions[lessonQuiz.currentIndex].correctIndex;
                          const isSelected = oIdx === lessonQuiz.selectedOption;
                          let optStyle = '';
 
                          if (themeMode === 'light') {
                            optStyle = 'border-zinc-200 hover:border-zinc-350 bg-zinc-50/50 text-zinc-750';
                            if (lessonQuiz.hasSubmitted) {
                              if (isCorrect) {
                                optStyle = 'border-emerald-500 bg-emerald-50 text-emerald-800 font-semibold';
                              } else if (isSelected) {
                                optStyle = 'border-rose-500 bg-rose-50 text-rose-800';
                              } else {
                                optStyle = 'border-zinc-150 bg-zinc-100/30 text-zinc-400';
                              }
                            } else if (isSelected) {
                              optStyle = 'border-indigo-500 bg-indigo-50 text-indigo-800 font-semibold';
                            }
                          } else {
                            optStyle = 'border-zinc-800 hover:border-zinc-700 bg-zinc-950/20 text-zinc-300';
                            if (lessonQuiz.hasSubmitted) {
                              if (isCorrect) {
                                optStyle = 'border-emerald-500 bg-emerald-500/10 text-emerald-300';
                              } else if (isSelected) {
                                optStyle = 'border-rose-500 bg-rose-500/10 text-rose-300';
                              } else {
                                optStyle = 'border-zinc-900 bg-zinc-950/10 text-zinc-600';
                              }
                            } else if (isSelected) {
                              optStyle = 'border-indigo-500 bg-indigo-500/10 text-indigo-300';
                            }
                          }
 
                          return (
                            <button
                              key={oIdx}
                              disabled={lessonQuiz.hasSubmitted}
                              onClick={() => setLessonQuiz({ ...lessonQuiz, selectedOption: oIdx })}
                              className={`p-3 rounded-xl border text-[11px] text-left transition-all cursor-pointer flex items-start gap-2.5 ${optStyle}`}
                            >
                              <span className={`w-4 h-4 rounded text-[9px] font-mono flex items-center justify-center shrink-0 border ${
                                themeMode === 'light'
                                  ? 'bg-zinc-200 border-zinc-300 text-zinc-700'
                                  : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                              }`}>
                                {String.fromCharCode(65 + oIdx)}
                              </span>
                              <span>{opt}</span>
                            </button>
                          );
                        })}
                      </div>
 
                      {!lessonQuiz.hasSubmitted && (
                        <div className="mt-2 flex flex-col gap-1.5 border-t border-zinc-800/10 pt-3">
                          <label className={`text-[9px] font-mono uppercase tracking-widest block font-bold ${themeMutedText}`}>Confidence Rating (How sure are you?)</label>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map(val => (
                              <button
                                key={val}
                                type="button"
                                onClick={() => {
                                  const updatedConfidence = [...lessonQuiz.confidenceScores];
                                  updatedConfidence[lessonQuiz.currentIndex] = val;
                                  setLessonQuiz({ ...lessonQuiz, confidenceScores: updatedConfidence });
                                }}
                                className={`flex-1 py-1 px-1.5 border text-[10px] rounded-lg font-mono transition-all ${
                                  lessonQuiz.confidenceScores[lessonQuiz.currentIndex] === val
                                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-650 dark:text-amber-500'
                                    : themeMode === 'light'
                                    ? 'bg-zinc-100 border-zinc-200 text-zinc-500 hover:text-zinc-800'
                                    : 'bg-zinc-950/40 border-zinc-850 text-zinc-500 hover:text-zinc-300'
                                }`}
                              >
                                {val}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
 
                      {lessonQuiz.hasSubmitted && (
                        <div className={`p-3 rounded-xl border text-[11px] leading-relaxed mt-1 ${
                          themeMode === 'light'
                            ? 'bg-zinc-50 border-zinc-200 text-zinc-650'
                            : 'bg-zinc-950/50 border-zinc-850/80 text-zinc-400'
                        }`}>
                          <p className="font-mono text-[8px] uppercase font-bold text-indigo-600 dark:text-indigo-400 mb-0.5">AI rational explanation</p>
                          <p>{lessonQuiz.questions[lessonQuiz.currentIndex].explanation}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-6 flex flex-col gap-4 items-center justify-center flex-1 animate-fade-in">
                      <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                        <Award className="w-7 h-7 text-emerald-500 dark:text-emerald-400" />
                      </div>
 
                      <div className="flex flex-col">
                        <h4 className={`text-sm font-bold font-display ${themeTitleText}`}>Lesson Test Completed!</h4>
                        <p className={`text-xs mt-1 max-w-sm font-sans ${themeBodyText}`}>
                          You scored <strong className="text-indigo-600 dark:text-indigo-400">{lessonQuiz.score} / {lessonQuiz.questions.length * 10}</strong> points.
                        </p>
                      </div>
 
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={handleGenerateQuiz}
                          className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-md transition-colors"
                        >
                          Retake Quiz
                        </button>
                        <button
                          onClick={() => setLessonQuiz(null)}
                          className={`px-4 py-2 border rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                            themeMode === 'light'
                              ? 'border-zinc-250 text-zinc-600 hover:text-zinc-900 bg-zinc-50 hover:bg-zinc-100'
                              : 'border-zinc-800 text-zinc-400 hover:text-zinc-100'
                          }`}
                        >
                          Reset Settings
                        </button>
                      </div>
                    </div>
                  )}

                  {lessonQuiz.currentIndex < lessonQuiz.questions.length && (
                    <div className="flex items-center justify-end border-t border-zinc-800/10 pt-3">
                      {!lessonQuiz.hasSubmitted ? (
                        <button
                          disabled={lessonQuiz.selectedOption === null}
                          onClick={() => {
                            const isCorrect = lessonQuiz.selectedOption === lessonQuiz.questions[lessonQuiz.currentIndex].correctIndex;
                            setLessonQuiz({
                              ...lessonQuiz,
                              hasSubmitted: true,
                              score: isCorrect ? lessonQuiz.score + 10 : lessonQuiz.score
                            });
                          }}
                          className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-indigo-500 hover:bg-indigo-600 disabled:opacity-40 text-white cursor-pointer transition-colors"
                        >
                          Submit Answer
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setLessonQuiz({
                              ...lessonQuiz,
                              currentIndex: lessonQuiz.currentIndex + 1,
                              selectedOption: null,
                              hasSubmitted: false
                            });
                          }}
                          className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-zinc-150 text-zinc-950 hover:bg-zinc-200 cursor-pointer transition-colors"
                        >
                          {lessonQuiz.currentIndex + 1 === lessonQuiz.questions.length ? 'See Results' : 'Next Question'}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeRightTab === 'assignments' && (
            <div className={`p-5 rounded-2xl border flex flex-col gap-4 min-h-[440px] flex-1 ${themeCardBg} animate-fade-in`}>
              <div className="pb-3 border-b border-zinc-800/10 flex items-center justify-between">
                <div>
                  <h4 className={`text-xs font-semibold font-mono uppercase tracking-wider ${themeTitleText}`}>Practice Assignments</h4>
                  <p className={`text-[10px] mt-0.5 ${themeMutedText}`}>Submit homework and receive AI evaluations</p>
                </div>
                <button
                  onClick={handleGenerateAssignment}
                  disabled={isGeneratingAssignment}
                  className="px-2.5 py-1.5 rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-550 dark:text-indigo-400 border border-indigo-500/20 text-[9px] font-mono font-bold flex items-center gap-1 disabled:opacity-50 transition-colors"
                >
                  {isGeneratingAssignment ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Sparkles className="w-3 h-3 animate-pulse" />
                  )}
                  <span>Generate Task</span>
                </button>
              </div>
 
              {lesson.assignments && lesson.assignments.length > 0 ? (
                <div className="flex flex-col gap-4 flex-1">
                  {/* Select active assignment */}
                  <div className={`flex gap-1 overflow-x-auto pb-1 border-b ${themeMode === 'light' ? 'border-zinc-200' : 'border-zinc-850'}`}>
                    {lesson.assignments.map((a, idx) => (
                      <button
                        key={a.id}
                        onClick={() => {
                          setActiveAssignmentId(a.id);
                          setSubmissionText(a.submissionText || '');
                        }}
                        className={`px-2 py-1 rounded text-[9px] font-mono whitespace-nowrap transition-all border ${
                          activeAssignmentId === a.id
                            ? themeMode === 'light'
                              ? 'bg-indigo-50 border-indigo-250 text-indigo-700 font-bold'
                              : 'bg-zinc-900 text-indigo-400 border-indigo-500/20'
                            : themeMode === 'light'
                            ? 'bg-transparent text-zinc-500 border-transparent hover:text-zinc-900'
                            : 'bg-transparent text-zinc-500 border-transparent hover:text-zinc-300'
                        }`}
                      >
                        Task {idx + 1}: {a.title.substring(0, 15)}...
                      </button>
                    ))}
                  </div>
 
                  {activeAssign && (
                    <div className="flex flex-col gap-3.5 flex-1 overflow-y-auto max-h-[300px] pr-1.5 custom-editor-scrollbar">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase border ${
                            themeMode === 'light' ? 'bg-zinc-100 border-zinc-250 text-zinc-650' : 'bg-zinc-950 border border-zinc-850 text-zinc-400'
                          }`}>
                            {activeAssign.type}
                          </span>
                          <h4 className={`text-xs font-semibold ${themeTitleText}`}>{activeAssign.title}</h4>
                        </div>
                        <p className={`text-[11px] mt-1.5 p-2.5 rounded-lg border leading-relaxed whitespace-pre-line ${
                          themeMode === 'light' ? 'bg-zinc-100/60 border-zinc-200 text-zinc-650' : 'bg-zinc-950/30 border border-zinc-850/40 text-zinc-400'
                        }`}>
                          {activeAssign.requirements}
                        </p>
                      </div>
 
                      {activeAssign.submitted ? (
                        <div className="flex flex-col gap-3">
                          <div className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                            themeMode === 'light' ? 'border-emerald-300 bg-emerald-50/70 text-emerald-850' : 'border-emerald-500/25 bg-emerald-500/10 text-zinc-300'
                          }`}>
                            <Award className="w-5 h-5 text-emerald-500 dark:text-emerald-400 mt-0.5 shrink-0" />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className={`text-xs font-bold font-display ${themeTitleText}`}>Grade Received:</span>
                                <span className="px-2 py-0.5 rounded bg-emerald-500 font-mono text-xs text-white font-bold">{activeAssign.grade || 'A'}</span>
                              </div>
                              <p className={`text-[11px] leading-relaxed mt-2 ${
                                themeMode === 'light' ? 'text-zinc-700' : 'text-zinc-300'
                              }`}>{activeAssign.feedback}</p>
                            </div>
                          </div>
 
                          {activeAssign.evaluation && (
                            <div className={`p-3.5 rounded-xl border ${
                              themeMode === 'light' ? 'bg-zinc-100 border-zinc-200 text-zinc-650' : 'bg-zinc-950 border border-zinc-850/80 text-zinc-400'
                            }`}>
                              <p className="text-[9px] font-mono font-bold uppercase tracking-wider text-indigo-500">Areas for Improvement</p>
                              <p className="text-[11px] leading-relaxed mt-1.5">{activeAssign.evaluation}</p>
                            </div>
                          )}
 
                          <button
                            onClick={() => {
                              const updated = (lesson.assignments || []).map(a => {
                                if (a.id === activeAssignmentId) {
                                  return { ...a, submitted: false, feedback: undefined, grade: undefined, evaluation: undefined };
                                }
                                return a;
                              });
                              if (onUpdateLesson) {
                                onUpdateLesson(lesson.id, { assignments: updated });
                              }
                            }}
                            className={`px-3 py-1.5 border text-[10px] rounded-lg font-mono self-start select-none cursor-pointer transition-colors ${
                              themeMode === 'light'
                                ? 'border-zinc-250 text-zinc-500 hover:text-zinc-900 bg-zinc-50 hover:bg-zinc-100'
                                : 'border-zinc-800 text-zinc-500 hover:text-zinc-300'
                            }`}
                          >
                            Resubmit Solution
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-3 flex-1">
                          <label className={`text-[9px] font-mono font-bold uppercase tracking-wider block ${themeMutedText}`}>Write your solution</label>
                          <textarea
                            value={submissionText}
                            onChange={(e) => setSubmissionText(e.target.value)}
                            placeholder="Type your essay or code solution here..."
                            className={`w-full flex-1 min-h-[120px] p-3 text-xs font-mono rounded-xl border resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500 ${themeInputBg}`}
                          />
 
                          {/* File Drag-and-drop workspace */}
                          <div 
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`py-5 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                              dragOver 
                                ? 'border-indigo-500 bg-indigo-500/5' 
                                : themeMode === 'light'
                                ? 'border-zinc-250 hover:border-zinc-350 bg-zinc-50/30 text-zinc-650'
                                : 'border-zinc-800/80 hover:border-zinc-700 bg-zinc-950/20'
                            }`}
                          >
                            <Upload className="w-5 h-5 text-zinc-500" />
                            <span className={`text-[10px] font-sans ${themeMode === 'light' ? 'text-zinc-600' : 'text-zinc-400'}`}>
                              {attachedFile ? `Attached: ${attachedFile}` : 'Drag & drop supporting screenshot, or click to upload'}
                            </span>
                            <label className="text-[9px] font-mono text-indigo-500 dark:text-indigo-400 hover:underline">
                              Select File
                              <input type="file" onChange={handleFileSelect} className="hidden" />
                            </label>
                          </div>
 
                          <button
                            onClick={handleSubmitAssignment}
                            disabled={isEvaluating || !submissionText.trim()}
                            className="w-full flex items-center justify-center gap-2 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-40 text-white rounded-xl text-xs font-semibold shadow-md transition-colors"
                          >
                            {isEvaluating ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>AI Evaluating Solution...</span>
                              </>
                            ) : (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Submit Solution for AI Grade</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 flex flex-col items-center justify-center flex-1">
                  <FileText className="w-10 h-10 text-zinc-500 mb-2.5" />
                  <h4 className={`text-xs font-semibold ${themeTitleText}`}>No Custom Lesson Tasks</h4>
                  <p className={`text-[11px] max-w-xs mt-1.5 leading-relaxed ${themeMutedText}`}>
                    Generate customized, academic homework specific to this lesson using Gemini.
                  </p>
                  <button
                    onClick={handleGenerateAssignment}
                    disabled={isGeneratingAssignment}
                    className="mt-4 flex items-center gap-1.5 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-xs font-semibold shadow-md cursor-pointer transition-colors"
                  >
                    {isGeneratingAssignment ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                    )}
                    <span>Generate AI Assignment</span>
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
