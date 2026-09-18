"use client";

export function StudyLoginSkeleton() {
  return (
    <div
      className="grid min-h-[calc(100dvh-3.5rem)] lg:grid-cols-2 animate-pulse"
      aria-busy="true"
      aria-label="Loading login"
    >
      <div className="hidden lg:flex flex-col justify-between bg-[#123a5c] px-12 py-14">
        <div className="space-y-4">
          <div className="h-3 w-16 rounded bg-[#ffffff]/20" />
          <div className="h-12 w-64 rounded-lg bg-[#ffffff]/25" />
          <div className="h-10 w-48 rounded-lg bg-[#ffffff]/15" />
          <div className="h-4 w-72 rounded bg-black/5" />
        </div>
        <div className="space-y-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4">
              <div className="h-4 w-7 rounded bg-[#ffffff]/15" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-36 rounded bg-[#ffffff]/20" />
                <div className="h-3 w-48 rounded bg-black/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center bg-[#f7f9fc] lg:bg-[#ffffff] px-5 py-10">
        <div className="w-full max-w-[380px] space-y-4">
          <div className="mx-auto lg:mx-0 h-7 w-44 rounded-lg bg-zinc-200" />
          <div className="mx-auto lg:mx-0 h-4 w-56 rounded bg-zinc-100" />
          <div className="h-11 w-full rounded-full bg-zinc-200/80" />
          <div className="h-12 w-full rounded-xl bg-zinc-100" />
          <div className="h-12 w-full rounded-xl bg-zinc-100" />
          <div className="h-12 w-full rounded-xl bg-zinc-200" />
          <div className="grid grid-cols-2 gap-3 pt-4">
            <div className="h-12 rounded-xl bg-zinc-100" />
            <div className="h-12 rounded-xl bg-zinc-100" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function StudySkeleton() {
  return (
    <div
      className="mx-auto w-full max-w-3xl px-5 py-8 sm:px-8 animate-pulse space-y-8"
      aria-busy="true"
      aria-label="Loading"
    >
      <div className="space-y-2">
        <div className="h-3 w-24 rounded bg-zinc-200" />
        <div className="h-8 w-48 rounded-lg bg-zinc-200" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="h-24 rounded-2xl bg-zinc-200" />
        <div className="h-24 rounded-2xl bg-zinc-100" />
        <div className="h-24 rounded-2xl bg-zinc-100" />
      </div>
      <div className="h-44 rounded-2xl bg-zinc-100" />
    </div>
  );
}
