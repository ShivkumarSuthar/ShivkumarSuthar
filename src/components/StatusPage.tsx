"use client";

import Link from "next/link";
import { ArrowLeft, Home, BookOpen, Mail, RefreshCw } from "lucide-react";
import { SiteShell } from "./SiteShell";

type StatusPageProps = {
  code: string;
  title: string;
  description: string;
  primaryHref?: string;
  primaryLabel?: string;
  showRetry?: boolean;
  onRetry?: () => void;
  secondaryLinks?: boolean;
};

export function StatusPage({
  code,
  title,
  description,
  primaryHref = "/",
  primaryLabel = "Back to portfolio",
  showRetry = false,
  onRetry,
  secondaryLinks = true,
}: StatusPageProps) {
  return (
    <SiteShell currentTab="home" showFooter={false}>
      <div className="flex min-h-[50vh] items-center justify-center py-4">
        <div className="w-full max-w-xl overflow-hidden rounded-3xl border border-white/60 bg-[#ffffff]/80 shadow-[0_24px_60px_-20px_rgba(27,83,128,0.35)] backdrop-blur-sm">
          <div
            className="relative overflow-hidden px-8 pt-10 pb-8 text-center text-[#1f1f1f]"
            style={{ backgroundColor: "var(--bg-header)" }}
          >
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-black/5" />
            <div className="pointer-events-none absolute -bottom-16 -left-8 h-48 w-48 rounded-full bg-zinc-300/20" />
            <p className="relative text-7xl sm:text-8xl font-extrabold tracking-tight text-[#1f1f1f]/95">
              {code}
            </p>
            <h1 className="relative mt-3 text-2xl sm:text-3xl font-bold tracking-tight">
              {title}
            </h1>
            <p className="relative mx-auto mt-3 max-w-md text-sm sm:text-base text-[#666666] leading-relaxed">
              {description}
            </p>
          </div>

          <div className="space-y-4 px-8 py-8">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {showRetry && onRetry ? (
                <button
                  type="button"
                  onClick={onRetry}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#da7b5a] px-5 py-3 text-sm font-bold text-[#1f1f1f] transition hover:bg-[#f3f1ec]"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try again
                </button>
              ) : (
                <Link
                  href={primaryHref}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#da7b5a] px-5 py-3 text-sm font-bold text-[#1f1f1f] transition hover:bg-[#f3f1ec]"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {primaryLabel}
                </Link>
              )}

              {showRetry && (
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-[#ffffff] px-5 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
                >
                  <Home className="h-4 w-4 text-[#1f1f1f]" />
                  Home
                </Link>
              )}
            </div>

            {secondaryLinks && (
              <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 pt-2 text-sm">
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 font-semibold text-[#1f1f1f] hover:underline"
                >
                  <Home className="h-3.5 w-3.5" />
                  Portfolio
                </Link>
                <Link
                  href="/study"
                  className="inline-flex items-center gap-1.5 font-semibold text-[#1f1f1f] hover:underline"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  Study
                </Link>
                <a
                  href="mailto:suthar.developer@gmail.com"
                  className="inline-flex items-center gap-1.5 font-semibold text-[#1f1f1f] hover:underline"
                >
                  <Mail className="h-3.5 w-3.5" />
                  Contact
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
