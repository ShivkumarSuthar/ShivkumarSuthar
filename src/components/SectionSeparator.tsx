/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ThemeColors } from '../types';

interface SectionSeparatorProps {
  colors: ThemeColors;
  themeMode?: 'light' | 'dark';
}

export default function SectionSeparator({ colors, themeMode = 'dark' }: SectionSeparatorProps) {
  // Glow accent matching theme colors
  const glowColor = colors.accent.includes('amber')
    ? 'bg-amber-500/80 shadow-[0_0_12px_rgba(245,158,11,0.6)]'
    : colors.accent.includes('emerald')
    ? 'bg-emerald-500/80 shadow-[0_0_12px_rgba(16,185,129,0.6)]'
    : colors.accent.includes('indigo')
    ? 'bg-indigo-500/80 shadow-[0_0_12px_rgba(99,102,241,0.6)]'
    : colors.accent.includes('rose')
    ? 'bg-rose-500/80 shadow-[0_0_12px_rgba(244,63,94,0.6)]'
    : 'bg-zinc-450';

  const glowBorder = colors.accent.includes('amber')
    ? 'border-amber-500/30'
    : colors.accent.includes('emerald')
    ? 'border-emerald-500/30'
    : colors.accent.includes('indigo')
    ? 'border-indigo-500/30'
    : colors.accent.includes('rose')
    ? 'border-rose-500/30'
    : 'border-zinc-800';

  return (
    <div className="relative w-full py-6 flex items-center justify-center select-none overflow-hidden pointer-events-none">
      {/* Background radial soft gradient highlight for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_100%_at_50%_50%,rgba(244,244,245,0.01),transparent_80%)]" />

      <div className="relative w-full max-w-4xl flex items-center justify-center">
        {/* Left divider line */}
        <div className="flex-1 relative h-px">
          {/* Static thin dark line */}
          <div className={`absolute inset-0 ${themeMode === 'light' ? 'bg-zinc-200' : 'bg-zinc-900/60'}`} />
          {/* Animated line sliding or scaling out from center */}
          <motion.div
            initial={{ scaleX: 0, originX: 1 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute inset-0 bg-gradient-to-r from-transparent ${
              themeMode === 'light' ? 'via-zinc-300 to-zinc-200' : 'via-zinc-800/80 to-zinc-700/50'
            }`}
          />
        </div>

        {/* Center decorative capsule emblem */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
          className={`mx-4 px-3.5 py-1 rounded-full border ${glowBorder} flex items-center gap-1.5 ${
            themeMode === 'light' ? 'bg-zinc-100' : 'bg-zinc-950'
          }`}
        >
          {/* Tiny glowing dot */}
          <span className={`relative flex h-1.5 w-1.5`}>
            <span className={`absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping ${glowColor}`} />
            <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${glowColor}`} />
          </span>

          {/* Clean tech geometric markers */}
          <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-[0.25em] font-semibold leading-none">
            SYS.NODE
          </span>
        </motion.div>

        {/* Right divider line */}
        <div className="flex-1 relative h-px">
          {/* Static thin dark line */}
          <div className={`absolute inset-0 ${themeMode === 'light' ? 'bg-zinc-200' : 'bg-zinc-900/60'}`} />
          {/* Animated line sliding or scaling out from center */}
          <motion.div
            initial={{ scaleX: 0, originX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute inset-0 bg-gradient-to-l from-transparent ${
              themeMode === 'light' ? 'via-zinc-300 to-zinc-200' : 'via-zinc-800/80 to-zinc-700/50'
            }`}
          />
        </div>
      </div>
    </div>
  );
}
