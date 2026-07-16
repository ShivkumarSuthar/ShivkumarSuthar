/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PortfolioData, ThemeColors } from '../types';
import { motion, useMotionValue, useMotionTemplate, animate } from 'motion/react';
import { ArrowDown, Github, Linkedin, Twitter, MapPin, Phone, Terminal, Sparkles, FolderGit2, Calendar, FileText, Atom, FileCode2, Wind, Compass, Boxes, Cpu, Database, Container, Globe, Repeat, Code2, PenTool, ShieldCheck, Workflow, Zap } from 'lucide-react';
import HeroParticles from './HeroParticles';

interface HeroProps {
  data: PortfolioData;
  colors: ThemeColors;
}

export default function Hero({ data, colors }: HeroProps) {
  const [currentTime, setCurrentTime] = useState('');

  const allSkills = data.skills.flatMap(group => group.list);

  const getSkillIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('react')) return <Atom className="w-6 h-6 text-zinc-500 group-hover:text-emerald-400 group-hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.4)] transition-all duration-300" />;
    if (n.includes('typescript') || n.includes('js') || n.includes('javascript')) {
      return <FileCode2 className="w-6 h-6 text-zinc-500 group-hover:text-blue-400 group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.4)] transition-all duration-300" />;
    }
    if (n.includes('tailwind')) return <Wind className="w-6 h-6 text-zinc-500 group-hover:text-cyan-400 group-hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.4)] transition-all duration-300" />;
    if (n.includes('next')) return <Sparkles className="w-6 h-6 text-zinc-500 group-hover:text-white group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] transition-all duration-300" />;
    if (n.includes('motion')) return <Compass className="w-6 h-6 text-zinc-500 group-hover:text-rose-400 group-hover:drop-shadow-[0_0_8px_rgba(244,63,94,0.4)] transition-all duration-300" />;
    if (n.includes('redux') || n.includes('state')) return <Boxes className="w-6 h-6 text-zinc-500 group-hover:text-purple-400 group-hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.4)] transition-all duration-300" />;
    if (n.includes('node')) return <Cpu className="w-6 h-6 text-zinc-500 group-hover:text-green-400 group-hover:drop-shadow-[0_0_8px_rgba(34,197,94,0.4)] transition-all duration-300" />;
    if (n.includes('express')) return <Terminal className="w-6 h-6 text-zinc-500 group-hover:text-amber-400 group-hover:drop-shadow-[0_0_8px_rgba(245,158,11,0.4)] transition-all duration-300" />;
    if (n.includes('graphql')) return <Workflow className="w-6 h-6 text-zinc-500 group-hover:text-pink-400 group-hover:drop-shadow-[0_0_8px_rgba(236,72,153,0.4)] transition-all duration-300" />;
    if (n.includes('postgres') || n.includes('sql') || n.includes('db') || n.includes('database')) {
      return <Database className="w-6 h-6 text-zinc-500 group-hover:text-indigo-400 group-hover:drop-shadow-[0_0_8px_rgba(99,102,241,0.4)] transition-all duration-300" />;
    }
    if (n.includes('docker') || n.includes('container')) return <Container className="w-6 h-6 text-zinc-500 group-hover:text-sky-400 group-hover:drop-shadow-[0_0_8px_rgba(56,189,248,0.4)] transition-all duration-300" />;
    if (n.includes('api') || n.includes('rest') || n.includes('http')) return <Globe className="w-6 h-6 text-zinc-500 group-hover:text-teal-400 group-hover:drop-shadow-[0_0_8px_rgba(20,184,166,0.4)] transition-all duration-300" />;
    if (n.includes('git')) return <Github className="w-6 h-6 text-zinc-500 group-hover:text-neutral-200 group-hover:drop-shadow-[0_0_8px_rgba(244,244,245,0.3)] transition-all duration-300" />;
    if (n.includes('ci/cd') || n.includes('pipeline')) return <Workflow className="w-6 h-6 text-zinc-500 group-hover:text-orange-400 group-hover:drop-shadow-[0_0_8px_rgba(249,115,22,0.4)] transition-all duration-300" />;
    if (n.includes('agile') || n.includes('scrum') || n.includes('method')) return <Repeat className="w-6 h-6 text-zinc-500 group-hover:text-yellow-400 group-hover:drop-shadow-[0_0_8px_rgba(234,179,8,0.4)] transition-all duration-300" />;
    if (n.includes('vite')) return <Zap className="w-6 h-6 text-zinc-500 group-hover:text-amber-400 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(245,158,11,0.4)] transition-all duration-300" />;
    if (n.includes('eslint') || n.includes('lint')) return <ShieldCheck className="w-6 h-6 text-zinc-500 group-hover:text-emerald-400 group-hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.4)] transition-all duration-300" />;
    if (n.includes('figma') || n.includes('design')) return <PenTool className="w-6 h-6 text-zinc-500 group-hover:text-rose-400 group-hover:drop-shadow-[0_0_8px_rgba(244,63,94,0.4)] transition-all duration-300" />;
    
    return <Code2 className="w-6 h-6 text-zinc-500 group-hover:text-white transition-all duration-300" />;
  };

  // Mouse position tracking for background grid spotlight
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const hero = document.getElementById('hero-section');
      if (!hero) return;
      const rect = hero.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseX, mouseY]);

  const getAccentRgb = () => {
    if (colors.accent.includes('amber')) return '245, 158, 11';
    if (colors.accent.includes('emerald')) return '16, 185, 129';
    if (colors.accent.includes('indigo')) return '99, 102, 241';
    if (colors.accent.includes('rose')) return '244, 63, 94';
    return '156, 163, 175'; // fallback gray/slate
  };

  const accentRgb = getAccentRgb();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const targetY = el.getBoundingClientRect().top + window.scrollY;
      const offset = 80;
      const finalY = Math.max(0, targetY - offset);
      
      animate(window.scrollY, finalY, {
        duration: 1.0,
        ease: [0.16, 1, 0.3, 1], // Custom ultra-smooth cubic-bezier (easeOutExpo equivalent)
        onUpdate: (latest) => window.scrollTo(0, latest)
      });
    }
  };

  const cursorBgClass = colors.accent.includes('amber')
    ? 'bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.6)]'
    : colors.accent.includes('emerald')
    ? 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.6)]'
    : colors.accent.includes('indigo')
    ? 'bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.6)]'
    : colors.accent.includes('rose')
    ? 'bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.6)]'
    : 'bg-zinc-100 shadow-[0_0_8px_rgba(244,244,245,0.6)]';

  const sentenceVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.35,
        staggerChildren: 0.05,
      },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 4 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.1, ease: "easeOut" as const }
    },
  };

  const renderTypingSubtitle = (text: string) => {
    const words = text.split(" ");
    return (
      <motion.span
        variants={sentenceVariants}
        initial="hidden"
        animate="visible"
        inherit={false}
        className="inline-flex flex-wrap"
      >
        {words.map((word, wordIdx) => (
          <motion.span key={wordIdx} className="inline-block whitespace-nowrap mr-[0.22em]">
            {word.split("").map((char, charIdx) => (
              <motion.span
                key={charIdx}
                variants={letterVariants}
              >
                {char}
              </motion.span>
            ))}
          </motion.span>
        ))}
        {/* Animated flashing cursor blinking infinitely */}
        <motion.span
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { delay: 0.35 + (text.length * 0.05) }
            }
          }}
          className="inline-block"
        >
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1.0, repeat: Infinity, ease: "easeInOut" }}
            className={`inline-block w-[3px] h-[0.85em] ml-1 align-middle ${cursorBgClass}`}
          />
        </motion.span>
      </motion.span>
    );
  };

  const glowClass = colors.accent.includes('amber')
    ? 'from-amber-500/10 to-transparent shadow-[0_0_50px_rgba(245,158,11,0.05)]'
    : colors.accent.includes('emerald')
    ? 'from-emerald-500/10 to-transparent shadow-[0_0_50px_rgba(16,185,129,0.05)]'
    : colors.accent.includes('indigo')
    ? 'from-indigo-500/10 to-transparent shadow-[0_0_50px_rgba(99,102,241,0.05)]'
    : colors.accent.includes('rose')
    ? 'from-rose-500/10 to-transparent shadow-[0_0_50px_rgba(244,63,94,0.05)]'
    : 'from-zinc-500/10 to-transparent shadow-[0_0_50px_rgba(244,244,245,0.05)]';

  const terminalHeaderColor = colors.accent.includes('amber')
    ? 'border-amber-950/40 bg-amber-950/10'
    : colors.accent.includes('emerald')
    ? 'border-emerald-950/40 bg-emerald-950/10'
    : colors.accent.includes('indigo')
    ? 'border-indigo-950/40 bg-indigo-950/10'
    : colors.accent.includes('rose')
    ? 'border-rose-950/40 bg-rose-950/10'
    : 'border-zinc-800/60 bg-zinc-900/30';

  return (
    <section id="hero-section" className="relative min-h-screen w-full flex flex-col items-center justify-center pt-28 pb-20 overflow-hidden">
      {/* Interactive premium particles */}
      <HeroParticles colors={colors} />

      {/* Premium Dual-Mesh Blueprint Grid Background with dynamic fade and mouse spotlight */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        {/* Deep background ambient wash */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/20 to-zinc-950/40" />

        {/* Major Grid Lines (4rem x 4rem) */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(${accentRgb}, 0.15) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(${accentRgb}, 0.15) 1px, transparent 1px)
            `,
            backgroundSize: '4rem 4rem',
            maskImage: 'radial-gradient(ellipse 65% 55% at 50% 40%, #000 50%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 65% 55% at 50% 40%, #000 50%, transparent 100%)',
          }}
        />

        {/* Minor Micro-Mesh Grid Lines (1rem x 1rem) */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(${accentRgb}, 0.08) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(${accentRgb}, 0.08) 1px, transparent 1px)
            `,
            backgroundSize: '1rem 1rem',
            maskImage: 'radial-gradient(ellipse 55% 45% at 50% 40%, #000 40%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 55% 45% at 50% 40%, #000 40%, transparent 100%)',
          }}
        />

        {/* Interactive Mouse-Tracking Faded Spotlight Layer */}
        <motion.div
          className="absolute inset-0 opacity-30 mix-blend-screen"
          style={{
            background: useMotionTemplate`radial-gradient(350px circle at ${mouseX}px ${mouseY}px, rgba(${accentRgb}, 0.22), transparent 80%)`,
            maskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, #000 60%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, #000 60%, transparent 100%)',
          }}
        />
      </div>

      {/* Decorative colored glow fields */}
      <div className="absolute inset-0 pointer-events-none opacity-25 overflow-hidden">
        <div className={`absolute top-1/4 left-10 w-[35vw] h-[35vw] rounded-full blur-[130px] bg-gradient-to-br ${glowClass}`} />
        <div className={`absolute bottom-10 right-10 w-[30vw] h-[30vw] rounded-full blur-[130px] bg-gradient-to-tr ${glowClass}`} />
      </div>

      <div className="max-w-[90rem] mx-auto px-6 w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Headline and Bio */}
        <div className="lg:col-span-7 flex flex-col space-y-6 text-left">
          {/* Status Badge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex flex-wrap items-center gap-2.5 px-4 py-2 bg-zinc-900/50 backdrop-blur-md border border-zinc-800/80 rounded-2xl w-fit text-sm font-mono select-none"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-zinc-300 font-medium">Available for Hire</span>
            <span className="text-zinc-700">|</span>
            <span className="text-zinc-400 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-zinc-500" />
              {data.personal.location}
            </span>
            {data.personal.phone && (
              <>
                <span className="text-zinc-700">|</span>
                <a 
                  href={`tel:${data.personal.phone}`} 
                  className="text-zinc-400 hover:text-zinc-200 transition-all flex items-center gap-1 select-none cursor-pointer group/tel"
                >
                  <Phone className="w-3.5 h-3.5 text-zinc-500 group-hover/tel:text-zinc-300" />
                  {data.personal.phone}
                </a>
              </>
            )}
          </motion.div>

          {/* Core Name & Title display */}
          <div className="space-y-3">
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={`text-sm sm:text-base font-mono tracking-widest uppercase font-semibold ${colors.accent}`}
            >
              System.init // Creator Profile
            </motion.h2>

            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-4xl sm:text-6xl md:text-[5.5rem] font-display font-black text-zinc-100 tracking-tight leading-[0.95]"
            >
              {data.personal.name}
            </motion.h1>

            <motion.div 
              key={data.personal.role}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-2xl sm:text-4xl md:text-5xl font-display font-semibold text-zinc-450 tracking-tight leading-[1.1] flex flex-wrap items-center"
            >
              {renderTypingSubtitle(data.personal.role)}
            </motion.div>
          </div>

          {/* Bio text */}
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-base sm:text-lg text-zinc-400 max-w-xl leading-relaxed font-sans font-light"
          >
            {data.personal.bio}
          </motion.p>

          {/* CTA Row */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-4 pt-4"
          >
            <button
              onClick={() => handleScrollTo('projects')}
              className={`px-7 py-3.5 rounded-xl text-sm font-mono tracking-wider uppercase font-bold transition-all duration-300 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg cursor-pointer select-none ${colors.primary} ${colors.primaryHover}`}
            >
              Explore Projects
            </button>
            
            <button
              onClick={() => handleScrollTo('contact')}
              className="px-7 py-3.5 rounded-xl text-sm font-mono tracking-wider uppercase font-bold bg-zinc-900/60 hover:bg-zinc-850/80 text-zinc-300 hover:text-white border border-zinc-800/80 hover:border-zinc-700/85 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer select-none"
            >
              Let's Connect
            </button>

            {data.personal.resume && (
              <a
                href={data.personal.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="px-7 py-3.5 rounded-xl text-sm font-mono tracking-wider uppercase font-bold bg-zinc-950/30 hover:bg-zinc-900/50 text-zinc-400 hover:text-white border border-zinc-900/60 hover:border-zinc-800/80 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer select-none flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Resume
              </a>
            )}
          </motion.div>

          {/* Quick Socials */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex items-center gap-5 pt-8 text-zinc-500"
          >
            {data.personal.github && (
              <a 
                href={data.personal.github} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-zinc-200 transition-all transform hover:scale-110 p-1 cursor-pointer select-none"
              >
                <Github className="w-5.5 h-5.5" />
              </a>
            )}
            {data.personal.linkedin && (
              <a 
                href={data.personal.linkedin} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-zinc-200 transition-all transform hover:scale-110 p-1 cursor-pointer select-none"
              >
                <Linkedin className="w-5.5 h-5.5" />
              </a>
            )}
            {data.personal.twitter && (
              <a 
                href={data.personal.twitter} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-zinc-200 transition-all transform hover:scale-110 p-1 cursor-pointer select-none"
              >
                <Twitter className="w-5.5 h-5.5" />
              </a>
            )}
            <div className="h-px w-10 bg-zinc-800/80" />
            <span className="text-xs font-mono tracking-widest uppercase text-zinc-500 font-semibold select-none">PERSISTENT STREAM</span>
          </motion.div>
        </div>

        {/* Right Column: Premium Interactive Terminal Card */}
        <motion.div 
          initial={{ opacity: 0, x: 30, scale: 0.98 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ type: "spring", damping: 25, stiffness: 100, delay: 0.2 }}
          className="lg:col-span-5 relative w-full group/terminal"
        >
          {/* Card Border glow shadow */}
          <div className={`absolute -inset-0.5 rounded-2xl bg-gradient-to-tr ${glowClass} opacity-30 group-hover/terminal:opacity-50 blur-xl transition-opacity duration-500 pointer-events-none`} />

          {/* Terminal Box */}
          <div className="relative bg-zinc-950/80 backdrop-blur-xl border border-zinc-900 rounded-2xl overflow-hidden shadow-[0_12px_40px_rgb(0,0,0,0.6)]">
            {/* Terminal Header Bar */}
            <div className={`flex items-center justify-between px-4 py-3 border-b ${terminalHeaderColor} transition-colors duration-300`}>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-[10px] font-mono text-zinc-500 tracking-wider font-semibold select-none flex items-center gap-1.5">
                <Terminal className="w-3 h-3" /> profile.sh
              </span>
              <div className="w-8" />
            </div>

            {/* Terminal Content Panel */}
            <div className="p-5 font-mono text-xs text-zinc-400 space-y-4">
              <div className="space-y-1">
                <p className="text-zinc-500"># Query database schemas</p>
                <p className="text-zinc-300">
                  <span className={`${colors.accent}`}>$</span> curl -s https://api.carter.dev/core
                </p>
              </div>

              <div className="space-y-2 py-2 px-3.5 bg-zinc-900/40 rounded-xl border border-zinc-900/60 text-[11px] leading-relaxed">
                <div>
                  <span className="text-purple-400 font-semibold">"identity"</span>: &#123;
                  <div className="pl-4">
                    <span className="text-zinc-400">"alias":</span> <span className={`${colors.accent}`}>"{data.personal.name.toLowerCase().replace(/\s+/g, '')}"</span>,
                    <br />
                    <span className="text-zinc-400">"status":</span> <span className="text-emerald-400">"active"</span>,
                    <br />
                    <span className="text-zinc-400">"session":</span> <span className="text-amber-400">"authorized"</span>
                  </div>
                  &#125;
                </div>
                <div>
                  <span className="text-purple-400 font-semibold">"metrics"</span>: &#123;
                  <div className="pl-4">
                    <span className="text-zinc-400">"repos":</span> <span className="text-indigo-400">{data.projects.length} loaded</span>,
                    <br />
                    <span className="text-zinc-400">"skills":</span> <span className="text-indigo-400">{data.skills.reduce((acc, curr) => acc + curr.list.length, 0)} registered</span>
                  </div>
                  &#125;
                </div>
              </div>

              {/* Dynamic stats widget */}
              <div className="space-y-1.5 pt-1 text-[11px]">
                <div className="flex items-center justify-between text-zinc-500">
                  <span>HOST_STATE:</span>
                  <span className="text-emerald-400 font-bold animate-pulse">● ONLINE</span>
                </div>
                <div className="flex items-center justify-between text-zinc-500">
                  <span>ENVIRONMENT:</span>
                  <span className="text-zinc-300">PRODUCTION</span>
                </div>
                <div className="flex items-center justify-between text-zinc-500">
                  <span>LOCAL_TIME:</span>
                  <span className="text-zinc-300 font-semibold">{currentTime || '--:--:--'}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-900/60 flex items-center justify-between text-[10px] text-zinc-500 font-semibold">
                <span className="flex items-center gap-1">
                  <Sparkles className={`w-3 h-3 ${colors.accent}`} /> Interactive Widget
                </span>
                <span>SECURE ENV</span>
              </div>
            </div>
          </div>
        </motion.div>

      </div>

      {/* Elegant Infinite Marquee Slider with Skill Icons */}
      <div className="w-full relative z-20 py-6 mt-16 mb-20 border-t border-b border-zinc-900/20 bg-zinc-950/10 backdrop-blur-[1px] overflow-hidden select-none">
        {/* Smooth fade gradients on edges */}
        <div className="absolute left-0 top-0 z-10 h-full w-24 sm:w-40 bg-gradient-to-r from-[#050507] via-[#050507]/90 to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 z-10 h-full w-24 sm:w-40 bg-gradient-to-l from-[#050507] via-[#050507]/90 to-transparent pointer-events-none" />

        <div className="relative flex overflow-hidden w-full">
          <div className="animate-marquee flex gap-8 sm:gap-14 min-w-full shrink-0 items-center justify-around">
            {Array.from({ length: 4 }).flatMap((_, i) => 
              allSkills.map((skill, idx) => (
                <div 
                  key={`hero-marquee-skill-${idx}-${i}`}
                  className="flex items-center justify-center text-zinc-500 hover:text-zinc-200 transition-all duration-300 group shrink-0 py-1"
                  title={skill}
                >
                  <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-900/60 group-hover:border-zinc-850 group-hover:bg-zinc-900/40 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.02)] transition-all duration-300 flex items-center justify-center">
                    {getSkillIcon(skill)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Down indicator */}
      <motion.button 
        onClick={() => handleScrollTo('about')}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 6, 0] }}
        transition={{ 
          opacity: { duration: 0.6, delay: 0.8 },
          y: { repeat: Infinity, duration: 2, ease: "easeInOut" }
        }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-zinc-500 hover:text-zinc-100 cursor-pointer select-none transition-colors focus:outline-none z-20 group"
        id="scroll-down-btn"
      >
        <span className="text-[10px] font-mono tracking-widest uppercase font-semibold">SCROLL</span>
        <ArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
      </motion.button>
    </section>
  );
}
