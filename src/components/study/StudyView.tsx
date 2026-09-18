"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { signIn, signOut, useSession } from "next-auth/react";
import {
  BookOpen,
  CheckCircle2,
  Circle,
  LogOut,
  Plus,
  Save,
  Trash2,
  Video,
  FileText,
  Link2,
  Code2,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { StudySkeleton, StudyLoginSkeleton } from "./StudySkeleton";

const PracticePlayground = dynamic(
  () => import("./PracticePlayground").then((mod) => mod.PracticePlayground),
  {
    ssr: false,
    loading: () => (
      <div className="h-80 animate-pulse rounded-xl border border-zinc-200 bg-zinc-100" />
    ),
  },
);

type LessonType = "video" | "document" | "article" | "practice";
type PracticeEnv = "javascript" | "react" | "html-css";

type Lesson = {
  id: string;
  title: string;
  type: LessonType;
  contentUrl?: string;
  contentText?: string;
  practiceEnv?: PracticeEnv;
  completed: boolean;
  order: number;
};

type Course = {
  _id: string;
  title: string;
  description: string;
  tags: string[];
  saved: boolean;
  planDate?: string;
  planNotes?: string;
  lessons: Lesson[];
  updatedAt?: string;
};

function progressPercent(course: Course) {
  if (!course.lessons.length) return 0;
  return Math.round(
    (course.lessons.filter((lesson) => lesson.completed).length / course.lessons.length) *
      100,
  );
}

function StudyWorkspace() {
  const { data: session, status } = useSession();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonType, setLessonType] = useState<LessonType>("video");
  const [lessonUrl, setLessonUrl] = useState("");
  const [lessonText, setLessonText] = useState("");
  const [lessonEnv, setLessonEnv] = useState<PracticeEnv>("javascript");
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [authBusy, setAuthBusy] = useState(false);

  const selected = courses.find((course) => course._id === selectedId) || null;

  
  async function loadCourses() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/study/courses");
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(
          typeof data.error === "string"
            ? data.error
            : "We couldn't load your courses. Please try again.",
        );
        return;
      }
      setCourses(data.courses || []);
    } catch {
      setError("We couldn't load your courses. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (session?.user?.id) loadCourses();
  }, [session?.user?.id]);

  
  async function handleEmailAuth(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuggestions([]);
    setAuthBusy(true);

    try {
      if (authMode === "register") {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) {
          if (data.suggestions) {
            setSuggestions(data.suggestions);
          }
          setError(
            typeof data.error === "string"
              ? data.error
              : "We couldn't create your account. Please try again.",
          );
          return;
        }
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (result?.error) setError("Incorrect email, username, or password. Please try again.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setAuthBusy(false);
    }
  }

  async function handleSocialLogin(provider: "google" | "facebook") {
    const configured =
      provider === "google"
        ? process.env.NEXT_PUBLIC_AUTH_GOOGLE === "1"
        : process.env.NEXT_PUBLIC_AUTH_FACEBOOK === "1";

    if (!configured) {
      setError(
        "That sign-in option isn't available right now. Please use email instead.",
      );
      return;
    }

    setError("");
    setAuthBusy(true);
    await signIn(provider, { callbackUrl: window.location.href });
  }

  
  async function createCourse(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setError("");
    const res = await fetch("/api/study/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newTitle,
        description: newDescription,
        tags: ["react", "next", "js"],
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(
        typeof data.error === "string"
          ? data.error
          : "We couldn't create that course. Please try again.",
      );
      return;
    }
    setNewTitle("");
    setNewDescription("");
    setCourses((prev) => [data.course, ...prev]);
    setSelectedId(data.course._id);
  }

  
  async function patchCourse(courseId: string, body: Record<string, unknown>) {
    setError("");
    const res = await fetch(`/api/study/courses/${courseId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(
        typeof data.error === "string"
          ? data.error
          : "We couldn't save your changes. Please try again.",
      );
      return;
    }
    setCourses((prev) =>
      prev.map((course) => (course._id === courseId ? data.course : course)),
    );
  }

  
  async function deleteCourse(courseId: string) {
    if (!confirm("Delete this course?")) return;
    const res = await fetch(`/api/study/courses/${courseId}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json();
      setError(
        typeof data.error === "string"
          ? data.error
          : "We couldn't delete that course. Please try again.",
      );
      return;
    }
    setCourses((prev) => prev.filter((course) => course._id !== courseId));
    if (selectedId === courseId) {
      setSelectedId(null);
      setActiveLessonId(null);
    }
  }

  
  async function addLesson(e: React.FormEvent) {
    e.preventDefault();
    if (!selected || !lessonTitle.trim()) return;
    await patchCourse(selected._id, {
      addLesson: {
        title: lessonTitle,
        type: lessonType,
        contentUrl: lessonUrl,
        contentText: lessonText,
        practiceEnv: lessonEnv,
      },
    });
    setLessonTitle("");
    setLessonUrl("");
    setLessonText("");
  }

  const savedCourses = courses.filter((course) => course.saved);
  const plannedCourses = courses.filter((course) => course.planDate);
  const overallDone = courses.reduce(
    (sum, course) => sum + course.lessons.filter((lesson) => lesson.completed).length,
    0,
  );
  const overallTotal = courses.reduce((sum, course) => sum + course.lessons.length, 0);

  if (status === "loading") {
    return <StudyLoginSkeleton />;
  }

  const field =
    "w-full h-12 rounded-xl border border-zinc-200/90 bg-[#ffffff] px-4 text-[15px] text-[#1f1f1f] placeholder:text-[#666666] outline-none transition shadow-[inset_0_1px_2px_rgba(15,23,42,0.03)] hover:border-zinc-300 focus:border-[#da7b5a] focus:ring-4 focus:ring-[#da7b5a]/20";
  const btnPrimary =
    "inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#da7b5a] px-5 text-[15px] font-bold text-white transition hover:bg-[#c46a4c] active:scale-[0.99] disabled:opacity-55 disabled:pointer-events-none";
  const btnSecondary =
    "inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-[#ffffff] px-4 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50";

  if (!session) {
    return (
      <div
        id="study-auth"
        className="grid lg:grid-cols-[1.05fr_0.95fr] min-h-[calc(100dvh-3.5rem)] sm:min-h-[calc(100dvh-5.5rem)]"
      >
        <aside className="relative hidden lg:flex flex-col justify-between bg-[#f3f1ec] px-12 xl:px-16 py-14 text-[#1f1f1f] overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-[#da7b5a]/10 to-transparent" />
          <div className="relative max-w-md">
            <p className="text-[13px] font-semibold tracking-[0.2em] uppercase text-[#666666]">
              Study
            </p>
            <h2 className="mt-6 text-[2.6rem] xl:text-[2.9rem] font-bold leading-[1.08] tracking-tight">
              A calm place
              <span className="block font-semibold text-[#666666] mt-1">
                to learn & practice.
              </span>
            </h2>
            <p className="mt-6 text-base leading-relaxed text-[#666666] max-w-sm">
              Keep courses, mark progress, and run JS / React / HTML–CSS drills
              without juggling tabs.
            </p>
          </div>

          <ol className="relative space-y-6 max-w-sm">
            {[
              ["01", "Build a course", "Add videos, docs, or practice lessons"],
              ["02", "Track what matters", "Check off lessons and set a plan date"],
              ["03", "Practice live", "Code in the browser when you are ready"],
            ].map(([n, title, text]) => (
              <li key={n} className="flex gap-4">
                <span className="text-sm font-bold tabular-nums text-[#666666] pt-0.5 w-7 shrink-0">
                  {n}
                </span>
                <div>
                  <p className="text-[15px] font-bold text-[#1f1f1f]">{title}</p>
                  <p className="mt-0.5 text-sm text-[#666666]">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </aside>

        <section className="flex items-center justify-center bg-[#f7f9fc] px-5 py-10 sm:px-8 lg:bg-[#ffffff] lg:px-12 xl:px-16">
          <div className="w-full max-w-[380px]">
            <div className="mb-8 text-center lg:text-left">
              <p className="lg:hidden text-[12px] font-bold uppercase tracking-[0.18em] text-[#1f1f1f] mb-3">
                Study
              </p>
              <h3 className="text-[1.65rem] sm:text-[1.75rem] font-bold tracking-tight text-[#1f1f1f]">
                {authMode === "login" ? "Welcome back" : "Join Study"}
              </h3>
              <p className="mt-2 text-[15px] text-[#666666] leading-relaxed">
                {authMode === "login"
                  ? "Sign in to open your courses."
                  : "Create an account — your progress stays saved."}
              </p>
            </div>

            <div
              role="tablist"
              className="mb-6 flex rounded-full bg-zinc-200/70 p-1"
            >
              {(["login", "register"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  role="tab"
                  aria-selected={authMode === mode}
                  onClick={() => {
                    setAuthMode(mode);
                    setError("");
                  }}
                  className={`h-10 flex-1 rounded-full text-sm font-semibold transition ${
                    authMode === mode
                      ? "bg-[#ffffff] text-[#1f1f1f] shadow-sm"
                      : "text-[#666666] hover:text-zinc-700"
                  }`}
                >
                  {mode === "login" ? "Log in" : "Sign up"}
                </button>
              ))}
            </div>

            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="study-email" className="block text-[13px] font-semibold text-zinc-600">
                  Email or Username
                </label>
                <input
                  id="study-email"
                  type="text"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setSuggestions([]);
                    setError("");
                  }}
                  placeholder="Email or username"
                  autoComplete="username"
                  className={field}
                />
                {suggestions.length > 0 && (
                  <div className="mt-2 text-[13px]">
                    <span className="text-[#666666] mr-2">Try:</span>
                    <div className="flex flex-wrap gap-2 mt-1.5">
                      {suggestions.map(sug => (
                        <button
                          key={sug}
                          type="button"
                          onClick={() => {
                            setEmail(sug);
                            setSuggestions([]);
                            setError("");
                          }}
                          className="px-2.5 py-1 rounded-md bg-zinc-100 text-[#1f1f1f] font-semibold hover:bg-zinc-200 transition"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-1.5">
                <label htmlFor="study-password" className="block text-[13px] font-semibold text-zinc-600">
                  Password
                </label>
                <input
                  id="study-password"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  autoComplete={authMode === "login" ? "current-password" : "new-password"}
                  className={field}
                />
              </div>

              {error ? (
                <p
                  role="alert"
                  className="rounded-xl border border-red-200/80 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {error}
                </p>
              ) : null}

              <button type="submit" disabled={authBusy} className={`${btnPrimary} w-full mt-1`}>
                {authBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {authMode === "login" ? "Continue" : "Create account"}
              </button>
            </form>

            <div className="relative my-7">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-zinc-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-[#f7f9fc] lg:bg-[#ffffff] px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#666666]">
                  or
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={authBusy}
                onClick={() => handleSocialLogin("google")}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-[#ffffff] text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-55"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#EA4335" d="M12 10.2v3.6h5.1c-.2 1.2-.9 2.3-1.9 3l3.1 2.4c1.8-1.7 2.9-4.1 2.9-7 0-.7-.1-1.3-.2-1.9H12z" />
                  <path fill="#34A853" d="M5.3 14.3l-.8.6-2.7 2.1C3.5 20.1 7.4 23 12 23c2.7 0 5-.9 6.7-2.4l-3.1-2.4c-.9.6-2 .9-3.6.9-2.8 0-5.1-1.9-6-4.4z" />
                  <path fill="#4A90E2" d="M3.8 6.9C3.3 7.9 3 9 3 10.2c0 1.2.3 2.3.8 3.3l3.5-2.7c-.2-.6-.3-1.2-.3-1.8 0-.6.1-1.2.3-1.8L3.8 6.9z" />
                  <path fill="#FBBC05" d="M12 4.9c1.5 0 2.8.5 3.8 1.5l2.8-2.8C16.9 1.9 14.7 1 12 1 7.4 1 3.5 3.9 1.8 8.1l3.5 2.7C6.9 7.2 9.2 4.9 12 4.9z" />
                </svg>
                Google
              </button>
              <button
                type="button"
                disabled={authBusy}
                onClick={() => handleSocialLogin("facebook")}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#1877F2] text-sm font-semibold text-[#1f1f1f] transition hover:bg-[#166fe5] disabled:opacity-55"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22 12.07C22 6.48 17.52 2 11.93 2S1.86 6.48 1.86 12.07c0 4.99 3.64 9.13 8.4 9.93v-7.02H7.9v-2.91h2.36V9.83c0-2.33 1.39-3.62 3.52-3.62 1.02 0 2.09.18 2.09.18v2.3h-1.18c-1.16 0-1.52.72-1.52 1.46v1.75h2.59l-.41 2.91h-2.18V22c4.76-.8 8.4-4.94 8.4-9.93z" />
                </svg>
                Facebook
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (loading && !courses.length) {
    return <StudySkeleton />;
  }

  if (selected) {
    const doneCount = selected.lessons.filter((lesson) => lesson.completed).length;
    return (
      <div id="study-course-detail" className="mx-auto w-full max-w-3xl px-5 py-8 sm:px-8 lg:px-10 space-y-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <button
              type="button"
              onClick={() => {
                setSelectedId(null);
                setActiveLessonId(null);
              }}
              className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#1f1f1f] hover:underline"
            >
              <ArrowLeft className="h-4 w-4" /> All courses
            </button>
            <h2 className="text-[1.65rem] font-bold tracking-tight text-[#1f1f1f] leading-tight">
              {selected.title}
            </h2>
            {selected.description ? (
              <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-zinc-600">
                {selected.description}
              </p>
            ) : null}
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
              <span className="font-bold text-[#1f1f1f]">{progressPercent(selected)}%</span>
              <span className="text-[#666666]">
                {doneCount} of {selected.lessons.length} lessons done
              </span>
            </div>
            <div className="mt-2 h-2 max-w-sm overflow-hidden rounded-full bg-zinc-100">
              <div
                className="h-full rounded-full bg-[#da7b5a] transition-all duration-300"
                style={{ width: `${progressPercent(selected)}%` }}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              type="button"
              onClick={() => patchCourse(selected._id, { saved: !selected.saved })}
              className={btnSecondary}
            >
              <Save className="h-4 w-4" />
              {selected.saved ? "Saved" : "Save"}
            </button>
            <button
              type="button"
              onClick={() => deleteCourse(selected._id)}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-red-200 bg-[#ffffff] px-4 text-sm font-semibold text-red-600 transition hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" /> Delete
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-2xl border border-zinc-200 bg-zinc-50/60 p-5">
          <label className="space-y-1.5 text-[13px]">
            <span className="font-semibold text-zinc-700">Plan date</span>
            <input
              type="date"
              value={selected.planDate || ""}
              onChange={(e) => patchCourse(selected._id, { planDate: e.target.value })}
              className={field}
            />
          </label>
          <label className="space-y-1.5 text-[13px]">
            <span className="font-semibold text-zinc-700">Plan note</span>
            <input
              value={selected.planNotes || ""}
              onChange={(e) => patchCourse(selected._id, { planNotes: e.target.value })}
              placeholder="Focus for this week"
              className={field}
            />
          </label>
        </div>

        <form onSubmit={addLesson} className="space-y-4 rounded-2xl border border-zinc-200 p-5">
          <p className="text-sm font-bold text-[#1f1f1f]">Add a lesson</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              value={lessonTitle}
              onChange={(e) => setLessonTitle(e.target.value)}
              placeholder="Lesson title"
              className={field}
              required
            />
            <select
              value={lessonType}
              onChange={(e) => setLessonType(e.target.value as LessonType)}
              className={field}
            >
              <option value="video">Video</option>
              <option value="document">Document</option>
              <option value="article">Article / link</option>
              <option value="practice">Code practice</option>
            </select>
            {(lessonType === "video" || lessonType === "article" || lessonType === "document") && (
              <input
                value={lessonUrl}
                onChange={(e) => setLessonUrl(e.target.value)}
                placeholder="URL (YouTube, docs, PDF)"
                className={`${field} sm:col-span-2`}
              />
            )}
            {lessonType !== "practice" && (
              <textarea
                value={lessonText}
                onChange={(e) => setLessonText(e.target.value)}
                placeholder="Notes (optional)"
                rows={3}
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50/80 px-4 py-3 text-[15px] text-[#1f1f1f] placeholder:text-[#666666] outline-none transition focus:border-[#da7b5a] focus:bg-[#ffffff] focus:ring-4 focus:ring-[#da7b5a]/20 sm:col-span-2"
              />
            )}
            {lessonType === "practice" && (
              <select
                value={lessonEnv}
                onChange={(e) => setLessonEnv(e.target.value as PracticeEnv)}
                className={`${field} sm:col-span-2`}
              >
                <option value="javascript">JavaScript</option>
                <option value="react">React</option>
                <option value="html-css">HTML / CSS</option>
              </select>
            )}
          </div>
          <button type="submit" className={btnPrimary}>
            <Plus className="h-4 w-4" /> Add lesson
          </button>
        </form>

        <section className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wide text-[#666666]">
            Lessons
          </h3>
          {selected.lessons
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((lesson) => (
              <div
                key={lesson.id}
                className="overflow-hidden rounded-xl border border-zinc-200 bg-[#ffffff] transition hover:border-zinc-300"
              >
                <div className="flex items-center gap-1 p-2 sm:p-2.5">
                  <button
                    type="button"
                    onClick={() => patchCourse(selected._id, { toggleLessonId: lesson.id })}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg hover:bg-zinc-50"
                    title="Mark complete"
                    aria-label={lesson.completed ? "Mark incomplete" : "Mark complete"}
                  >
                    {lesson.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-[#666666]" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveLessonId(activeLessonId === lesson.id ? null : lesson.id)
                    }
                    className="min-w-0 flex-1 rounded-lg px-2 py-2 text-left hover:bg-zinc-50"
                  >
                    <div className="truncate text-[15px] font-semibold text-[#1f1f1f]">
                      {lesson.title}
                    </div>
                    <div className="mt-0.5 flex items-center gap-1.5 text-[13px] capitalize text-[#666666]">
                      {lesson.type === "video" && <Video className="h-3.5 w-3.5" />}
                      {lesson.type === "document" && <FileText className="h-3.5 w-3.5" />}
                      {lesson.type === "article" && <Link2 className="h-3.5 w-3.5" />}
                      {lesson.type === "practice" && <Code2 className="h-3.5 w-3.5" />}
                      {lesson.type}
                      {lesson.type === "practice" ? ` · ${lesson.practiceEnv}` : ""}
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => patchCourse(selected._id, { removeLessonId: lesson.id })}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-[#666666] hover:bg-red-50 hover:text-red-500"
                    aria-label="Remove lesson"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {activeLessonId === lesson.id && (
                  <div className="space-y-3 border-t border-zinc-100 bg-zinc-50/50 px-4 py-4 sm:px-5">
                    {lesson.contentUrl && (
                      <a
                        href={lesson.contentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex text-sm font-semibold text-[#1f1f1f] hover:underline"
                      >
                        Open resource →
                      </a>
                    )}
                    {lesson.contentText && (
                      <pre className="whitespace-pre-wrap rounded-lg bg-[#ffffff] border border-zinc-200 p-3 text-[13px] leading-relaxed text-zinc-600">
                        {lesson.contentText}
                      </pre>
                    )}
                    {lesson.type === "practice" && (
                      <PracticePlayground env={lesson.practiceEnv || "javascript"} />
                    )}
                    {lesson.type === "video" && lesson.contentUrl?.includes("youtube") && (
                      <div className="aspect-video overflow-hidden rounded-xl bg-[#f3f1ec]">
                        <iframe
                          title={lesson.title}
                          src={lesson.contentUrl.replace("watch?v=", "embed/")}
                          className="h-full w-full"
                          allowFullScreen
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          {!selected.lessons.length && (
            <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-6 py-12 text-center">
              <p className="text-sm font-medium text-zinc-600">No lessons yet</p>
              <p className="mt-1 text-sm text-[#666666]">Add your first lesson above to begin.</p>
            </div>
          )}
        </section>

        {error ? (
          <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}
      </div>
    );
  }

  const overallPct = overallTotal ? Math.round((overallDone / overallTotal) * 100) : 0;

  return (
    <div id="study-view" className="mx-auto w-full max-w-3xl px-5 py-8 sm:px-8 lg:px-10 space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#666666]">
            Workspace
          </p>
          <h2 className="mt-1 text-[1.75rem] font-bold tracking-tight text-[#1f1f1f]">
            Your courses
          </h2>
          <p className="mt-1 truncate text-sm text-[#666666]">
            {session.user?.email}
          </p>
        </div>
        <button type="button" onClick={() => signOut()} className={`${btnSecondary} self-start sm:self-auto`}>
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </header>

      <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
        <div className="rounded-2xl border border-zinc-200 bg-[#da7b5a] px-3 py-4 sm:px-5 sm:py-5 text-[#1f1f1f] col-span-1">
          <p className="text-[11px] sm:text-[13px] font-medium text-[#666666]">Progress</p>
          <p className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight">{overallPct}%</p>
          <p className="mt-1 text-[11px] sm:text-[13px] text-[#666666]">
            {overallDone}/{overallTotal} done
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-[#ffffff] px-3 py-4 sm:px-5 sm:py-5">
          <p className="text-[11px] sm:text-[13px] font-medium text-[#666666]">Saved</p>
          <p className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-[#1f1f1f]">
            {savedCourses.length}
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-[#ffffff] px-3 py-4 sm:px-5 sm:py-5">
          <p className="text-[11px] sm:text-[13px] font-medium text-[#666666]">Planned</p>
          <p className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-[#1f1f1f]">
            {plannedCourses.length}
          </p>
        </div>
      </div>

      <form
        onSubmit={createCourse}
        className="rounded-2xl border border-zinc-200 bg-[#ffffff] p-5 sm:p-6 space-y-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
      >
        <div>
          <h3 className="text-base font-bold text-[#1f1f1f]">Start a course</h3>
          <p className="mt-0.5 text-sm text-[#666666]">
            Give it a clear title — you can add lessons next.
          </p>
        </div>
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="e.g. Next.js App Router"
          className={field}
          required
        />
        <textarea
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          placeholder="Short description (optional)"
          rows={2}
          className="w-full rounded-lg border border-zinc-200 bg-zinc-50/80 px-4 py-3 text-[15px] text-[#1f1f1f] placeholder:text-[#666666] outline-none transition focus:border-[#da7b5a] focus:bg-[#ffffff] focus:ring-4 focus:ring-[#da7b5a]/20"
        />
        <button type="submit" className={btnPrimary}>
          <Plus className="h-4 w-4" /> Create course
        </button>
      </form>

      {plannedCourses.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wide text-[#666666]">
            Study plan
          </h3>
          <div className="space-y-2">
            {plannedCourses.map((course) => (
              <button
                key={course._id}
                type="button"
                onClick={() => setSelectedId(course._id)}
                className="flex w-full items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-left transition hover:border-zinc-300"
              >
                <div className="min-w-0">
                  <div className="truncate text-[15px] font-semibold text-[#1f1f1f]">
                    {course.title}
                  </div>
                  <div className="mt-0.5 truncate text-[13px] text-zinc-600">
                    {course.planDate}
                    {course.planNotes ? ` · ${course.planNotes}` : ""}
                  </div>
                </div>
                <span className="shrink-0 text-sm font-bold text-[#1f1f1f]">
                  {progressPercent(course)}%
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wide text-[#666666]">
            All courses
          </h3>
          {loading && courses.length > 0 ? (
            <span className="text-[13px] text-[#666666]">Updating…</span>
          ) : null}
        </div>

        {!loading && courses.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-6 py-14 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 text-[#1f1f1f]">
              <BookOpen className="h-6 w-6" />
            </div>
            <p className="mt-4 text-base font-bold text-zinc-800">No courses yet</p>
            <p className="mt-1 text-sm text-[#666666]">
              Create your first course above to start tracking.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {courses.map((course) => (
              <button
                key={course._id}
                type="button"
                onClick={() => setSelectedId(course._id)}
                className="group w-full rounded-xl border border-zinc-200 bg-[#ffffff] p-4 text-left transition hover:border-zinc-300 hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-[15px] font-semibold text-[#1f1f1f] group-hover:text-[#1f1f1f]">
                      {course.title}
                    </div>
                    <div className="mt-1 text-[13px] text-[#666666]">
                      {course.lessons.length} lesson{course.lessons.length === 1 ? "" : "s"}
                      {course.saved ? " · saved" : ""}
                    </div>
                  </div>
                  <span className="shrink-0 text-sm font-bold tabular-nums text-[#1f1f1f]">
                    {progressPercent(course)}%
                  </span>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-zinc-100">
                  <div
                    className="h-full rounded-full bg-[#da7b5a] transition-all"
                    style={{ width: `${progressPercent(course)}%` }}
                  />
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {error ? (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function StudyView() {
  return <StudyWorkspace />;
}
