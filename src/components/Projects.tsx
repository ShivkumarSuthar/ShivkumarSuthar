/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { PortfolioData, ThemeColors, Project } from '../types';
import { motion, AnimatePresence, useScroll, useMotionValueEvent, useSpring, useTransform, useMotionValue } from 'motion/react';

interface ProjectsProps {
  data: PortfolioData;
  colors: ThemeColors;
}

export default function Projects({ data, colors }: ProjectsProps) {
  const projectsList = data?.projects || [];
  const totalProjects = projectsList.length;

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Inertial spring smooths out physical scroll inputs beautifully
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 45,
    damping: 18,
    mass: 0.15
  });

  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [scrollPercentage, setScrollPercentage] = useState(0);

  useMotionValueEvent(smoothProgress, "change", (latest) => {
    const percentage = Math.min(100, Math.max(0, Math.round(latest * 100)));
    setScrollPercentage(percentage);
    
    const activeIdx = Math.min(
      totalProjects - 1,
      Math.max(0, Math.floor(latest * totalProjects))
    );
    setActiveProjectIndex(activeIdx);
  });

  if (totalProjects === 0) {
    return (
      <section id="projects" className="relative w-full py-32 bg-neutral-950 flex items-center justify-center text-neutral-400">
        <p className="font-mono text-xs uppercase tracking-widest">No Projects Configured</p>
      </section>
    );
  }

  const getProgressBarBgClass = (accentClass: string) => {
    if (accentClass.includes("amber")) return "bg-amber-500";
    if (accentClass.includes("emerald")) return "bg-emerald-500";
    if (accentClass.includes("indigo")) return "bg-indigo-500";
    if (accentClass.includes("rose")) return "bg-rose-500";
    if (accentClass.includes("zinc")) {
      return accentClass.includes("800") ? "bg-zinc-800" : "bg-zinc-200";
    }
    return "bg-zinc-400";
  };

  return (
    <section 
      ref={containerRef} 
      id="projects" 
      className="relative w-full"
      style={{ height: `${totalProjects * 150}vh` }} // Pinned scroll track height
    >
      {/* Sticky Top viewport container */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden select-none z-10 relative">
        {/* Stationary ambient subtle grid accent */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <div 
            className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-[size:5rem_5rem] opacity-30"
            style={{
              maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, #000 60%, transparent 100%)',
              WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, #000 60%, transparent 100%)'
            }}
          />
        </div>

        {projectsList.map((project, idx) => (
          <ProjectStory 
            key={project.id || idx}
            project={project}
            index={idx}
            total={totalProjects}
            progress={smoothProgress}
            colors={colors}
          />
        ))}

        {/* Cinematic Progress Reader (Sticky at the bottom of viewport) */}
        <div className="absolute bottom-4 sm:bottom-10 left-4 sm:left-8 right-4 sm:right-8 z-30 pointer-events-none flex flex-col gap-1.5 sm:gap-2.5 max-w-5xl mx-auto">
          {/* Top details bar */}
          <div className={`flex justify-between items-end font-mono text-[8px] sm:text-[9px] tracking-widest ${colors.text}`}>
            <div className="flex items-center gap-1.5 sm:gap-3">
              <span className={`font-bold opacity-80 uppercase ${colors.accent}`}>
                <span className="hidden sm:inline">PROJECT </span>PROGRESSION
              </span>
              <span className="opacity-35">//</span>
              <span className="opacity-70 uppercase font-medium">UNIT: 0{activeProjectIndex + 1}</span>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Project Dots to show steps */}
              <div className="flex gap-1.5 sm:gap-2 items-center">
                {projectsList.map((_, idx) => (
                  <div 
                    key={idx}
                    className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full transition-all duration-300 ${
                      idx === activeProjectIndex 
                        ? "scale-125 bg-zinc-950 dark:bg-zinc-50 shadow-[0_0_8px_rgba(255,255,255,0.4)]" 
                        : idx < activeProjectIndex 
                          ? "bg-zinc-500 dark:bg-zinc-400 opacity-60" 
                          : "bg-zinc-300 dark:bg-zinc-800 opacity-35"
                    }`}
                  />
                ))}
              </div>
              <span className="opacity-35 text-[7px] sm:text-[9px]">|</span>
              <span className={`font-mono font-bold min-w-[28px] sm:min-w-[35px] text-right ${colors.accent}`}>{scrollPercentage}%</span>
            </div>
          </div>

          {/* Dynamic Horizontal Progress Bar Track */}
          <div className="w-full h-[2px] bg-zinc-200/20 dark:bg-zinc-800/20 relative rounded-full overflow-hidden">
            <motion.div 
              className={`absolute top-0 bottom-0 left-0 rounded-full ${getProgressBarBgClass(colors.accent)}`}
              style={{ 
                width: useTransform(smoothProgress, [0, 1], ["0%", "100%"]),
              }} 
            />
          </div>
        </div>
      </div>
    </section>
  );
}

interface MagneticCardProps {
  children: React.ReactNode;
  index: number;
  type: 'web' | 'mobile';
}

function MagneticCard({ children, index, type }: MagneticCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 180 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    
    // Slight magnetic shift: 12px for web and 8px for mobile
    const maxShift = type === 'web' ? 12 : 8;
    const targetX = (mouseX / (width / 2)) * maxShift;
    const targetY = (mouseY / (height / 2)) * maxShift;

    x.set(targetX);
    y.set(targetY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  // Soft custom neon-style glow shadow corresponding to project themes
  const glowColor = index === 0 ? "rgba(16, 185, 129, 0.45)"   // Emerald
                 : index === 1 ? "rgba(99, 102, 241, 0.45)"   // Indigo
                 : index === 2 ? "rgba(6, 182, 212, 0.45)"    // Cyan
                 : index === 3 ? "rgba(244, 63, 94, 0.45)"    // Rose/pink
                 : "rgba(245, 158, 11, 0.45)";               // Amber/yellow

  const roundedClass = type === 'web' ? 'rounded-lg' : 'rounded-[1.6rem]';

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        x: springX,
        y: springY,
      }}
      animate={{
        scale: isHovered ? 1.02 : 1,
        boxShadow: isHovered 
          ? `0 25px 60px rgba(0, 0, 0, 0.45), 0 0 30px ${glowColor}`
          : type === 'web'
            ? `0 20px 45px rgba(0, 0, 0, 0.25)`
            : `0 20px 40px rgba(0, 0, 0, 0.45)`,
      }}
      transition={{
        type: "spring",
        stiffness: 250,
        damping: 20,
        boxShadow: { duration: 0.3 }
      }}
      className={`w-full h-full ${roundedClass} cursor-pointer`}
    >
      {children}
    </motion.div>
  );
}

interface ProjectStoryProps {
  key?: React.Key;
  project: Project;
  index: number;
  total: number;
  progress: any;
  colors: ThemeColors;
}

function ProjectStory({ project, index, total, progress, colors }: ProjectStoryProps) {
  const [isMobile, setIsMobile] = useState(false);
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const span = 1 / total;
  const start = index / total;
  const end = (index + 1) / total;

  // Key landmarks for this project
  const p1 = start;                        // entry begins
  const p2 = start + span * 0.25;          // backdrop and title fully in
  const p3 = start + span * 0.50;          // devices fully settled in
  const p4 = start + span * 0.85;          // narrative columns fully settled / holding plateau
  const p5 = end;                          // exit completely

  // Overall container states
  const storyOpacity = useTransform(progress, [p1 - span * 0.05, p1, p4, p5 + span * 0.05], [0, 1, 1, 0]);
  const pointerEvents = useTransform(storyOpacity, (o) => o > 0.1 ? "auto" as const : "none" as const);
  const displayStyle = useTransform(storyOpacity, (o) => o > 0.001 ? "flex" as const : "none" as const);

  // Responsive motion ranges for narrative elements
  const titleRange = isMobile 
    ? {
        opacity: [p1, p1 + span * 0.15, p4 + span * 0.05, p5],
        y: [20, 0, 0, -20]
      }
    : {
        opacity: [p1, p2, p4, p5],
        y: [30, 0, 0, -30]
      };

  const metaRange = isMobile
    ? {
        opacity: [p1 + span * 0.05, p1 + span * 0.20, p4 + span * 0.05, p5],
        y: [15, 0, 0, -15]
      }
    : {
        opacity: [p2, p2 + span * 0.15, p4, p4 + span * 0.05],
        y: [20, 0, 0, -20]
      };

  const storyRange = isMobile
    ? {
        opacity: [p1 + span * 0.10, p1 + span * 0.25, p4 + span * 0.05, p5],
        y: [15, 0, 0, -15]
      }
    : {
        opacity: [p2 + span * 0.08, p2 + span * 0.25, p4, p4 + span * 0.05],
        y: [20, 0, 0, -20]
      };

  const techRange = isMobile
    ? {
        opacity: [p1 + span * 0.15, p1 + span * 0.30, p4 + span * 0.05, p5],
        y: [15, 0, 0, -15]
      }
    : {
        opacity: [p2 + span * 0.16, p2 + span * 0.32, p4, p4 + span * 0.05],
        y: [20, 0, 0, -20]
      };

  // 1. Title animations
  const titleOpacity = useTransform(progress, titleRange.opacity, [0, 1, 1, 0]);
  const titleY = useTransform(progress, titleRange.opacity, titleRange.y);

  // 2. Volume magazine indicator opacity
  const headerOpacity = useTransform(progress, [p1, p2, p4, p5], [0, 1, 1, 0]);

  // 3. 50/50 Split Background elements
  // Left half is premium deep slate, slides in from far left
  const leftHalfX = useTransform(progress, [p1, p2, p4, p5], ["-100%", "0%", "0%", "-100%"]);
  // Right half is deep pitch black, slides in from far right
  const rightHalfX = useTransform(progress, [p1, p2, p4, p5], ["100%", "0%", "0%", "100%"]);
  
  // Central white hairline grows from center and divides left & right
  const hairlineScaleY = useTransform(progress, [p1 + span * 0.05, p2, p4, p5 - span * 0.05], [0, 1, 1, 0]);
  const hairlineOpacity = useTransform(progress, [p1 + span * 0.05, p2, p4, p5 - span * 0.05], [0, 0.12, 0.12, 0]);

  // Ambient radial glow that tracks scroll
  const glowOpacity = useTransform(progress, [p1, p2, p4, p5], [0, 0.3, 0.3, 0]);
  const glowScale = useTransform(progress, [p1, p2, p4, p5], [0.7, 1, 1, 0.7]);

  // 4. Staggered Web & Mobile Mockups assembly
  // Smooth percentage-based translations that align web (left) and mobile (right) beautifully
  // We stagger the entries: web mockup (dev0) enters first, mobile mockup (dev1) enters second
  const dev0X = useTransform(
    progress, 
    [p1, p1 + span * 0.30, p4 + span * 0.05, p5], 
    isMobile ? ["-15%", "0%", "0%", "-15%"] : ["-45%", "0%", "0%", "-45%"]
  );
  const dev1X = useTransform(
    progress, 
    [p1 + span * 0.15, p3, p4, p5 - span * 0.05], 
    isMobile ? ["15%", "0%", "0%", "15%"] : ["45%", "0%", "0%", "45%"]
  );

  // Coordinated vertical slide-ins/slide-outs for an organic, floating visual feel
  const dev0Y = useTransform(
    progress, 
    [p1, p1 + span * 0.30, p4 + span * 0.05, p5], 
    isMobile ? [20, 0, 0, -20] : [35, 0, 0, -35]
  );
  const dev1Y = useTransform(
    progress, 
    [p1 + span * 0.15, p3, p4, p5 - span * 0.05], 
    isMobile ? [20, 0, 0, -20] : [35, 0, 0, -35]
  );

  const dev0Rot = useTransform(
    progress, 
    [p1, p1 + span * 0.30, p4 + span * 0.05, p5], 
    isMobile ? [-2, 0, 0, -2] : [-4, 0, 0, -4]
  );
  const dev1Rot = useTransform(
    progress, 
    [p1 + span * 0.15, p3, p4, p5 - span * 0.05], 
    isMobile ? [2, 0, 0, 2] : [4, 0, 0, 4]
  );

  const dev0Opacity = useTransform(progress, [p1, p1 + span * 0.15, p4 + span * 0.10, p5], [0, 1, 1, 0]);
  const dev1Opacity = useTransform(progress, [p1 + span * 0.15, p1 + span * 0.35, p4, p4 + span * 0.15], [0, 1, 1, 0]);

  const devicesOpacity = useTransform(progress, [p1 + span * 0.05, p3, p4, p5 - span * 0.05], [0, 1, 1, 0]);

  // 5. Sequential narrative text fades as user scrolls
  // Column 1 (Metadata details)
  const metaOpacity = useTransform(progress, metaRange.opacity, [0, 1, 1, 0]);
  const metaY = useTransform(progress, metaRange.opacity, metaRange.y);

  // Column 2 (Story Paragraph)
  const storyOpacityText = useTransform(progress, storyRange.opacity, [0, 1, 1, 0]);
  const storyY = useTransform(progress, storyRange.opacity, storyRange.y);

  // Column 3 (Tech tags & Action CTA Link)
  const techOpacity = useTransform(progress, techRange.opacity, [0, 1, 1, 0]);
  const techY = useTransform(progress, techRange.opacity, techRange.y);

  return (
    <motion.div 
      className="absolute inset-0 w-full h-full flex flex-col justify-between"
      style={{
        opacity: storyOpacity,
        pointerEvents,
        display: displayStyle,
        willChange: "opacity"
      }}
    >
      {/* Dynamic ambient overlays & metadata indicators */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Ambient Spotlights */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center filter blur-[140px] pointer-events-none"
          style={{ opacity: glowOpacity, scale: glowScale }}
        >
          <div 
            className="w-[45vw] h-[45vh] rounded-full"
            style={{
              background: 
                index === 0 ? 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)' :
                index === 1 ? 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)' :
                index === 2 ? 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)' :
                'radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%)'
            }}
          />
        </motion.div>

        {/* Framing border indicators */}
        <div className="absolute inset-x-8 top-8 bottom-8 flex flex-col justify-between p-4 hidden md:flex">
          <div className={`flex justify-between text-[7px] font-mono uppercase tracking-[0.2em] ${colors.text} opacity-60`}>
            <span>GRID MATRIX // S_SYS</span>
            <span>INDEX: 0{index + 1}</span>
          </div>
          <div className={`flex justify-between text-[7px] font-mono uppercase tracking-[0.2em] ${colors.text} opacity-60`}>
            <span>CINEMATIC SEQUENCE ENGINE</span>
            <span>STATE // PRO_G</span>
          </div>
        </div>
      </div>

      {/* Subtle magazine top header */}
      <motion.div 
        className={`absolute top-8 left-8 z-20 pointer-events-none hidden md:block ${colors.text}`}
        style={{ opacity: headerOpacity }}
      >
        <span className="text-[10px] font-mono tracking-[0.3em] uppercase opacity-70">
          SELECTED WORK / VOLUME {String(index + 1).padStart(2, '0')}
        </span>
      </motion.div>

      {/* Main Container Stage */}
      <div className="relative w-full h-full flex flex-col justify-center py-2 sm:py-8 md:py-16 px-6 z-10">
        
        {/* Alternating Content Layout */}
        <div className="w-full max-w-[90rem] mx-auto my-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-6 md:gap-8 lg:gap-16 items-center">
            
            {/* Left Column (Even: Images, Odd: Text) */}
            <div className={`col-span-1 md:col-span-6 flex items-center justify-center ${index % 2 === 0 ? 'order-1 md:order-1' : 'order-2 md:order-1'}`}>
              {index % 2 === 0 ? (
                /* Responsive Web + Mobile Overlapping Canvas */
                <motion.div 
                  className="relative w-full h-[135px] min-[370px]:h-[175px] sm:h-[230px] md:h-[340px] max-w-lg mx-auto flex items-center justify-center"
                  style={{ opacity: devicesOpacity }}
                >
                  {/* Web Browser Mockup */}
                  <motion.div 
                    style={{ x: dev0X, y: dev0Y, opacity: dev0Opacity, rotate: dev0Rot, willChange: "transform" }} 
                    className="absolute left-1 md:left-2 top-1 md:top-2 w-[72%] md:w-[76%] z-10"
                  >
                    <MagneticCard index={index} type="web">
                      <DeviceMockup projectIndex={index} type="web" />
                    </MagneticCard>
                  </motion.div>
                  {/* Mobile Phone Mockup */}
                  <motion.div 
                    style={{ x: dev1X, y: dev1Y, opacity: dev1Opacity, rotate: dev1Rot, willChange: "transform" }} 
                    className="absolute right-1 md:right-2 bottom-1 md:bottom-2 w-[30%] md:w-[34%] z-20"
                  >
                    <MagneticCard index={index} type="mobile">
                      <DeviceMockup projectIndex={index} type="mobile" />
                    </MagneticCard>
                  </motion.div>
                </motion.div>
              ) : (
                /* Narrative Column (Odd index, left side) */
                <div className="flex flex-col justify-center space-y-3 sm:space-y-5 md:space-y-8 text-left w-full max-w-lg mx-auto">
                  {/* Project Title */}
                  <motion.h3
                    style={{ opacity: titleOpacity, y: titleY, willChange: "transform, opacity" }}
                    className={`font-display font-light text-xl min-[370px]:text-2xl sm:text-3xl md:text-4xl lg:text-5xl uppercase tracking-wider leading-tight ${colors.heading}`}
                  >
                    {project?.title}
                  </motion.h3>

                  {/* Metadata Panel */}
                  <motion.div 
                    style={{ opacity: metaOpacity, y: metaY, willChange: "transform, opacity" }}
                    className={`grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 gap-3 sm:gap-4 md:gap-5 font-mono text-[9px] min-[370px]:text-[11px] md:text-xs tracking-wider opacity-85 ${colors.text}`}
                  >
                    <div className="space-y-1">
                      <span className="opacity-50 block uppercase font-mono text-[8px] md:text-[10px]">01 / ROLE</span>
                      <span className={`font-semibold block font-mono ${colors.accent}`}>CREATIVE LEAD</span>
                    </div>
                    <div className="space-y-1">
                      <span className="opacity-50 block uppercase font-mono text-[8px] md:text-[10px]">02 / YEAR</span>
                      <span className={`font-semibold block font-mono ${colors.accent}`}>2026</span>
                    </div>
                    <div className="space-y-1">
                      <span className="opacity-50 block uppercase font-mono text-[8px] md:text-[10px]">03 / TECH</span>
                      <span className={`font-semibold block font-mono ${colors.accent}`}>FULL-STACK</span>
                    </div>
                    <div className="space-y-1">
                      <span className="opacity-50 block uppercase font-mono text-[8px] md:text-[10px]">04 / STATUS</span>
                      <span className="text-emerald-500 dark:text-emerald-400 font-bold flex items-center gap-1.5 font-mono text-[8px] md:text-[10px]">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        ACTIVE
                      </span>
                    </div>
                  </motion.div>

                  {/* Storytelling */}
                  <motion.div 
                    style={{ opacity: storyOpacityText, y: storyY, willChange: "transform, opacity" }}
                    className="space-y-1.5 sm:space-y-2 md:space-y-2.5"
                  >
                    <span className={`font-mono text-[9px] min-[370px]:text-[11px] uppercase tracking-[0.25em] opacity-50 block ${colors.text}`}>THE STORY</span>
                    <p className={`font-sans font-light text-xs min-[370px]:text-sm md:text-[15px] lg:text-base leading-relaxed ${colors.text} line-clamp-4 md:line-clamp-none`}>
                      {getStoryText(index)}
                    </p>
                  </motion.div>

                  {/* Tech & Launch Link */}
                  <motion.div 
                    style={{ opacity: techOpacity, y: techY, willChange: "transform, opacity" }}
                    className="flex flex-col gap-3 sm:gap-4 md:gap-5 text-left"
                  >
                    <div className="space-y-1.5 sm:space-y-2">
                      <span className={`font-mono text-[9px] min-[370px]:text-[11px] md:text-xs uppercase tracking-[0.25em] opacity-50 block ${colors.text}`}>05 / TECH STACK</span>
                      <div className="flex flex-wrap gap-1.5 md:gap-2">
                        {project?.tags?.map((tag: string) => (
                          <span key={tag} className={`px-2 py-0.5 rounded font-mono text-[9px] min-[370px]:text-[11px] md:text-xs border ${colors.badgeBg} ${colors.badgeText}`}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="pt-1.5 sm:pt-2">
                      <a 
                        href={project?.link || "https://github.com"} 
                        target="_blank" 
                        rel="noreferrer noopener"
                        className={`inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded font-mono font-bold tracking-wider text-[10px] min-[370px]:text-xs md:text-sm uppercase transition-colors shadow-md ${colors.primary} ${colors.primaryHover}`}
                      >
                        EXPLORE SOURCE ↗
                      </a>
                    </div>
                  </motion.div>
                </div>
              )}
            </div>

            {/* Right Column (Even: Text, Odd: Images) */}
            <div className={`col-span-1 md:col-span-6 flex items-center justify-center ${index % 2 === 0 ? 'order-2 md:order-2' : 'order-1 md:order-2'}`}>
              {index % 2 === 0 ? (
                /* Narrative Column (Even index, right side) */
                <div className="flex flex-col justify-center space-y-3 sm:space-y-5 md:space-y-8 text-left w-full max-w-lg mx-auto">
                  {/* Project Title */}
                  <motion.h3
                    style={{ opacity: titleOpacity, y: titleY, willChange: "transform, opacity" }}
                    className={`font-display font-light text-xl min-[370px]:text-2xl sm:text-3xl md:text-4xl lg:text-5xl uppercase tracking-wider leading-tight ${colors.heading}`}
                  >
                    {project?.title}
                  </motion.h3>

                  {/* Metadata Panel */}
                  <motion.div 
                    style={{ opacity: metaOpacity, y: metaY, willChange: "transform, opacity" }}
                    className={`grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 gap-3 sm:gap-4 md:gap-5 font-mono text-[9px] min-[370px]:text-[11px] md:text-xs tracking-wider opacity-85 ${colors.text}`}
                  >
                    <div className="space-y-1">
                      <span className="opacity-50 block uppercase font-mono text-[8px] md:text-[10px]">01 / ROLE</span>
                      <span className={`font-semibold block font-mono ${colors.accent}`}>CREATIVE LEAD</span>
                    </div>
                    <div className="space-y-1">
                      <span className="opacity-50 block uppercase font-mono text-[8px] md:text-[10px]">02 / YEAR</span>
                      <span className={`font-semibold block font-mono ${colors.accent}`}>2026</span>
                    </div>
                    <div className="space-y-1">
                      <span className="opacity-50 block uppercase font-mono text-[8px] md:text-[10px]">03 / TECH</span>
                      <span className={`font-semibold block font-mono ${colors.accent}`}>FULL-STACK</span>
                    </div>
                    <div className="space-y-1">
                      <span className="opacity-50 block uppercase font-mono text-[8px] md:text-[10px]">04 / STATUS</span>
                      <span className="text-emerald-500 dark:text-emerald-400 font-bold flex items-center gap-1.5 font-mono text-[8px] md:text-[10px]">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        ACTIVE
                      </span>
                    </div>
                  </motion.div>

                  {/* Storytelling */}
                  <motion.div 
                    style={{ opacity: storyOpacityText, y: storyY, willChange: "transform, opacity" }}
                    className="space-y-1.5 sm:space-y-2 md:space-y-2.5"
                  >
                    <span className={`font-mono text-[9px] min-[370px]:text-[11px] uppercase tracking-[0.25em] opacity-50 block ${colors.text}`}>THE STORY</span>
                    <p className={`font-sans font-light text-xs min-[370px]:text-sm md:text-[15px] lg:text-base leading-relaxed ${colors.text} line-clamp-4 md:line-clamp-none`}>
                      {getStoryText(index)}
                    </p>
                  </motion.div>

                  {/* Tech & Launch Link */}
                  <motion.div 
                    style={{ opacity: techOpacity, y: techY, willChange: "transform, opacity" }}
                    className="flex flex-col gap-3 sm:gap-4 md:gap-5 text-left"
                  >
                    <div className="space-y-1.5 sm:space-y-2">
                      <span className={`font-mono text-[9px] min-[370px]:text-[11px] md:text-xs uppercase tracking-[0.25em] opacity-50 block ${colors.text}`}>05 / TECH STACK</span>
                      <div className="flex flex-wrap gap-1.5 md:gap-2">
                        {project?.tags?.map((tag: string) => (
                          <span key={tag} className={`px-2 py-0.5 rounded font-mono text-[9px] min-[370px]:text-[11px] md:text-xs border ${colors.badgeBg} ${colors.badgeText}`}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="pt-1.5 sm:pt-2">
                      <a 
                        href={project?.link || "https://github.com"} 
                        target="_blank" 
                        rel="noreferrer noopener"
                        className={`inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded font-mono font-bold tracking-wider text-[10px] min-[370px]:text-xs md:text-sm uppercase transition-colors shadow-md ${colors.primary} ${colors.primaryHover}`}
                      >
                        EXPLORE SOURCE ↗
                      </a>
                    </div>
                  </motion.div>
                </div>
              ) : (
                /* Responsive Web + Mobile Overlapping Canvas */
                <motion.div 
                  className="relative w-full h-[135px] min-[370px]:h-[175px] sm:h-[230px] md:h-[340px] max-w-lg mx-auto flex items-center justify-center"
                  style={{ opacity: devicesOpacity }}
                >
                  {/* Web Browser Mockup */}
                  <motion.div 
                    style={{ x: dev0X, y: dev0Y, opacity: dev0Opacity, rotate: dev0Rot, willChange: "transform" }} 
                    className="absolute left-1 md:left-2 top-1 md:top-2 w-[72%] md:w-[76%] z-10"
                  >
                    <MagneticCard index={index} type="web">
                      <DeviceMockup projectIndex={index} type="web" />
                    </MagneticCard>
                  </motion.div>
                  {/* Mobile Phone Mockup */}
                  <motion.div 
                    style={{ x: dev1X, y: dev1Y, opacity: dev1Opacity, rotate: dev1Rot, willChange: "transform" }} 
                    className="absolute right-1 md:right-2 bottom-1 md:bottom-2 w-[30%] md:w-[34%] z-20"
                  >
                    <MagneticCard index={index} type="mobile">
                      <DeviceMockup projectIndex={index} type="mobile" />
                    </MagneticCard>
                  </motion.div>
                </motion.div>
              )}
            </div>

          </div>
        </div>

        {/* Bottom indicator spacer */}
        <div className="h-4" />

      </div>
    </motion.div>
  );
}

interface DeviceMockupProps {
  projectIndex: number;
  type: 'web' | 'mobile';
}

function DeviceMockup({ projectIndex, type }: DeviceMockupProps) {
  const isWeb = type === 'web';

  if (isWeb) {
    return (
      <div 
        className="relative w-full aspect-[16/10.5] border rounded-lg overflow-hidden flex flex-col bg-white dark:bg-[#0c0c11] border-neutral-200/90 dark:border-neutral-800/90 transition-colors duration-500"
      >
        {/* Browser Header Bar */}
        <div className="h-6 border-b border-neutral-100 dark:border-neutral-900 bg-neutral-50/80 dark:bg-neutral-950/80 flex items-center px-2.5 justify-between select-none">
          {/* Windows / Mac Buttons */}
          <div className="flex gap-1 items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 dark:bg-red-900/60" />
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 dark:bg-amber-900/60" />
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 dark:bg-emerald-900/60" />
          </div>
          {/* Address Bar */}
          <div className="w-1/2 h-3.5 rounded bg-neutral-200/50 dark:bg-neutral-900/50 border border-neutral-300/10 flex items-center justify-center text-[5px] font-mono text-neutral-400 dark:text-neutral-500 truncate">
            {projectIndex === 0 && "https://vault.carter.dev"}
            {projectIndex === 1 && "https://animehub.carter.dev"}
            {projectIndex === 2 && "https://beyond.carter.dev"}
            {projectIndex === 3 && "https://aura.carter.dev"}
            {projectIndex === 4 && "https://spector.carter.dev"}
          </div>
          {/* Actions placeholder */}
          <div className="flex gap-1 items-center">
            <span className="w-2.5 h-0.5 bg-neutral-300 dark:bg-neutral-800 rounded" />
          </div>
        </div>

        {/* Browser Content */}
        <div className="flex-1 overflow-hidden p-2 flex flex-col justify-between select-none">
          {renderWebScreenContent(projectIndex)}
        </div>
      </div>
    );
  }

  // Mobile Device Mockup
  return (
    <div 
      className="relative w-full aspect-[9/18.5] border rounded-[1.6rem] overflow-hidden flex flex-col p-2.5 transition-colors duration-500 bg-[#070709] dark:bg-[#0a0a0d] border-neutral-800"
    >
      {/* Dynamic Notch / Status indicator */}
      <div className="w-12 h-2 rounded-full mx-auto bg-neutral-900 mb-1.5 flex items-center justify-center">
        <span className="w-0.5 h-0.5 rounded-full bg-neutral-950" />
      </div>

      {/* Screen Content Wrapper */}
      <div className="flex-1 flex flex-col justify-between select-none overflow-hidden rounded-xl">
        {renderMobileScreenContent(projectIndex)}
      </div>
    </div>
  );
}

function renderWebScreenContent(projectIndex: number) {
  if (projectIndex === 0) {
    // Expense Tracker
    return (
      <div className="flex-1 flex flex-col justify-between h-full bg-neutral-50 dark:bg-neutral-950 p-2 rounded-md border border-neutral-200/40 dark:border-neutral-900">
        <div className="flex justify-between items-center border-b border-neutral-200/40 dark:border-neutral-800/40 pb-1 mb-1">
          <span className="font-mono text-[6px] font-bold text-neutral-900 dark:text-neutral-100">VAULT FINANCIAL ENGINE</span>
          <span className="font-mono text-[5px] px-1 bg-emerald-500/10 text-emerald-500 rounded">LIVE</span>
        </div>
        <div className="grid grid-cols-3 gap-2 flex-1">
          <div className="col-span-2 flex flex-col justify-between">
            <div>
              <span className="text-[5px] text-neutral-400 uppercase tracking-wider font-semibold">Net Liquid Assets</span>
              <div className="text-[11px] font-bold font-mono text-neutral-900 dark:text-white">$114,802.50</div>
              <span className="text-[4.5px] text-emerald-500 font-bold block">+12.4% VS PREV MONTH</span>
            </div>
            {/* Cashflow Chart */}
            <div className="h-8 flex items-end justify-between gap-0.5 mt-1 pt-1 border-t border-neutral-200/20 dark:border-neutral-800/20">
              {[40, 65, 50, 85, 70, 95, 75, 100].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-zinc-900 dark:bg-zinc-100 rounded-t" style={{ height: `${h * 0.22}px` }} />
                </div>
              ))}
            </div>
          </div>
          <div className="col-span-1 border-l border-neutral-200/50 dark:border-neutral-800/50 pl-1.5 flex flex-col justify-between">
            <div className="space-y-1">
              <span className="text-[4.8px] text-neutral-400 uppercase tracking-wider block font-semibold">Cards</span>
              <div className="p-0.5 rounded bg-neutral-200/30 dark:bg-neutral-900/40 border border-neutral-200/30 dark:border-neutral-800/30">
                <div className="flex justify-between text-[4.8px] font-bold text-neutral-800 dark:text-neutral-200">
                  <span>Visa Black</span>
                </div>
                <div className="text-[6.5px] font-mono font-bold text-neutral-900 dark:text-neutral-100">$14,802</div>
              </div>
              <div className="p-0.5 rounded bg-neutral-200/30 dark:bg-neutral-900/40 border border-neutral-200/30 dark:border-neutral-800/30">
                <div className="flex justify-between text-[4.8px] font-bold text-neutral-800 dark:text-neutral-200">
                  <span>Stripe Dep</span>
                </div>
                <div className="text-[6.5px] font-mono font-bold text-neutral-900 dark:text-neutral-100">$92,400</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (projectIndex === 1) {
    // AnimeHub
    return (
      <div className="flex-1 flex flex-col justify-between h-full bg-zinc-950 p-2 rounded-md">
        <div className="flex justify-between items-center border-b border-zinc-900 pb-1 mb-1">
          <span className="font-mono text-[6px] font-bold text-indigo-400 tracking-widest">ANIMEHUB STUDIO</span>
          <span className="px-1 text-[4.5px] bg-red-500/10 text-red-500 border border-red-500/20 rounded">LIVE STREAM</span>
        </div>
        <div className="grid grid-cols-12 gap-1.5 flex-1">
          {/* Video Player */}
          <div className="col-span-8 bg-zinc-900 rounded relative flex flex-col justify-between p-1 border border-zinc-800">
            <div className="w-full aspect-video bg-black rounded flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15),transparent)]" />
              <span className="text-[9px] text-indigo-500 animate-pulse font-serif italic font-black">AH</span>
            </div>
            <div className="flex justify-between items-center mt-1 text-[5px]">
              <span className="text-white font-bold truncate">NEO TOKYO // EP 04 LIVE</span>
              <span className="text-zinc-500">1080P // 60FPS</span>
            </div>
          </div>
          {/* Side listings */}
          <div className="col-span-4 space-y-0.5 pl-1">
            <span className="text-[4.8px] text-zinc-400 uppercase tracking-wider block font-semibold">TRENDS</span>
            {[
              { t: "NEO TOKYO", r: "9.8" },
              { t: "CYBER CITY", r: "9.5" },
              { t: "VOID CHRON", r: "9.2" }
            ].map((s) => (
              <div key={s.t} className="p-0.5 rounded bg-zinc-900 border border-zinc-800 flex justify-between items-center text-[4.8px]">
                <span className="text-zinc-200 truncate font-mono">{s.t}</span>
                <span className="text-[4.5px] text-amber-500 font-bold">★{s.r}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  } else if (projectIndex === 2) {
    // beyond
    return (
      <div className="flex-1 flex flex-col justify-between h-full bg-neutral-50 dark:bg-neutral-950 p-2 rounded-md border border-neutral-200/40 dark:border-neutral-900">
        <div className="flex justify-between items-center border-b border-neutral-200/40 dark:border-neutral-800/40 pb-1 mb-1">
          <span className="font-mono text-[6px] font-bold text-emerald-500">BEYOND CLINICAL PORTAL</span>
          <span className="font-mono text-[5px] text-neutral-400">COHORT #12A</span>
        </div>
        <div className="grid grid-cols-12 gap-1.5 flex-1">
          <div className="col-span-7 flex flex-col justify-between">
            <div>
              <span className="text-[4.8px] text-neutral-400 uppercase tracking-wider block font-semibold">ECG Core Telemetry</span>
              <div className="text-[9px] font-mono font-bold text-neutral-900 dark:text-white mt-0.5">72 BPM <span className="text-emerald-500 text-[5px] font-normal">STABLE</span></div>
            </div>
            <div className="h-7 w-full border border-neutral-200/50 dark:border-neutral-800/50 bg-neutral-200/10 dark:bg-neutral-900/10 rounded flex items-center justify-center p-0.5 overflow-hidden">
              <svg viewBox="0 0 100 30" className="w-full h-full">
                <path d="M0,15 L15,15 L20,5 L25,25 L30,15 L50,15 L55,2 L60,28 L65,15 L100,15" fill="none" stroke="#10b981" strokeWidth="1" />
              </svg>
            </div>
          </div>
          <div className="col-span-5 space-y-0.5 border-l border-neutral-200/50 dark:border-neutral-800/50 pl-1.5">
            <span className="text-[4.8px] text-neutral-400 uppercase tracking-wider block font-semibold">Schedule</span>
            <div className="p-0.5 rounded bg-neutral-200/30 dark:bg-neutral-900/40 border border-neutral-200/30 dark:border-neutral-800/30">
              <span className="font-bold text-neutral-900 dark:text-neutral-100 block text-[5px]">Biometric Review</span>
            </div>
            <div className="p-0.5 rounded bg-neutral-200/30 dark:bg-neutral-900/40 border border-neutral-200/30 dark:border-neutral-800/30 opacity-60">
              <span className="font-bold text-neutral-900 dark:text-neutral-100 block text-[5px]">Diet Review</span>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (projectIndex === 3) {
    // Aura
    return (
      <div className="flex-1 flex flex-col justify-between h-full bg-white dark:bg-[#0c0c11] p-2 rounded-md">
        <div className="flex justify-between items-center border-b border-neutral-100 dark:border-neutral-900 pb-1 mb-1">
          <span className="font-mono text-[6px] font-bold text-neutral-900 dark:text-white">AURA COLLAB SYSTEM</span>
          <div className="flex gap-0.5">
            {["PEN", "SHAPE", "LAYER"].map((t, idx) => (
              <span key={t} className={`px-0.5 py-0.1 rounded text-[4px] font-mono ${idx === 0 ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-black' : 'text-neutral-400'}`}>
                {t}
              </span>
            ))}
          </div>
        </div>
        <div className="relative flex-1 border border-dashed border-neutral-200 dark:border-neutral-800 rounded bg-neutral-50/50 dark:bg-neutral-950/20 overflow-hidden min-h-[50px]">
          <svg viewBox="0 0 100 50" className="w-full h-full opacity-60">
            <circle cx="30" cy="25" r="9" fill="none" stroke="#6366f1" strokeWidth="0.8" />
            <rect x="55" y="15" width="16" height="16" fill="none" stroke="#10b981" strokeWidth="0.8" />
            <line x1="39" y1="25" x2="55" y2="25" stroke="#ec4899" strokeWidth="0.8" strokeDasharray="1.5 1.5" />
          </svg>
          <div className="absolute top-1/4 left-1/3 flex items-center gap-0.5">
            <span className="text-[6px] text-indigo-500 animate-pulse">✦</span>
            <span className="bg-neutral-900 dark:bg-neutral-100 text-white dark:text-black font-mono text-[4px] px-0.5 rounded-sm">Alex</span>
          </div>
        </div>
      </div>
    );
  } else {
    // Spector Visual CSS Sandbox
    return (
      <div className="flex-1 flex flex-col justify-between h-full bg-neutral-900 p-2 rounded-md text-white">
        <div className="flex justify-between items-center border-b border-zinc-800 pb-1 mb-1">
          <span className="font-mono text-[6px] font-bold text-amber-500">SPECTOR CSS GRID SANDBOX</span>
          <span className="font-mono text-[4.5px] bg-amber-500/15 text-amber-400 border border-amber-500/20 px-1 rounded">AST OK</span>
        </div>
        <div className="grid grid-cols-12 gap-1.5 flex-1">
          <div className="col-span-6 border border-zinc-800 bg-black/40 rounded p-1 flex flex-col justify-between">
            <span className="text-[4.5px] text-zinc-500 block uppercase font-mono mb-0.5">Grid View</span>
            <div className="grid grid-cols-3 gap-0.5 flex-1">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="rounded-sm border border-amber-500/20 bg-amber-500/10 flex items-center justify-center font-mono text-[4.8px] text-amber-300">
                  {i}
                </div>
              ))}
            </div>
          </div>
          <div className="col-span-6 border-l border-zinc-800 pl-1.5 flex flex-col justify-between font-mono text-[4.8px]">
            <div>
              <span className="text-zinc-500 uppercase tracking-wider block font-semibold mb-0.5">Utility Class</span>
              <div className="p-0.5 rounded bg-black border border-zinc-800 text-zinc-300 leading-tight font-mono text-[4.5px] overflow-hidden">
                {`grid grid-cols-3\ngap-4 bg-zinc-900`}
              </div>
            </div>
            <div className="flex justify-between items-center text-zinc-500 font-mono text-[4px] mt-0.5">
              <span>Cubic-Bezier</span>
              <span className="text-amber-400">0.25, 1</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function renderMobileScreenContent(projectIndex: number) {
  if (projectIndex === 0) {
    // Expense Tracker
    return (
      <div className="flex-1 flex flex-col justify-between h-full bg-neutral-50 dark:bg-neutral-950 p-1.5 text-[5.5px]">
        <div className="flex justify-between items-center border-b border-neutral-200 dark:border-neutral-900 pb-0.5 mb-1">
          <span className="font-mono text-[5.5px] font-bold text-neutral-900 dark:text-neutral-100">VAULT</span>
          <span className="text-neutral-400">08:24</span>
        </div>
        <div className="bg-neutral-900 text-white rounded-md p-1 flex flex-col justify-between h-11 shadow-sm mb-1">
          <div className="flex justify-between items-start text-[4px] text-neutral-400">
            <span>VISA CARD</span>
            <span>08/29</span>
          </div>
          <div className="font-mono text-[8px] text-center font-bold text-white">$14,802.50</div>
          <div className="text-[4px] text-neutral-400">ALEX CARTER</div>
        </div>
        <div className="space-y-0.5">
          <div className="flex justify-between border-b border-neutral-100 dark:border-neutral-900 py-0.5 text-[4.8px]">
            <span className="text-neutral-500">Apple Store</span>
            <span className="font-mono font-bold text-neutral-900 dark:text-white">-$1,299</span>
          </div>
          <div className="flex justify-between border-b border-neutral-100 dark:border-neutral-900 py-0.5 text-[4.8px]">
            <span className="text-neutral-500">Stripe Pay</span>
            <span className="font-mono font-bold text-emerald-500">+$4,500</span>
          </div>
        </div>
      </div>
    );
  } else if (projectIndex === 1) {
    // AnimeHub
    return (
      <div className="flex-1 flex flex-col justify-between h-full bg-zinc-950 p-1.5 text-[5px]">
        <div className="text-center py-1 border-b border-zinc-900">
          <span className="font-serif italic text-xs font-black tracking-widest text-indigo-500">AH</span>
        </div>
        <div className="space-y-1 my-1 flex-1 justify-center flex flex-col">
          <span className="text-zinc-500 text-[4px]">PASSCODE GATEWAY</span>
          <div className="h-4 rounded border border-zinc-800 bg-zinc-900 flex items-center px-1 text-zinc-400 text-[4.5px]">
            ••••••••
          </div>
        </div>
        <div className="p-1 bg-indigo-600 rounded text-center text-white font-mono font-bold text-[5px]">
          ENTER ARCHIVE
        </div>
      </div>
    );
  } else if (projectIndex === 2) {
    // beyond
    return (
      <div className="flex-1 flex flex-col justify-between h-full bg-neutral-50 dark:bg-neutral-950 p-1.5 text-[5px]">
        <div className="flex justify-between items-center border-b border-neutral-200 dark:border-neutral-800 pb-0.5 mb-1">
          <span className="font-mono text-[5.5px] font-bold text-emerald-500">BEYOND</span>
          <span className="text-neutral-400">72 BPM</span>
        </div>
        <div className="space-y-0.5 flex-1 justify-center flex flex-col">
          <span className="text-neutral-400 text-[4.5px] uppercase font-bold tracking-wider mb-0.5">REGIMEN</span>
          {[
            { t: "Hydration Sync", d: true },
            { t: "Vitals Check", d: true },
            { t: "Aerobic Session", d: false }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-0.5 text-[4.5px]">
              <span className={item.d ? 'line-through text-neutral-400' : 'text-neutral-800 dark:text-neutral-200'}>
                {item.d ? "✓ " : "• "}{item.t}
              </span>
            </div>
          ))}
        </div>
        <div className="p-0.5 bg-emerald-500 rounded text-center text-white font-mono font-bold text-[5px]">
          SECURE SYNC
        </div>
      </div>
    );
  } else if (projectIndex === 3) {
    // Aura
    return (
      <div className="flex-1 flex flex-col justify-between h-full bg-neutral-50 dark:bg-neutral-950 p-1.5 text-[5px]">
        <div className="flex justify-between items-center border-b border-neutral-200 dark:border-neutral-800 pb-0.5 mb-1">
          <span className="font-mono text-[5.5px] font-bold text-indigo-500">AURA</span>
          <span className="text-neutral-400">COLLAB</span>
        </div>
        <div className="space-y-0.5">
          <span className="text-neutral-400 text-[4.5px] uppercase font-bold block mb-0.5">Team Workspace</span>
          {[
            { n: "Alex Carter", c: "Pen" },
            { n: "Sarah Connor", c: "Shape" }
          ].map((u, idx) => (
            <div key={idx} className="flex justify-between items-center py-0.5 border-b border-neutral-100 dark:border-neutral-900 text-[4.5px]">
              <span className="text-neutral-800 dark:text-neutral-200 font-bold">{u.n}</span>
              <span className="text-neutral-400 font-mono">{u.c}</span>
            </div>
          ))}
        </div>
        <div className="p-0.5 bg-indigo-500 text-white text-center font-bold font-mono text-[5px] rounded">
          SHARE
        </div>
      </div>
    );
  } else {
    // Spector
    return (
      <div className="flex-1 flex flex-col justify-between h-full bg-zinc-950 p-1.5 text-[5px] text-white">
        <div className="flex justify-between items-center border-b border-zinc-800 pb-0.5 mb-1">
          <span className="font-mono text-[5.5px] font-bold text-amber-500">SPECTOR</span>
          <span className="text-zinc-400 font-mono">0.45s</span>
        </div>
        <div className="space-y-1">
          <span className="text-zinc-500 text-[4.5px] uppercase font-bold tracking-wider block font-mono">CURVE EDITOR</span>
          <div className="h-6 w-full border border-zinc-800 bg-zinc-900/40 rounded flex items-center justify-center p-0.5 overflow-hidden">
            <svg viewBox="0 0 50 30" className="w-full h-full opacity-60">
              <path d="M0,30 C12,30 12,0 50,0" fill="none" stroke="#f59e0b" strokeWidth="1" />
            </svg>
          </div>
        </div>
        <div className="p-0.5 bg-amber-500 text-zinc-950 text-center font-bold font-mono text-[5px] rounded">
          EXPORT
        </div>
      </div>
    );
  }
}

function getStoryText(index: number): string {
  const stories = [
    "In a market saturated with chaotic, high-friction financial dashboards, users struggled to track daily spending. We built this expense tracker to restore clarity. By centering the interface around a physical-feeling card model and daily viewports, the cognitive load was cut in half. The design emphasizes immediate feedback, allowing users to catalog metrics effortlessly and gain absolute control of their financial trajectory.",
    "Traditional streaming portals overwhelm viewers with cluttered recommendations and intrusive ads. AnimeHub was conceived as a distraction-free sanctuary for media discovery. We established a strict layout hierarchy that prioritizes content artwork over noise. Elevating standard navigation to tactile media lists reduced time-to-play, creating a highly cinematic discovery loop.",
    "Modern health metrics are fragmented across disconnected apps, leaving clinical teams and patients in silos. beyond unites these data points into a single collaborative thread. Designed alongside elite medical advisors, the companion translates biometric streams into high-contrast clinical insights. Establishing continuous sync cycles reduced diagnostic friction and unlocked deep, actionable wellness agency.",
    "Collaboration tools often trade performance for feature bloat, causing severe input lag during team brainstorms. Aura re-architects the whiteboard from the ground up using optimized vector paths. By coupling high-speed rendering pipelines with an ultra-minimal workspace, teams can sketch flows in absolute sync. Zero-latency feedback transformed remote brain-mapping into a completely natural dialogue.",
    "Front-end engineers waste hundreds of hours manually translating complex layout specifications and animation flows into production code. Spector was built to revolutionize this bridge by combining interactive design boards with direct AST compiler outputs. By allowing developers to visually construct CSS Grid structures and fine-tune spring easing models, Spector delivers production-ready components instantly, boosting design system implementation velocity across teams."
  ];
  return stories[index] || "";
}
