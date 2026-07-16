"use client";

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PortfolioData, ContactMessage } from './types';
import { defaultPortfolioData } from './data/defaultData';
import { THEMES } from './utils/theme';
import Header from './components/Header';
import Hero from './components/Hero';
import SectionSeparator from './components/SectionSeparator';
import SkeletonLoader from './components/SkeletonLoader';
import SectionSkeleton from './components/SectionSkeleton';
import Workspace from './components/LearningCMS/Workspace';

const About = React.lazy(() => import('./components/About'));
const Projects = React.lazy(() => import('./components/Projects'));
const Skills = React.lazy(() => import('./components/Skills'));
const Contact = React.lazy(() => import('./components/Contact'));
import { motion, AnimatePresence } from 'motion/react';

const LOCAL_STORAGE_KEY = 'personal_portfolio_config_data_v1';
const MESSAGES_STORAGE_KEY = 'personal_portfolio_inquiry_messages_v1';

export default function App() {
  const [data, setData] = useState<PortfolioData>(defaultPortfolioData);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<'portfolio' | 'cms'>('portfolio');

  // Load initial configurations from local storage
  useEffect(() => {
    try {
      const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedData) {
        const parsed = JSON.parse(storedData);
        // Robust merge to preserve newly introduced fields like 'phone'
        const merged: PortfolioData = {
          ...defaultPortfolioData,
          ...parsed,
          personal: {
            ...defaultPortfolioData.personal,
            ...(parsed.personal || {})
          }
        };
        setData(merged);
      }

      const storedMessages = localStorage.getItem(MESSAGES_STORAGE_KEY);
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      }
    } catch (e) {
      console.error("Failed to load state from localStorage", e);
    }

    // Graceful loading transition
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  // Sync portfolio config changes to localStorage
  const handleDataChange = (newData: PortfolioData) => {
    setData(newData);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newData));
    } catch (e) {
      console.error("Failed to save state to localStorage", e);
    }
  };

  // Sync new contact messages
  const handleNewMessage = (newMsg: ContactMessage) => {
    const updatedMsgs = [newMsg, ...messages];
    setMessages(updatedMsgs);
    try {
      localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(updatedMsgs));
    } catch (e) {
      console.error("Failed to save messages to localStorage", e);
    }
  };

  // Clear contact messages
  const handleClearMessages = () => {
    setMessages([]);
    try {
      localStorage.removeItem(MESSAGES_STORAGE_KEY);
    } catch (e) {
      console.error("Failed to clear messages from localStorage", e);
    }
  };

  // Reset to default mockup configuration
  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset your portfolio data back to default layout? Your custom edits will be cleared.")) {
      setData(defaultPortfolioData);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultPortfolioData));
      } catch (e) {
        console.error("Failed to reset state to localStorage", e);
      }
    }
  };

  // Active theme computed styles
  const activeTheme = data.theme || 'slate';
  const activeMode = data.themeMode || 'dark';
  const themePalette = THEMES[activeMode] || THEMES.dark;
  const colors = themePalette[activeTheme] || themePalette.slate;

  const toggleThemeMode = () => {
    const nextMode = activeMode === 'light' ? 'dark' : 'light';
    handleDataChange({
      ...data,
      themeMode: nextMode
    });
  };

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <SkeletonLoader colors={colors} themeMode={activeMode} />
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`min-h-screen text-sm transition-colors duration-500 flex flex-col font-sans ${colors.bg} ${colors.text}`}
        >
          
          {/* Background radial soft light spotlight effect */}
          <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_0%,rgba(120,119,198,0.04),transparent_50%)]" />

          {/* Header element */}
          <Header 
            data={data}
            colors={colors}
            themeMode={activeMode}
            onToggleTheme={toggleThemeMode}
            currentView={view}
            onViewChange={setView}
          />

          {/* Main Container Layout */}
          {view === 'cms' ? (
            <div className="flex-1 transition-all duration-300 relative z-10 pt-20 flex flex-col">
              <Workspace
                colors={colors}
                themeMode={activeMode}
                onExitWorkspace={() => setView('portfolio')}
              />
            </div>
          ) : (
            <main 
              id="main-layout-container"
              className="flex-1 transition-all duration-300 relative z-10"
            >
              {/* Portfolio Sections */}
              <Hero data={data} colors={colors} />
              
              <SectionSeparator colors={colors} themeMode={activeMode} />
              
              <React.Suspense fallback={<SectionSkeleton colors={colors} themeMode={activeMode} />}>
                <About data={data} colors={colors} />
              </React.Suspense>
              
              <SectionSeparator colors={colors} themeMode={activeMode} />

              <React.Suspense fallback={<SectionSkeleton colors={colors} themeMode={activeMode} />}>
                <Skills data={data} colors={colors} />
              </React.Suspense>

              <SectionSeparator colors={colors} themeMode={activeMode} />
              
              <React.Suspense fallback={<SectionSkeleton colors={colors} themeMode={activeMode} />}>
                <Projects data={data} colors={colors} />
              </React.Suspense>

              <SectionSeparator colors={colors} themeMode={activeMode} />
              
              
              
              <React.Suspense fallback={<SectionSkeleton colors={colors} themeMode={activeMode} />}>
                <Contact data={data} colors={colors} onNewMessage={handleNewMessage} />
              </React.Suspense>

              {/* Footer */}
              <footer className={`py-12 border-t ${colors.borderColor}/30 text-center font-mono text-[10px] text-zinc-600`}>
                <div className="max-w-[90rem] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span>© {new Date().getFullYear()} {data.personal.name}. All Rights Reserved.</span>
                  <span className="flex items-center gap-1">
                    Built with precision and purpose
                  </span>
                </div>
              </footer>
            </main>
          )}

        </motion.div>
      )}
    </AnimatePresence>
  );
}
