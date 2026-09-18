"use client";

import { useEffect } from "react";
import { StatusPage } from "@/components/StatusPage";

export default function StudyError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Study route error:", error);
  }, [error]);

  return (
    <StatusPage
      code="Oops"
      title="Study hit a snag"
      description="This study page failed to load. Try again, or return to the portfolio while we sort it out."
      showRetry
      onRetry={reset}
    />
  );
}
