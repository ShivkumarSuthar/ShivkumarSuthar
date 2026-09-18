import type { Metadata } from "next";
import { StatusPage } from "@/components/StatusPage";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <StatusPage
      code="404"
      title="Page not found"
      description="This link does not exist — or it may have moved. Head home to explore the portfolio, or open Study to continue learning."
      primaryHref="/"
      primaryLabel="Back to portfolio"
    />
  );
}
