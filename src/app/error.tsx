"use client";

import { useEffect } from "react";
import { StatusPage } from "@/components/StatusPage";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <StatusPage
      code="500"
      title="Something went wrong"
      description="An unexpected error stopped this page from loading. You can try again, or go back to the portfolio."
      showRetry
      onRetry={reset}
    />
  );
}
