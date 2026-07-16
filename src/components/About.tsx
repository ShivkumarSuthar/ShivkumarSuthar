/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PortfolioData, ThemeColors, Experience } from '../types';
import { motion } from 'motion/react';
import { 
  Briefcase, 
  Calendar, 
  MapPin, 
  Sparkles, 
  Trophy, 
  Cpu, 
  Layers, 
  Globe, 
  Mail, 
  Phone, 
  ArrowUpRight, 
  Check, 
  Copy, 
  Code, 
  Terminal, 
  Award,
  ShieldCheck,
  FileText
} from 'lucide-react';

interface AboutProps {
  data: PortfolioData;
  colors: ThemeColors;
}

const parseDescriptionToBullets = (desc: string): string[] => {
  if (!desc) return [];
  // Split by newlines first
  const lines = desc.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  // If we have multiple lines, clean them up and return
  if (lines.length > 1) {
    return lines.map(line => line.replace(/^[-•*+■]\s*/, ''));
  }
  
  // If it's a single line with sentences, split by sentences (period followed by space)
  const sentences = desc.split(/(?<=[.!?])\s+(?=[A-Z])/).map(s => s.trim()).filter(s => s.length > 0);
  if (sentences.length > 1) {
    return sentences;
  }
  
  return [desc];
};

export default function About({ data, colors }: AboutProps) {
  const [copied, setCopied] = useState(false);
  const themeMode = data.themeMode || 'dark';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(data.personal.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activeGlowBorder = colors.accent.includes('amber')
    ? 'border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.05)]'
    : colors.accent.includes('emerald')
    ? 'border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.05)]'
    : colors.accent.includes('indigo')
    ? 'border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.05)]'
    : colors.accent.includes('rose')
    ? 'border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.05)]'
    : 'border-zinc-500/30 shadow-[0_0_15px_rgba(244,244,245,0.05)]';

  const accentTextClass = colors.accent;
  
  const dotGlowClass = colors.accent.includes('amber')
    ? 'bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
    : colors.accent.includes('emerald')
    ? 'bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
    : colors.accent.includes('indigo')
    ? 'bg-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.5)]'
    : colors.accent.includes('rose')
    ? 'bg-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.5)]'
    : 'bg-zinc-100';

  const borderThemeClass = themeMode === 'light' 
    ? 'border-zinc-200 bg-white/60' 
    : 'border-zinc-900/80 bg-zinc-950/40';

  return (
    <section id="about" className="py-28 relative overflow-hidden">
      {/* Decorative side blurs for modern atmosphere */}
      <div className="absolute left-0 top-1/4 w-80 h-80 bg-zinc-900/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute right-0 bottom-1/4 w-96 h-96 bg-zinc-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[90rem] mx-auto px-6 w-full relative z-10">
        
        {/* Section Heading */}
        <div className="flex items-center gap-4 mb-16">
          <span className={`text-sm font-mono tracking-widest uppercase font-bold ${accentTextClass}`}>01 / Journey</span>
          <h2 className={`text-2xl sm:text-4xl font-display font-black tracking-tight ${themeMode === 'light' ? 'text-zinc-900' : 'text-zinc-100'}`}>
            About &amp; Timeline
          </h2>
          <div className="h-px bg-zinc-800/60 flex-1 max-w-[240px]" />
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-16">
          
          {/* Card 1: Biography / Main Narrative (7 cols) */}
          <div className={`lg:col-span-7 flex flex-col justify-between p-6 sm:p-8 rounded-2xl border ${borderThemeClass} backdrop-blur-sm shadow-sm hover:border-zinc-800/80 transition-all duration-300 group`}>
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-zinc-800/40 bg-zinc-900/50`}>
                  <img 
                    src={data.personal.avatar} 
                    alt={data.personal.name} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover grayscale contrast-110 hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <div>
                  <h3 className={`text-base sm:text-lg font-bold tracking-tight ${themeMode === 'light' ? 'text-zinc-900' : 'text-zinc-100'}`}>
                    {data.personal.name}
                  </h3>
                  <p className="text-xs sm:text-sm font-mono text-zinc-500 uppercase tracking-wider">{data.personal.role}</p>
                </div>
              </div>

              <div className={`space-y-4 text-sm sm:text-base leading-relaxed ${themeMode === 'light' ? 'text-zinc-700' : 'text-zinc-300'} font-light`}>
                <p>
                  Hello! I am <span className="text-zinc-100 font-semibold">{data.personal.name}</span>. I design and program high-performance web spaces, crafting elegant user interfaces anchored in scalable, robust systems.
                </p>
                <p>
                  My core design standards center on pristine layout systems, consistent type scales, and delightful client transitions. I code primarily in modern TypeScript frameworks with structured Tailwind utilities, seeking readability, clean modular setups, and zero extra complexity.
                </p>
              </div>
            </div>

            {/* Micro counters in bottom row */}
            <div className="grid grid-cols-3 gap-4 pt-6 mt-6 border-t border-zinc-900/60">
              <div className="text-left">
                <span className="block text-[11px] sm:text-xs font-mono text-zinc-500 uppercase tracking-widest">Active Since</span>
                <span className={`text-base font-bold font-mono ${themeMode === 'light' ? 'text-zinc-800' : 'text-zinc-200'}`}>2020</span>
              </div>
              <div className="text-left">
                <span className="block text-[11px] sm:text-xs font-mono text-zinc-500 uppercase tracking-widest">Focus</span>
                <span className={`text-base font-bold font-mono ${themeMode === 'light' ? 'text-zinc-800' : 'text-zinc-200'}`}>Full-Stack</span>
              </div>
              <div className="text-left">
                <span className="block text-[11px] sm:text-xs font-mono text-zinc-500 uppercase tracking-widest">Environment</span>
                <span className={`text-base font-bold font-mono ${themeMode === 'light' ? 'text-zinc-800' : 'text-zinc-200'}`}>Remote OK</span>
              </div>
            </div>
          </div>

          {/* Card 2: Interactive Personal Stats & Information (5 cols) */}
          <div className={`lg:col-span-5 flex flex-col justify-between p-6 sm:p-8 rounded-2xl border ${borderThemeClass} backdrop-blur-sm shadow-sm hover:border-zinc-800/80 transition-all duration-300`}>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Quick Credentials</span>
                <span className={`w-2 h-2 rounded-full ${dotGlowClass} animate-pulse`} />
              </div>

              {/* Stack of Key-Values with Icons */}
              <div className="space-y-4">
                {/* Location */}
                <div className="flex items-center justify-between py-2 border-b border-zinc-900/60">
                  <span className="text-sm text-zinc-500 flex items-center gap-2 font-mono">
                    <MapPin className="w-3.5 h-3.5 text-zinc-600" /> LOCATION
                  </span>
                  <span className={`text-sm font-semibold ${themeMode === 'light' ? 'text-zinc-800' : 'text-zinc-200'}`}>
                    {data.personal.location}
                  </span>
                </div>

                {/* Email (Interactive Copy) */}
                <div className="flex items-center justify-between py-2 border-b border-zinc-900/60">
                  <span className="text-sm text-zinc-500 flex items-center gap-2 font-mono">
                    <Mail className="w-3.5 h-3.5 text-zinc-600" /> EMAIL
                  </span>
                  <button 
                    onClick={handleCopyEmail}
                    className="text-sm font-semibold hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer relative"
                    title="Copy to clipboard"
                  >
                    <span className={themeMode === 'light' ? 'text-zinc-800' : 'text-zinc-200'}>{data.personal.email}</span>
                    {copied ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3 text-zinc-500" />
                    )}
                  </button>
                </div>

                {/* Phone */}
                {data.personal.phone && (
                  <div className="flex items-center justify-between py-2 border-b border-zinc-900/60">
                    <span className="text-sm text-zinc-500 flex items-center gap-2 font-mono">
                      <Phone className="w-3.5 h-3.5 text-zinc-600" /> CONTACT
                    </span>
                    <a 
                      href={`tel:${data.personal.phone}`}
                      className={`text-sm font-semibold transition-colors hover:underline cursor-pointer ${themeMode === 'light' ? 'text-zinc-800' : 'text-zinc-200'}`}
                    >
                      {data.personal.phone}
                    </a>
                  </div>
                )}

                {/* Code Frameworks */}
                <div className="flex items-center justify-between py-2 border-b border-zinc-900/60">
                  <span className="text-sm text-zinc-500 flex items-center gap-2 font-mono">
                    <Terminal className="w-3.5 h-3.5 text-zinc-600" /> PLATFORM
                  </span>
                  <span className={`text-sm font-semibold ${themeMode === 'light' ? 'text-zinc-800' : 'text-zinc-200'}`}>
                    React / Node
                  </span>
                </div>

                {/* Resume Link */}
                {data.personal.resume && (
                  <div className="flex items-center justify-between py-2 border-b border-zinc-900/60">
                    <span className="text-sm text-zinc-500 flex items-center gap-2 font-mono">
                      <FileText className="w-3.5 h-3.5 text-zinc-600" /> RESUME
                    </span>
                    <a 
                      href={data.personal.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-sm font-semibold transition-colors flex items-center gap-1 cursor-pointer select-none hover:underline text-zinc-200 ${
                        themeMode === 'light' ? 'text-zinc-800 hover:text-zinc-900' : 'text-zinc-200 hover:text-white'
                      }`}
                    >
                      <span>View PDF</span>
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Aesthetic quote / stamp */}
            <div className="pt-6 mt-6 bg-zinc-900/10 rounded-xl p-3 border border-zinc-900/60 text-center">
              <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest block mb-1">DESIGN PHILOSOPHY</span>
              <p className="text-xs italic text-zinc-400 font-sans">
                "Simple architecture handles scale. Clear details declare value."
              </p>
            </div>
          </div>

        </div>

        {/* Dynamic Philosophy Pillars (3 columns) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          {/* Pillar 1 */}
          <div className={`p-5 rounded-xl border ${borderThemeClass} hover:border-zinc-800/80 hover:bg-zinc-900/20 transition-all duration-300 group`}>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-zinc-900/50 border border-zinc-800/40 text-zinc-300 group-hover:text-white transition-colors">
                <Cpu className="w-4 h-4" />
              </div>
              <h4 className={`text-sm font-mono uppercase tracking-wider font-bold ${themeMode === 'light' ? 'text-zinc-800' : 'text-zinc-200'}`}>Performance Core</h4>
            </div>
            <p className="text-sm text-zinc-400 font-sans font-light leading-relaxed">
              Every millisecond counts. Prioritizing optimized code blocks, lazy loading routes, and standard state architectures for hyper-speed runtimes.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className={`p-5 rounded-xl border ${borderThemeClass} hover:border-zinc-800/80 hover:bg-zinc-900/20 transition-all duration-300 group`}>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-zinc-900/50 border border-zinc-800/40 text-zinc-300 group-hover:text-white transition-colors">
                <Layers className="w-4 h-4" />
              </div>
              <h4 className={`text-sm font-mono uppercase tracking-wider font-bold ${themeMode === 'light' ? 'text-zinc-800' : 'text-zinc-200'}`}>Modular Layout</h4>
            </div>
            <p className="text-sm text-zinc-400 font-sans font-light leading-relaxed">
              Clean separation of concerns. Designing component libraries and modular utility functions that scale predictably across any interface.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className={`p-5 rounded-xl border ${borderThemeClass} hover:border-zinc-800/80 hover:bg-zinc-900/20 transition-all duration-300 group`}>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-zinc-900/50 border border-zinc-800/40 text-zinc-300 group-hover:text-white transition-colors">
                <Sparkles className="w-4 h-4" />
              </div>
              <h4 className={`text-sm font-mono uppercase tracking-wider font-bold ${themeMode === 'light' ? 'text-zinc-800' : 'text-zinc-200'}`}>Visual Intent</h4>
            </div>
            <p className="text-sm text-zinc-400 font-sans font-light leading-relaxed">
              Craftsmanship first. Meticulous font selections, generous balance of negative space, and responsive grids designed for fluid devices.
            </p>
          </div>
        </div>

        {/* Experience Chronological Timeline */}
        <div className="space-y-12">
          {/* Timeline header */}
          <div className="flex items-center justify-between border-b border-zinc-900/60 pb-4">
            <h3 className="text-sm font-mono uppercase tracking-widest text-zinc-500 flex items-center gap-2">
              <Briefcase className={`w-3.5 h-3.5 ${accentTextClass}`} />
              Career Timeline
            </h3>
            <span className="text-xs font-mono text-zinc-600 uppercase tracking-widest font-semibold">chronological timeline</span>
          </div>

          {data.experiences.length === 0 ? (
            <p className="text-sm text-zinc-650 italic text-center py-8">No work history registered.</p>
          ) : (
            <div className="relative pl-6 sm:pl-8 border-l border-zinc-900/80 space-y-12 py-2">
              {data.experiences.map((exp, idx) => {
                const bullets = parseDescriptionToBullets(exp.description);
                const initials = exp.company ? exp.company.slice(0, 2).toUpperCase() : 'CO';
                
                return (
                  <motion.div 
                    key={exp.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    className="relative group"
                  >
                    {/* Visual Connector Dot (aligned to left border line) */}
                    <div className="absolute -left-[31px] sm:-left-[39px] top-1 z-10">
                      <div className="relative">
                        {/* Glow halo */}
                        <span className="absolute -inset-1 rounded-full bg-zinc-900/80 group-hover:bg-zinc-850/90 transition-colors" />
                        <span className={`absolute -inset-1 rounded-full ${dotGlowClass} animate-ping opacity-15`} />
                        <span className={`relative block w-3.5 h-3.5 rounded-full border border-zinc-950 ${dotGlowClass}`} />
                      </div>
                    </div>

                    {/* Timeline card container */}
                    <div className={`p-6 rounded-2xl border ${borderThemeClass} backdrop-blur-sm group-hover:border-zinc-850 transition-all duration-300 relative overflow-hidden`}>
                      {/* Subtle hover accent light on card corner */}
                      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-zinc-800/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`} />

                      {/* Header block with metadata */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-900/60 pb-4 mb-4">
                        <div className="flex items-center gap-3">
                          {/* Company stylized Badge */}
                          <div className="w-10 h-10 rounded-xl bg-zinc-900/60 border border-zinc-800/40 flex items-center justify-center font-mono text-sm text-zinc-300 font-bold shrink-0">
                            {initials}
                          </div>
                          <div>
                            <h4 className={`text-base sm:text-lg font-display font-bold tracking-tight ${themeMode === 'light' ? 'text-zinc-900' : 'text-zinc-100'}`}>
                              {exp.role}
                            </h4>
                            <span className={`text-sm font-mono font-medium ${accentTextClass}`}>
                              {exp.company}
                            </span>
                          </div>
                        </div>

                        {/* Date stamp */}
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-900/30 border border-zinc-900 rounded-lg text-xs font-mono text-zinc-400 select-none w-fit self-start sm:self-auto">
                          <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                          {exp.period}
                        </div>
                      </div>

                      {/* Achievements bullets */}
                      <ul className="space-y-3">
                        {bullets.map((bullet, bulletIdx) => (
                          <li key={bulletIdx} className="flex items-start gap-3 text-sm sm:text-base text-zinc-400 font-sans font-light leading-relaxed">
                            <span className={`block w-1.5 h-1.5 rounded-full ${themeMode === 'light' ? 'bg-zinc-400' : 'bg-zinc-700'} shrink-0 mt-2.5`} />
                            <span className={themeMode === 'light' ? 'text-zinc-650' : 'text-zinc-300'}>{bullet}</span>
                          </li>
                        ))}
                      </ul>

                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
