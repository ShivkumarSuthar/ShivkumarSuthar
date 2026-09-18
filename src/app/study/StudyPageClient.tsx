"use client";

import { SiteShell } from "@/components/SiteShell";
import { StudyView } from "@/components/study/StudyView";

export default function StudyPageClient() {
  return (
    <SiteShell currentTab="study" showFooter={false} variant="study">
      <StudyView />
    </SiteShell>
  );
}
