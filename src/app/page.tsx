/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TabType, ProjectItem } from "../types";
import { SiteShell } from "../components/SiteShell";
import { HomeView } from "../components/HomeView";
import { PortfolioView } from "../components/PortfolioView";
import { CvView } from "../components/CvView";
import { RecommendationsView } from "../components/RecommendationsView";
import { CodeSamplesView } from "../components/CodeSamplesView";
import { ProjectModal } from "../components/ProjectModal";
import { AnimatePresence, motion } from "motion/react";

const VALID_TABS: TabType[] = [
  "home",
  "cv",
  "portfolio",
  "recommendations",
  "code-samples",
  "study",
];

function parseTab(value: string | null): TabType {
  if (value && VALID_TABS.includes(value as TabType) && value !== "study") {
    return value as TabType;
  }
  return "home";
}

function PortfolioApp() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentTab, setCurrentTab] = useState<TabType>(() =>
    parseTab(searchParams.get("tab")),
  );
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    root.removeAttribute("data-theme");
    localStorage.setItem("shivkumar_theme", "light");
  }, []);

  useEffect(() => {
    setCurrentTab(parseTab(searchParams.get("tab")));
  }, [searchParams]);

  const handleSelectTab = (tab: TabType) => {
    if (tab === "study") {
      router.push("/study");
      return;
    }
    setCurrentTab(tab);
    const href = tab === "home" ? "/" : `/?tab=${tab}`;
    router.replace(href, { scroll: false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <SiteShell currentTab={currentTab} onSelectTab={handleSelectTab}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {currentTab === "home" && (
              <HomeView
                onSelectTab={handleSelectTab}
                onOpenProjectModal={(project) => setSelectedProject(project)}
              />
            )}
            {currentTab === "portfolio" && (
              <PortfolioView
                onOpenProjectModal={(project) => setSelectedProject(project)}
              />
            )}
            {currentTab === "cv" && (
              <CvView onBackToHome={() => handleSelectTab("home")} />
            )}
            {currentTab === "recommendations" && <RecommendationsView />}
            {currentTab === "code-samples" && <CodeSamplesView />}
          </motion.div>
        </AnimatePresence>
      </SiteShell>

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
}

export default function App() {
  return (
    <Suspense
      fallback={
        <SiteShell currentTab="home" showFooter={false}>
          <div className="h-40 animate-pulse rounded-xl bg-[#ffffff]/50" />
        </SiteShell>
      }
    >
      <PortfolioApp />
    </Suspense>
  );
}
