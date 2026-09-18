import type { MetadataRoute } from "next";
import { PERSONAL_INFO } from "../data/portfolioData";

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
      // skip invalid placeholders
    }
  }
  return "http://localhost:3000";
}

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = resolveSiteUrl();
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteUrl}/study`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];
}
