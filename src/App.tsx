/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TabType, ProjectItem } from './types';
import { Header } from './components/Header';
import { NavigationDrawer } from './components/NavigationDrawer';
import { HomeView } from './components/HomeView';
import { PortfolioView } from './components/PortfolioView';
import { CvView } from './components/CvView';
import { RecommendationsView } from './components/RecommendationsView';
import { CodeSamplesView } from './components/CodeSamplesView';
import { ProjectModal } from './components/ProjectModal';
import { Footer } from './components/Footer';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronRight, Home as HomeIcon } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  // Permanently maintain bright, clean light theme
  useEffect(() => {
    const root = document.documentElement;
    root.removeAttribute('data-theme');
    localStorage.setItem('shivkumar_theme', 'light');
  }, []);

  const handleSelectTab = (tab: TabType) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getBreadcrumbTitle = (tab: TabType) => {
    switch (tab) {
      case 'home':
        return 'Home';
      case 'cv':
        return 'Curriculum Vitae';
      case 'portfolio':
        return 'Portfolio';
      case 'recommendations':
        return 'Recommendations';
      case 'code-samples':
        return 'Code Samples';
      default:
        return 'Home';
    }
  };

  return (
    <div className="min-h-screen flex flex-col py-4 sm:py-7 px-2.5 sm:px-6 lg:px-8 selection:bg-[#f7df1e] selection:text-black">
      {/* Slide-over Navigation Drawer */}
      <NavigationDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
      />

      {/* Unified Single Card: Header and Content aligned together */}
      <div
        id="app-main-card"
        className="max-w-6xl w-full mx-auto rounded-2xl overflow-hidden border border-[#e2e8f0] shadow-xl flex flex-col bg-white"
        style={{
          boxShadow: '0 20px 45px -15px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(226, 232, 240, 0.9)',
        }}
      >
        {/* 1. Header (Top of the Card) */}
        <Header
          currentTab={currentTab}
          onSelectTab={handleSelectTab}
          isMenuOpen={isMenuOpen}
          onToggleMenu={() => setIsMenuOpen((prev) => !prev)}
        />

        {/* 2. Main Content Canvas (Body of the Card) */}
        <main
          id="main-content"
          className="flex-1 w-full text-[var(--text-main)]"
          style={{
            backgroundColor: 'var(--bg-surface)',
            padding: '30px',
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {currentTab === 'home' && (
                <HomeView
                  onSelectTab={handleSelectTab}
                  onOpenProjectModal={(project) => setSelectedProject(project)}
                />
              )}
              {currentTab === 'portfolio' && (
                <PortfolioView
                  onOpenProjectModal={(project) => setSelectedProject(project)}
                />
              )}
              {currentTab === 'cv' && (
                <CvView onBackToHome={() => handleSelectTab('home')} />
              )}
              {currentTab === 'recommendations' && <RecommendationsView />}
              {currentTab === 'code-samples' && <CodeSamplesView />}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* 3. Footer (Bottom of the Card - rendered on secondary pages) */}
        {currentTab !== 'home' && <Footer onSelectTab={handleSelectTab} />}
      </div>

      {/* 4. Project Case Study Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}
