import type { Metadata } from "next";
import { auth } from "@/auth";
import { StudySessionProvider } from "@/components/study/StudySessionProvider";

export const metadata: Metadata = {
  title: "Study",
  description:
    "Sign in to save courses, track learning progress, and practice JavaScript, React, and HTML/CSS.",
};

export default async function StudyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <StudySessionProvider session={session}>{children}</StudySessionProvider>
  );
}
