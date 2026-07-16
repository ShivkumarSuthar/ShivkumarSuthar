import type { Metadata } from "next";
import "../index.css";

export const metadata: Metadata = {
  title: "Learning CMS",
  description: "A comprehensive personalized Learning CMS with MongoDB synchronization and Gemini-powered roadmap generation.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
