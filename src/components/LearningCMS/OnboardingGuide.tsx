/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, HelpCircle, BookOpen, CheckSquare, Briefcase, Eye, Keyboard, HelpCircle as HelpIcon, ArrowRight, Play, CheckCircle } from 'lucide-react';

interface OnboardingGuideProps {
  themeMode: 'light' | 'dark';
}

export default function OnboardingGuide({ themeMode }: OnboardingGuideProps) {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('portfolio_cms_hide_guide') === 'true';
    } catch {
      return false;
    }
  });

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      localStorage.setItem('portfolio_cms_hide_guide', 'true');
    } catch (e) {
      console.error(e);
    }
  };

  const handleRestore = () => {
    setIsDismissed(false);
    try {
      localStorage.removeItem('portfolio_cms_hide_guide');
    } catch (e) {
      console.error(e);
    }
  };

  if (isDismissed) {
    return (
      <div className="flex justify-end -mb-4 animate-fade-in">
        <button
          onClick={handleRestore}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
            themeMode === 'light'
              ? 'bg-white border-zinc-200 text-zinc-500 hover:text-zinc-800 shadow-sm'
              : 'bg-zinc-900 border-zinc-800/80 text-zinc-400 hover:text-zinc-100'
          }`}
        >
          <HelpIcon className="w-3.5 h-3.5 text-indigo-400" />
          <span>Show Workspace Guide</span>
        </button>
      </div>
    );
  }

  const steps = [
    {
      title: "1. Enter a Study Space",
      icon: BookOpen,
      desc: "Your learning dashboard lists major knowledge tracks (e.g. Frontend Architecture, Systems Design). Click 'Enter Study Space' on any card below to launch its tailored lesson browser.",
      tip: "Tip: You can create your own custom study tracks by clicking 'New Space' on the top right!",
      badge: "Get Started"
    },
    {
      title: "2. Watch & Write Notes",
      icon: Play,
      desc: "Inside a Study Space, open any Lesson or Lecture to view the reading deck or video player. The right side contains a personal study workspace with high-fidelity Markdown support.",
      tip: "Key Benefit: Your written notes auto-save on every keystroke to keep your study flow uninterrupted.",
      badge: "Active Study"
    },
    {
      title: "3. Tasks & Practice Projects",
      icon: CheckSquare,
      desc: "Each space features dedicated tabs for Tasks & Practice Projects. Add milestones to-dos, link GitHub source repositories, and link live demonstration URLs to showcase your practical work.",
      tip: "Workflow Hint: Keep track of course progress by ticking off tasks in your study checklist.",
      badge: "Project Work"
    },
    {
      title: "4. Global Command Search",
      icon: Keyboard,
      desc: "Use our comprehensive Command Search to jump anywhere instantly. Search and switch spaces, navigate tabs, read library bookmarks, or close the workspace without touching your mouse.",
      tip: "Pro Tip: Tap 'Ctrl + K' or 'Cmd + K' (or click search in the subheader) to trigger the palette at any time.",
      badge: "Hotkeys"
    }
  ];

  const current = steps[activeStep];
  const StepIcon = current.icon;

  const themeCardBg = themeMode === 'light'
    ? 'bg-gradient-to-br from-indigo-50/20 via-white to-zinc-50/30 border-zinc-200 shadow-[0_4px_24px_rgba(0,0,0,0.03)]'
    : 'bg-gradient-to-br from-indigo-950/10 via-zinc-900/95 to-zinc-900 border-zinc-800/80';

  const themeActiveTab = themeMode === 'light'
    ? 'bg-zinc-950 text-white font-semibold'
    : 'bg-zinc-100 text-zinc-950 font-semibold';

  const themeInactiveTab = themeMode === 'light'
    ? 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100/50'
    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40';

  return (
    <div className={`p-6 rounded-2xl border flex flex-col gap-5 relative overflow-hidden transition-all duration-300 animate-fade-in ${themeCardBg}`}>
      {/* Background decoration blur */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header section with toggle and title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/10 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-1.5">
              <span>Interactive Study Guide</span>
              <span className="px-1.5 py-0.5 rounded-md bg-indigo-500/10 text-[9px] font-mono font-bold text-indigo-400">CMS FLOW</span>
            </h3>
            <p className="text-[11px] text-zinc-400 mt-0.5">Learn how to browse curriculums, write automated notes, and track projects in 60 seconds.</p>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          className={`px-3 py-1.5 rounded-xl border text-[10px] font-semibold font-mono transition-colors cursor-pointer shrink-0 self-start sm:self-center ${
            themeMode === 'light'
              ? 'border-zinc-200 text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50'
              : 'border-zinc-800 text-zinc-400 hover:text-zinc-150 hover:bg-zinc-950'
          }`}
        >
          Got it, Hide Guide
        </button>
      </div>

      {/* Step Selector Tabs */}
      <div className="flex flex-wrap gap-1.5 bg-zinc-950 p-1 rounded-xl border border-zinc-900/60 self-start">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = idx === activeStep;
          return (
            <button
              key={idx}
              onClick={() => setActiveStep(idx)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-mono font-medium cursor-pointer transition-all ${
                isActive ? themeActiveTab : themeInactiveTab
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">{step.title}</span>
              <span className="inline xs:hidden">Step {idx + 1}</span>
            </button>
          );
        })}
      </div>

      {/* Step Content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center mt-1">
        {/* Step details (7/12) */}
        <div className="md:col-span-8 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-[9px] font-bold font-mono text-indigo-400 uppercase">
              {current.badge}
            </span>
            <h4 className="text-xs font-bold text-zinc-200 font-mono flex items-center gap-1.5">
              <StepIcon className="w-3.5 h-3.5 text-indigo-400" />
              <span>{current.title}</span>
            </h4>
          </div>

          <p className="text-xs text-zinc-300 leading-relaxed max-w-xl">
            {current.desc}
          </p>

          <div className="p-3 bg-zinc-950/40 border border-zinc-850/50 rounded-xl text-[11px] text-zinc-400 font-mono max-w-xl">
            {current.tip}
          </div>
        </div>

        {/* Action / Next controls (4/12) */}
        <div className="md:col-span-4 flex md:flex-col items-center md:items-stretch justify-between md:justify-center gap-3 border-t md:border-t-0 md:border-l border-zinc-800/10 pt-4 md:pt-0 md:pl-5 shrink-0">
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-mono text-zinc-500">QUICK PROGRESSION</span>
            <span className="text-[10px] text-zinc-300 font-medium">Read {activeStep + 1} of 4 steps</span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {activeStep > 0 && (
              <button
                onClick={() => setActiveStep(prev => prev - 1)}
                className={`px-2.5 py-1.5 rounded-lg border text-[10px] font-semibold cursor-pointer ${
                  themeMode === 'light'
                    ? 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                    : 'border-zinc-800 text-zinc-400 hover:bg-zinc-950'
                }`}
              >
                Prev
              </button>
            )}

            {activeStep < 3 ? (
              <button
                onClick={() => setActiveStep(prev => prev + 1)}
                className="flex items-center gap-1 px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-[10px] font-semibold cursor-pointer shadow-md"
              >
                <span>Next Step</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            ) : (
              <button
                onClick={handleDismiss}
                className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-[10px] font-semibold cursor-pointer shadow-md"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Finished</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
