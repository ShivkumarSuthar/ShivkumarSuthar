import type { Metadata } from "next";
import { StatusPage } from "@/components/StatusPage";

export const metadata: Metadata = {
  title: "Sign-in error",
  robots: { index: false, follow: false },
};

type AuthErrorPageProps = {
  searchParams: Promise<{ error?: string }>;
};

const MESSAGES: Record<string, { title: string; description: string }> = {
  Configuration: {
    title: "Sign-in unavailable",
    description:
      "This sign-in method isn't available right now. Please try email and password, or come back later.",
  },
  AccessDenied: {
    title: "Access denied",
    description:
      "We couldn't sign you in with that account. Try another method, or create an account with email.",
  },
  Verification: {
    title: "Link expired",
    description:
      "That sign-in link is no longer valid. Please go back to Study and try again.",
  },
  Default: {
    title: "Could not sign you in",
    description:
      "Something went wrong while signing in. Please go back to Study and try again.",
  },
};

export default async function AuthErrorPage({ searchParams }: AuthErrorPageProps) {
  const params = await searchParams;
  const key = params.error && MESSAGES[params.error] ? params.error : "Default";
  const copy = MESSAGES[key];

  return (
    <StatusPage
      code="Auth"
      title={copy.title}
      description={copy.description}
      primaryHref="/study"
      primaryLabel="Back to Study login"
    />
  );
}
