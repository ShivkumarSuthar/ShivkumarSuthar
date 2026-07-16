/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PortfolioData, ThemeColors } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Layout, 
  Server, 
  Sliders, 
  Terminal, 
  Layers, 
  Database, 
  Sparkles,
  Zap, 
  Compass, 
  Cpu, 
  ShieldCheck, 
  Check,
  Atom,
  FileCode2,
  Wind,
  Flame,
  Code2,
  Container,
  Github,
  Globe,
  Repeat,
  Boxes,
  Settings,
  Workflow,
  FileJson,
  PenTool
} from 'lucide-react';

interface SkillsProps {
  data: PortfolioData;
  colors: ThemeColors;
}

export default function Skills({ data, colors }: SkillsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  // Derive unique categories dynamically
  const categories = ['All', ...data.skills.map(s => s.category)];

  // Flatten all skills to display in the beautiful horizontal infinite marquee
  const allSkills = data.skills.flatMap(group => group.list);

  // Dynamic high-end tech icon mapping helper
  const getSkillIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('react')) return <Atom className="w-4 h-4 text-emerald-400" />;
    if (n.includes('typescript') || n.includes('js') || n.includes('javascript')) {
      return <FileCode2 className="w-4 h-4 text-indigo-400" />;
    }
    if (n.includes('tailwind')) return <Wind className="w-4 h-4 text-cyan-400" />;
    if (n.includes('next')) return <Sparkles className="w-4 h-4 text-zinc-300" />;
    if (n.includes('motion')) return <Compass className="w-4 h-4 text-rose-400" />;
    if (n.includes('redux') || n.includes('state')) return <Boxes className="w-4 h-4 text-purple-400" />;
    if (n.includes('node')) return <Cpu className="w-4 h-4 text-green-400" />;
    if (n.includes('express')) return <Terminal className="w-4 h-4 text-amber-400" />;
    if (n.includes('graphql')) return <Workflow className="w-4 h-4 text-pink-400" />;
    if (n.includes('postgres') || n.includes('sql') || n.includes('db') || n.includes('database')) {
      return <Database className="w-4 h-4 text-blue-400" />;
    }
    if (n.includes('docker') || n.includes('container')) return <Container className="w-4 h-4 text-sky-400" />;
    if (n.includes('api') || n.includes('rest') || n.includes('http')) return <Globe className="w-4 h-4 text-teal-400" />;
    if (n.includes('git')) return <Github className="w-4 h-4 text-neutral-300" />;
    if (n.includes('ci/cd') || n.includes('pipeline')) return <Workflow className="w-4 h-4 text-orange-400" />;
    if (n.includes('agile') || n.includes('scrum') || n.includes('method')) return <Repeat className="w-4 h-4 text-yellow-400" />;
    if (n.includes('vite')) return <Zap className="w-4 h-4 text-amber-400 animate-pulse" />;
    if (n.includes('eslint') || n.includes('lint')) return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
    if (n.includes('figma') || n.includes('design')) return <PenTool className="w-4 h-4 text-rose-400" />;
    
    // Fallbacks
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    if (hash % 3 === 0) return <Code2 className="w-4 h-4 text-neutral-400" />;
    if (hash % 3 === 1) return <Terminal className="w-4 h-4 text-neutral-400" />;
    return <Sliders className="w-4 h-4 text-neutral-400" />;
  };

  const getCategoryIcon = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('front') || cat.includes('ui') || cat.includes('design')) {
      return <Layout className="w-4 h-4" />;
    }
    if (cat.includes('back') || cat.includes('server') || cat.includes('database')) {
      return <Server className="w-4 h-4" />;
    }
    return <Sliders className="w-4 h-4" />;
  };

  const getCategoryDescription = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('front') || cat.includes('ui') || cat.includes('design')) {
      return "Engineering low-fidelity and high-fidelity responsive client-side architectures optimized for smooth fluid motion, 60fps scrolling, and elegant design systems.";
    }
    if (cat.includes('back') || cat.includes('server') || cat.includes('database')) {
      return "Architecting high-concurrency server environments, resilient cache layers, distributed databases, and security-hardened secure data schemas.";
    }
    return "Streamlining compilation pipelines, hot-reloading loops, modular dependency configs, container virtualization, and modern automated continuous integration.";
  };

  // Maps index to professional technical stats
  const getCategoryStats = (idx: number) => {
    const stats = [
      { 
        label: "CORE INTERFACES", 
        role: "UI ARCHITECT", 
        metric: "14ms Paint Latency",
        icon: <Cpu className="w-3 h-3 text-neutral-500" />
      },
      { 
        label: "RESIENT RUNTIMES", 
        role: "SYSTEMS LEAD", 
        metric: "80ms Edge Response",
        icon: <Zap className="w-3 h-3 text-neutral-500" />
      },
      { 
        label: "COMPILATION pipelines", 
        role: "DEVOPS SPECIALIST", 
        metric: "99.9% Success Rate",
        icon: <ShieldCheck className="w-3 h-3 text-neutral-500" />
      }
    ];
    return stats[idx % stats.length];
  };

  // Helper theme classes mapping
  const getThemeClasses = (colors: ThemeColors) => {
    const isAmber = colors.accent.includes('amber');
    const isEmerald = colors.accent.includes('emerald');
    const isIndigo = colors.accent.includes('indigo');
    const isRose = colors.accent.includes('rose');

    return {
      borderHover: isAmber ? 'group-hover:border-amber-500/25'
                 : isEmerald ? 'group-hover:border-emerald-500/25'
                 : isIndigo ? 'group-hover:border-indigo-500/25'
                 : isRose ? 'group-hover:border-rose-500/25'
                 : 'group-hover:border-zinc-500/25',
      glow: isAmber ? 'group-hover:shadow-[0_0_40px_rgba(245,158,11,0.04)]'
          : isEmerald ? 'group-hover:shadow-[0_0_40px_rgba(16,185,129,0.04)]'
          : isIndigo ? 'group-hover:shadow-[0_0_40px_rgba(99,102,241,0.04)]'
          : isRose ? 'group-hover:shadow-[0_0_40px_rgba(244,63,94,0.04)]'
          : 'group-hover:shadow-[0_0_40px_rgba(244,244,245,0.04)]',
      accentText: colors.accent,
      pillHover: isAmber ? 'hover:border-amber-500/30 hover:text-amber-300 hover:bg-amber-500/5'
               : isEmerald ? 'hover:border-emerald-500/30 hover:text-emerald-300 hover:bg-emerald-500/5'
               : isIndigo ? 'hover:border-indigo-500/30 hover:text-indigo-300 hover:bg-indigo-500/5'
               : isRose ? 'hover:border-rose-500/30 hover:text-rose-300 hover:bg-rose-500/5'
               : 'hover:border-zinc-300/30 hover:text-zinc-100 hover:bg-white/5',
      pillDot: isAmber ? 'bg-amber-500'
             : isEmerald ? 'bg-emerald-500'
             : isIndigo ? 'bg-indigo-500'
             : isRose ? 'bg-rose-500'
             : 'bg-zinc-400'
    };
  };

  const themeClasses = getThemeClasses(colors);
  const totalSkillsCount = data.skills.reduce((acc, curr) => acc + curr.list.length, 0);

  // Filter skills according to selected category
  const filteredSkills = selectedCategory === 'All'
    ? data.skills
    : data.skills.filter(s => s.category === selectedCategory);

  return (
    <section id="skills" className="py-24 sm:py-32 relative overflow-hidden bg-black/10">
      {/* Mesh background grid overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff02_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      
      {/* Background ambient light flare */}
      <div className="absolute right-[-10%] top-1/4 w-[500px] h-[500px] bg-neutral-900/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute left-[-5%] bottom-1/4 w-[400px] h-[400px] bg-neutral-900/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[90rem] mx-auto px-6 relative z-10">
        
        {/* Custom Header Layout */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="space-y-4 max-w-lg">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-mono tracking-[0.25em] uppercase font-bold px-2 py-0.5 rounded border border-neutral-800 bg-neutral-900/60 ${themeClasses.accentText}`}>
                03 / ENGINE STACK
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-light text-white tracking-tight uppercase">
              Technical <span className="font-bold">Matrix</span>
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base font-light leading-relaxed">
              A comprehensive directory of engineering competencies, structural methodologies, and operational runtime architectures refined over years of shipping products.
            </p>
          </div>

          {/* Quick Stats Panel */}
          <div className="flex items-center gap-6 font-mono text-xs text-neutral-500 border-t md:border-t-0 md:border-l border-neutral-900 pt-4 md:pt-0 md:pl-6">
            <div>
              <span className="block text-neutral-600">TOTAL DIRECTORIES</span>
              <span className="text-white font-bold text-base">{data.skills.length} Categories</span>
            </div>
            <div>
              <span className="block text-neutral-600">REGISTERED MODULES</span>
              <span className="text-white font-bold text-base">{totalSkillsCount} Engines</span>
            </div>
          </div>
        </div>



        {/* Dynamic Category Filtering Tabs */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-neutral-950/40 rounded-xl border border-neutral-900/60 max-w-2xl mb-12 backdrop-blur-md">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`relative px-4 py-2 rounded-lg text-sm font-mono tracking-wider transition-colors duration-300 uppercase select-none cursor-pointer flex items-center gap-2 ${
                  isActive ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeCategoryIndicator"
                    className="absolute inset-0 bg-neutral-900 rounded-lg border border-neutral-800"
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  {cat !== 'All' && getCategoryIcon(cat)}
                  {cat}
                </span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Categorized Bento Matrix */}
        {filteredSkills.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-neutral-900 rounded-3xl bg-neutral-950/10">
            <p className="text-sm font-mono text-neutral-500 uppercase tracking-widest">
              No competence indices registered
            </p>
          </div>
        ) : (
          <motion.div 
            layout="position"
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch"
          >
            <AnimatePresence mode="popLayout">
              {filteredSkills.map((skillGroup, idx) => {
                const categoryStat = getCategoryStats(idx);
                const description = getCategoryDescription(skillGroup.category);

                return (
                  <motion.div
                    key={skillGroup.category}
                    layout
                    initial={{ opacity: 0, scale: 0.98, y: 25 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 15 }}
                    transition={{ 
                      duration: 0.45, 
                      ease: [0.16, 1, 0.3, 1] 
                    }}
                    className={`group relative p-6 sm:p-8 rounded-2xl border border-neutral-900 bg-neutral-950/40 backdrop-blur-md flex flex-col justify-between transition-all duration-500 hover:bg-neutral-950/60 overflow-hidden ${themeClasses.borderHover} ${themeClasses.glow}`}
                  >
                    {/* Micro dot matrix card backdrop */}
                    <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Floating ambient subtle colored glow inside the card corner */}
                    <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-neutral-900/5 group-hover:bg-neutral-900/10 rounded-full blur-3xl pointer-events-none transition-all duration-500" />

                    <div className="space-y-6 relative z-10">
                      {/* Category Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-neutral-950 flex items-center justify-center border border-neutral-900 shadow-inner group-hover:border-neutral-800 transition-all duration-500">
                            <span className={`${themeClasses.accentText} transition-transform duration-500 group-hover:scale-110`}>
                              {getCategoryIcon(skillGroup.category)}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-base font-mono font-bold text-neutral-100 tracking-wider uppercase group-hover:text-white transition-colors">
                              {skillGroup.category}
                            </h3>
                            <span className="text-xs font-mono text-neutral-500 uppercase tracking-[0.15em]">
                              {categoryStat.label}
                            </span>
                          </div>
                        </div>

                        {/* Top Badge: Role */}
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-neutral-950 border border-neutral-900/60 font-mono text-xs tracking-wider text-neutral-400">
                          {categoryStat.icon}
                          <span className="font-bold">{categoryStat.role}</span>
                        </div>
                      </div>

                      {/* Professional Narrative description of competency */}
                      <p className="text-neutral-400 font-sans font-light text-sm sm:text-base leading-relaxed">
                        {description}
                      </p>
                    </div>

                    {/* Tag Cloud of individual skills */}
                    <div className="pt-8 relative z-10">
                      <div className="flex flex-wrap gap-2.5">
                        {skillGroup.list.map((skill, skillIdx) => {
                          const isHovered = hoveredSkill === skill;
                          return (
                            <motion.div
                              key={skillIdx}
                              onMouseEnter={() => setHoveredSkill(skill)}
                              onMouseLeave={() => setHoveredSkill(null)}
                              whileHover={{ y: -1 }}
                              className={`relative inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-950/80 text-sm text-neutral-400 font-sans border border-neutral-900 hover:bg-neutral-950 hover:shadow-lg ${themeClasses.pillHover} transition-all duration-300 select-none cursor-default`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${themeClasses.pillDot} opacity-40 group-hover:opacity-80 transition-all`} />
                              <span className="font-mono text-xs tracking-wide">{skill}</span>

                              {/* Interactive hovering tooltip explaining where it's used */}
                              <AnimatePresence>
                                {isHovered && (
                                  <motion.span
                                    initial={{ opacity: 0, scale: 0.9, y: 5 }}
                                    animate={{ opacity: 1, scale: 1, y: -26 }}
                                    exit={{ opacity: 0, scale: 0.9, y: 5 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute left-1/2 -translate-x-1/2 bg-neutral-950 border border-neutral-800 text-[9px] font-mono text-neutral-300 px-2 py-0.5 rounded shadow-xl whitespace-nowrap pointer-events-none tracking-widest uppercase z-30"
                                  >
                                    Applied on Core Projects
                                  </motion.span>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Technical details bottom trim footer */}
                    <div className="mt-6 pt-4 border-t border-neutral-900/60 flex justify-between items-center text-xs font-mono text-neutral-600 uppercase tracking-widest relative z-10">
                      <span>ENGINE INSTANCE - DEV{idx}</span>
                      <span className="text-neutral-500 font-bold">{categoryStat.metric}</span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

      </div>
    </section>
  );
}


