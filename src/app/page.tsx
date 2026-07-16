"use client";

import dynamic from "next/dynamic";
import ErrorBoundary from "../components/ErrorBoundary";

const AppWithNoSSR = dynamic(() => import("../App"), {
  ssr: false,
});

export default function Home() {
  return (
    <ErrorBoundary>
      <AppWithNoSSR />
    </ErrorBoundary>
  );
}
