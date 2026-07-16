import React from 'react';
import { ThemeColors } from '../types';

interface SectionSkeletonProps {
  colors: ThemeColors;
  themeMode: 'light' | 'dark';
}

export default function SectionSkeleton({ colors, themeMode }: SectionSkeletonProps) {
  const isDark = themeMode === 'dark';
  const shimmerClass = isDark
    ? 'bg-gradient-to-r from-zinc-900 via-zinc-800/60 to-zinc-900 bg-[length:200%_100%] animate-shimmer'
    : 'bg-gradient-to-r from-zinc-200 via-zinc-100/60 to-zinc-200 bg-[length:200%_100%] animate-shimmer';

  return (
    <div className="w-full py-16 space-y-8 animate-pulse">
      {/* Title / Section Header */}
      <div className="space-y-3">
        <div className={`w-20 h-4 rounded-md ${shimmerClass}`} />
        <div className={`w-48 h-8 rounded-lg ${shimmerClass}`} />
      </div>

      {/* Content blocks */}
      <div className="space-y-4">
        <div className={`w-full h-4 rounded-lg ${shimmerClass}`} />
        <div className={`w-[92%] h-4 rounded-lg ${shimmerClass}`} />
        <div className={`w-[85%] h-4 rounded-lg ${shimmerClass}`} />
      </div>

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
