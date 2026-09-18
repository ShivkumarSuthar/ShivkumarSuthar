import type { Metadata } from "next";
import { StatusPage } from "@/components/StatusPage";

export const metadata: Metadata = {
  title: "Forbidden",
  robots: { index: false, follow: false },
};

export default function Forbidden() {
  return (
    <StatusPage
      code="403"
      title="Access forbidden"
      description="You do not have permission to view this page. If you think this is a mistake, head back home or open Study."
      primaryHref="/"
      primaryLabel="Back to portfolio"
    />
  );
}
