import type { MetadataRoute } from "next";
import { SITE_URL, LOCALES } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["", "/extension", "/about", "/privacy", "/terms"];

  return LOCALES.flatMap((locale) =>
    staticPages.map((page) => ({
      url: `${SITE_URL}/${locale}${page}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: page === "" ? 1.0 : 0.8,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((l) => [l, `${SITE_URL}/${l}${page}`]),
        ),
      },
    })),
  );
}
