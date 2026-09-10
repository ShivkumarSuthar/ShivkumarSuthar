import type { Metadata } from "next";
import { Quicksand, Geist_Mono } from "next/font/google";
import "./globals.css";

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Shivkumar Suthar - Full-Stack Developer Portfolio",
  description:
    "Portfolio and Curriculum Vitae of Shivkumar Suthar, Full-Stack Developer with 3+ years experience building scalable web applications with React, Next.js, TypeScript, and Node.js.",
  openGraph: {
    title: "Shivkumar Suthar - Full-Stack Developer Portfolio",
    description:
      "Portfolio and Curriculum Vitae of Shivkumar Suthar, Full-Stack Developer with 3+ years experience building scalable web applications with React, Next.js, TypeScript, and Node.js.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased selection:bg-black selection:text-white">
      <body className={`${quicksand.variable} ${geistMono.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
