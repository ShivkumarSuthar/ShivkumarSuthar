import { SiteShell } from "@/components/SiteShell";
import { StudyLoginSkeleton } from "@/components/study/StudySkeleton";

export default function StudyLoading() {
  return (
    <SiteShell currentTab="study" showFooter={false} variant="study">
      <StudyLoginSkeleton />
    </SiteShell>
  );
}
