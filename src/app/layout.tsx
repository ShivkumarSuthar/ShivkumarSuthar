import type { Metadata, Viewport } from "next";
import { Quicksand, Geist_Mono } from "next/font/google";
import { PERSONAL_INFO } from "../data/portfolioData";
import NextTopLoader from 'nextjs-toploader';
import "./globals.css";

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

function resolveSiteUrl() {
  for (const value of [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.APP_URL,
    PERSONAL_INFO.website,
  ]) {
    if (!value) continue;
    try {
      return new URL(value).origin;
    } catch {
      // ignore invalid env values
    }
  }
  return "http://localhost:3000";
}

const siteUrl = resolveSiteUrl();

const title = "Shivkumar Suthar | Full-Stack Developer";
const description =
  "Hire Shivkumar Suthar — Full-Stack Developer in Jaipur with 3+ years experience. MongoDB, Express.js, React.js, Next.js, Node.js, TypeScript. Available for full-stack and frontend-heavy roles.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s | Shivkumar Suthar",
  },
  description,
  applicationName: "Shivkumar Suthar Portfolio",
  authors: [{ name: PERSONAL_INFO.name, url: PERSONAL_INFO.linkedin }],
  creator: PERSONAL_INFO.name,
  publisher: PERSONAL_INFO.name,
  keywords: [
    "Full Stack Developer",
    "Full-Stack Developer",
    "MongoDB",
    "Express.js",
    "React.js Developer",
    "Next.js Developer",
    "Node.js Developer",
    "TypeScript",
    "JavaScript",
    "Tailwind CSS",
    "REST API",
    "Web Developer Jaipur",
    "Hire MERN Developer",
    "Hire Full-Stack Developer India",
    "Shivkumar Suthar",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: "Shivkumar Suthar — Full Stack Developer",
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: PERSONAL_INFO.name,
      url: siteUrl,
      image: `${siteUrl}/opengraph-image`,
      jobTitle: "Full Stack Developer",
      description,
      email: PERSONAL_INFO.email,
      telephone: PERSONAL_INFO.phone,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Jaipur",
        addressCountry: "IN",
      },
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: PERSONAL_INFO.education.institution,
      },
      knowsAbout: [
        "MERN Stack",
        "Full-Stack Development",
        "MongoDB",
        "Express.js",
        "React.js",
        "Next.js",
        "Node.js",
        "TypeScript",
        "JavaScript",
        "Tailwind CSS",
        "REST APIs",
        "Core Web Vitals",
      ],
      sameAs: [PERSONAL_INFO.linkedin, PERSONAL_INFO.github, PERSONAL_INFO.website],
      worksFor: {
        "@type": "Organization",
        name: "Dev Technosys Pvt Ltd",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: title,
      description,
      publisher: { "@id": `${siteUrl}/#person` },
      inLanguage: "en",
    },
    {
      "@type": "ProfilePage",
      "@id": `${siteUrl}/#profile`,
      url: siteUrl,
      name: title,
      about: { "@id": `${siteUrl}/#person` },
      mainEntity: { "@id": `${siteUrl}/#person` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased selection:bg-[#f3f1ec] selection:text-[#1f1f1f]">
      <body className={`${quicksand.variable} ${geistMono.variable} font-sans`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <NextTopLoader
          color="#2563eb"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #2563eb,0 0 5px #2563eb"
          zIndex={1600}
        />
        {children}
      </body>
    </html>
  );
}
