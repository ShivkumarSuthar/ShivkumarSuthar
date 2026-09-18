import type { Metadata } from "next";
import { StatusPage } from "@/components/StatusPage";

export const metadata: Metadata = {
  title: "Unauthorized",
  robots: { index: false, follow: false },
};

export default function Unauthorized() {
  return (
    <StatusPage
      code="401"
      title="Sign in required"
      description="This area needs an account. Sign in on Study to continue, or return to the public portfolio."
      primaryHref="/study"
      primaryLabel="Go to Study login"
    />
  );
}
