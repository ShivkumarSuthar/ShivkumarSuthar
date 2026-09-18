"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { TabType } from "../types";
import { Header } from "./Header";
import { NavigationDrawer } from "./NavigationDrawer";
import { Footer } from "./Footer";

type SiteShellProps = {
  currentTab: TabType;
  children: React.ReactNode;
  onSelectTab?: (tab: TabType) => void;
  showFooter?: boolean;
  /** Study product surface: solid white main, edge-to-edge content */
  variant?: "default" | "study";
};

function tabHref(tab: TabType) {
  if (tab === "study") return "/study";
  if (tab === "home") return "/";
  return `/?tab=${tab}`;
}

export function SiteShell({
  currentTab,
  children,
  onSelectTab,
  showFooter = true,
  variant = "default",
}: SiteShellProps) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isStudy = variant === "study";

  const handleSelectTab = (tab: TabType) => {
    setIsMenuOpen(false);
    if (onSelectTab) {
      onSelectTab(tab);
      return;
    }
    router.push(tabHref(tab));
  };

  return (
    <div
      className={`min-h-dvh flex flex-col selection:bg-[#f7df1e] selection:text-[#1f1f1f] ${
        /* Mobile: full-bleed width. Desktop: inset card margins. */
        "px-0 py-0 sm:px-5 lg:px-8"
      }`}
    >
      <NavigationDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
      />

      <div
        id="app-main-card"
        className={`max-w-7xl w-full mx-auto flex flex-col flex-1 min-h-dvh sm:min-h-0 ${
          isStudy
            ? "bg-[#ffffff] sm:rounded-2xl sm:shadow-[0_24px_60px_-28px_rgba(27,83,128,0.45)] sm:ring-1 sm:ring-black/5"
            : "bg-[#ffffff]/50 sm:backdrop-blur-sm sm:shadow-2xl sm:rounded-none"
        }`}
        style={
          isStudy
            ? undefined
            : {
                boxShadow:
                  "0 20px 45px -15px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)",
              }
        }
      >
        <Header
          currentTab={currentTab}
          onSelectTab={handleSelectTab}
          isMenuOpen={isMenuOpen}
          onToggleMenu={() => setIsMenuOpen((prev) => !prev)}
        />

        <main
          id="main-content"
          className={`flex-1 w-full min-h-0 text-[var(--text-main)] ${
            isStudy
              ? "bg-[#ffffff] p-0"
              : "px-4 py-5 sm:px-7 sm:py-7 lg:px-10 lg:py-8"
          }`}
        >
          {children}
        </main>

        {showFooter && currentTab !== "home" && (
          <Footer onSelectTab={handleSelectTab} />
        )}
      </div>
    </div>
  );
}
