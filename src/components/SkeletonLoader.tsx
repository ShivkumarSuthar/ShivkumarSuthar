/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ThemeColors } from '../types';

interface SkeletonLoaderProps {
  colors: ThemeColors;
  themeMode: 'light' | 'dark';
}

export default function SkeletonLoader({ colors, themeMode }: SkeletonLoaderProps) {
  // Determine gradient style for the shimmering pulse effect based on the theme mode
  const shimmerClass = themeMode === 'dark'
    ? 'bg-gradient-to-r from-zinc-900 via-zinc-800/60 to-zinc-900 bg-[length:200%_100%] animate-shimmer'
    : 'bg-gradient-to-r from-zinc-200 via-zinc-100/60 to-zinc-200 bg-[length:200%_100%] animate-shimmer';

  const isDark = themeMode === 'dark';
  const accentBorderClass = colors.accent.includes('amber')
    ? 'border-amber-500/10'
    : colors.accent.includes('emerald')
    ? 'border-emerald-500/10'
    : colors.accent.includes('indigo')
    ? 'border-indigo-500/10'
    : colors.accent.includes('rose')
    ? 'border-rose-500/10'
    : 'border-zinc-500/10';

  return (
    <div className={`min-h-screen ${colors.bg} ${colors.text} overflow-hidden font-sans relative`}>
      {/* Background soft glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(120,119,198,0.03),transparent_50%)]" />

      {/* Header Skeleton */}
      <header className={`sticky top-0 z-40 w-full border-b ${isDark ? 'border-zinc-900/60 bg-zinc-950/80' : 'border-zinc-200/60 bg-white/80'} backdrop-blur-md`}>
        <div className="max-w-[90rem] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl ${shimmerClass}`} />
            <div className={`w-28 h-4 rounded-lg ${shimmerClass}`} />
          </div>
          <div className="hidden sm:flex items-center gap-6">
            <div className={`w-14 h-3.5 rounded ${shimmerClass}`} />
            <div className={`w-14 h-3.5 rounded ${shimmerClass}`} />
            <div className={`w-14 h-3.5 rounded ${shimmerClass}`} />
            <div className={`w-14 h-3.5 rounded ${shimmerClass}`} />
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-24 h-9 rounded-xl ${shimmerClass}`} />
          </div>
        </div>
      </header>

      {/* Body Skeleton content */}
      <div className="max-w-[90rem] mx-auto px-6 pt-24 pb-16 space-y-24">
        
        {/* Hero Section Skeleton */}
        <div className="space-y-10 max-w-3xl">
          <div className="space-y-4">
            {/* Tag */}
            <div className={`w-32 h-4 rounded-md ${shimmerClass}`} />
            {/* Large Name */}
            <div className={`w-full sm:w-[85%] h-12 sm:h-16 rounded-2xl ${shimmerClass}`} />
            {/* Subtitle / Role */}
            <div className={`w-2/3 h-8 sm:h-10 rounded-xl ${shimmerClass}`} />
          </div>

          {/* Description line paragraphs */}
          <div className="space-y-2.5 pt-4">
            <div className={`w-full h-3.5 rounded ${shimmerClass}`} />
            <div className={`w-[95%] h-3.5 rounded ${shimmerClass}`} />
            <div className={`w-[80%] h-3.5 rounded ${shimmerClass}`} />
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <div className={`w-36 h-11 rounded-xl ${shimmerClass}`} />
            <div className={`w-36 h-11 rounded-xl ${shimmerClass}`} />
          </div>
        </div>

        {/* Separator line */}
        <div className={`h-[1px] w-full ${isDark ? 'bg-zinc-900/60' : 'bg-zinc-200/60'}`} />

        {/* Projects / Cards Grid Skeleton */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className={`w-24 h-3.5 rounded ${shimmerClass}`} />
              <div className={`w-48 h-7 rounded-lg ${shimmerClass}`} />
            </div>
            <div className="hidden sm:flex gap-2">
              <div className={`w-16 h-8 rounded-lg ${shimmerClass}`} />
              <div className={`w-16 h-8 rounded-lg ${shimmerClass}`} />
            </div>
          </div>

          {/* 3 Grid Card skeletons */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((val) => (
              <div 
                key={val}
                className={`flex flex-col h-full rounded-2xl border ${isDark ? 'border-zinc-900 bg-zinc-900/10' : 'border-zinc-200 bg-white'} overflow-hidden`}
              >
                {/* Image Placeholder */}
                <div className={`aspect-[16/10] w-full ${shimmerClass}`} />
                {/* Card Info */}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2.5">
                    <div className={`w-1/2 h-4.5 rounded ${shimmerClass}`} />
                    <div className={`w-full h-3 rounded ${shimmerClass}`} />
                    <div className={`w-[85%] h-3 rounded ${shimmerClass}`} />
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <div className={`w-12 h-6 rounded-md ${shimmerClass}`} />
                    <div className={`w-12 h-6 rounded-md ${shimmerClass}`} />
                    <div className={`w-12 h-6 rounded-md ${shimmerClass}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Embedded style for keyframe shimmer gradient animation */}
      <style>{`
        @keyframes shimmer-move {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
        .animate-shimmer {
          animation: shimmer-move 2.2s infinite linear;
        }
      `}</style>
    </div>
  );
}
