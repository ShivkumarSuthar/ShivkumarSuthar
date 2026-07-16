/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { X, ArrowRight, ArrowLeft, Sparkles, Check } from 'lucide-react';

interface TourStep {
  targetId: string;
  title: string;
  description: string;
  fallbackPosition: { top: number; left: number };
  arrowDirection: 'top' | 'bottom' | 'left' | 'right';
}

interface InteractiveTourProps {
  themeMode: 'light' | 'dark';
  onComplete: () => void;
}

export default function InteractiveTour({ themeMode, onComplete }: InteractiveTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [popoverStyle, setPopoverStyle] = useState<React.CSSProperties>({});
  const [highlightStyle, setHighlightStyle] = useState<React.CSSProperties>({});
  const [isRendered, setIsRendered] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const steps: TourStep[] = [
    {
      targetId: 'cms-welcome-title',
      title: "Interactive Study Workspace",
      description: "Welcome to your syllabus CMS. This space consolidates study tracks, custom lessons, checklists, and active markdown notes in one fluid, distraction-free cockpit.",
      fallbackPosition: { top: 120, left: 100 },
      arrowDirection: 'top',
    },
    {
      targetId: 'study-spaces-grid-section',
      title: "Launch a Study Track",
      description: "Each track represents a specialized discipline (e.g. Frontend Architecture). Click 'Enter Study Space' to view syllabus chapters, launch video sessions, and write code notes.",
      fallbackPosition: { top: 320, left: 100 },
      arrowDirection: 'top',
    },
    {
      targetId: 'cms-streak-indicator',
      title: "Your Study Streaks",
      description: "Commit daily, complete milestones, and watch lectures to grow your learning streak. It serves as visual proof of your active dedication.",
      fallbackPosition: { top: 80, left: 500 },
      arrowDirection: 'right',
    },
    {
      targetId: 'cms-quick-search-btn',
      title: "Supercharged Command Search",
      description: "Tap the search button or hit 'Ctrl + K' (or 'Cmd + K') from anywhere to summon the Command Palette. Instantly swap tracks or jump views without touch.",
      fallbackPosition: { top: 80, left: 600 },
      arrowDirection: 'right',
    }
  ];

  const updatePosition = () => {
    const step = steps[currentStep];
    if (!step) return;

    const el = document.getElementById(step.targetId);
    if (el) {
      // Ensure the element is scrolled into view gracefully
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Wait a tiny fraction for scroll to finish
      setTimeout(() => {
        const rect = el.getBoundingClientRect();
        const scrollY = window.scrollY;
        const scrollX = window.scrollX;

        // Position highlight mask exactly over the element with small padding
        const padding = 8;
        setHighlightStyle({
          position: 'absolute',
          top: rect.top + scrollY - padding,
          left: rect.left + scrollX - padding,
          width: rect.width + (padding * 2),
          height: rect.height + (padding * 2),
          borderRadius: '12px',
          boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.75), 0 0 15px rgba(99, 102, 241, 0.5)',
          zIndex: 50,
          pointerEvents: 'none',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        });

        // Determine tooltip placement based on target coordinate space
        const popoverPadding = 16;
        let pTop = rect.bottom + scrollY + popoverPadding;
        let pLeft = rect.left + scrollX;

        // Reposition based on direction to keep it beautiful
        if (step.arrowDirection === 'right') {
          pTop = rect.top + scrollY - 20;
          pLeft = Math.max(16, rect.left + scrollX - 340);
        } else if (step.arrowDirection === 'top') {
          pTop = rect.bottom + scrollY + popoverPadding;
          pLeft = Math.max(16, Math.min(window.innerWidth - 340, rect.left + scrollX));
        }

        setPopoverStyle({
          position: 'absolute',
          top: pTop,
          left: pLeft,
          zIndex: 51,
          width: '320px',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        });
      }, 100);
    } else {
      // Fallback
      setHighlightStyle({
        display: 'none',
      });
      setPopoverStyle({
        position: 'fixed',
        top: '35%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 51,
        width: '320px',
      });
    }
  };

  useEffect(() => {
    // Deliberate small delay to let content paint before positioning first step
    const timer = setTimeout(() => {
      setIsRendered(true);
      updatePosition();
    }, 500);

    window.addEventListener('resize', updatePosition);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updatePosition);
    };
  }, [currentStep]);

  if (!isRendered) return null;

  const current = steps[currentStep];

  return (
    <div className="absolute inset-0 z-50 pointer-events-none">
      {/* Target spotlight mask element */}
      <div style={highlightStyle} />

      {/* Popover card container (pointer-events-auto to capture clicks inside) */}
      <div 
        ref={popoverRef}
        style={popoverStyle}
        className="pointer-events-auto animate-scale-up"
      >
        <div className={`p-5 rounded-2xl border shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative overflow-hidden ${
          themeMode === 'light'
            ? 'bg-white border-zinc-200 text-zinc-800'
            : 'bg-zinc-950 border-indigo-500/30 text-zinc-200'
        }`}>
          {/* Subtle glow border decorative tab */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500" />

          {/* Top header with close icon */}
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-1.5 text-indigo-400 font-mono text-[9px] uppercase tracking-wider font-bold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Workspace tour</span>
            </div>
            <button 
              onClick={onComplete}
              className={`p-1 rounded-lg transition-colors cursor-pointer ${
                themeMode === 'light' ? 'hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700' : 'hover:bg-zinc-900 text-zinc-500 hover:text-zinc-200'
              }`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Title */}
          <h4 className="text-xs font-bold font-mono tracking-tight text-zinc-100 mb-2 flex items-center gap-2">
            <span className="text-indigo-400">{currentStep + 1}.</span>
            <span>{current.title}</span>
          </h4>

          {/* Description */}
          <p className="text-[11px] text-zinc-400 leading-relaxed mb-4">
            {current.description}
          </p>

          {/* Step progression controls */}
          <div className="flex items-center justify-between border-t border-zinc-900/60 pt-3 mt-1.5">
            <span className="text-[9px] font-mono text-zinc-500">
              {currentStep + 1} of {steps.length} steps
            </span>

            <div className="flex items-center gap-1.5">
              {currentStep > 0 && (
                <button
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-[10px] font-semibold cursor-pointer transition-colors ${
                    themeMode === 'light'
                      ? 'border-zinc-200 hover:bg-zinc-50 text-zinc-600'
                      : 'border-zinc-800 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-100'
                  }`}
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>Back</span>
                </button>
              )}

              {currentStep < steps.length - 1 ? (
                <button
                  onClick={() => setCurrentStep(prev => prev + 1)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-[10px] font-semibold cursor-pointer shadow-md shadow-indigo-500/10 transition-all hover:scale-102"
                >
                  <span>Next Step</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              ) : (
                <button
                  onClick={onComplete}
                  className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-[10px] font-semibold cursor-pointer shadow-md shadow-emerald-500/10 transition-all hover:scale-102"
                >
                  <Check className="w-3 h-3" />
                  <span>Finished</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
