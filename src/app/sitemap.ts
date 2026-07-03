import type { MetadataRoute } from "next";
import { SITE_URL, LOCALES } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["/extension", "/about", "/privacy", "/terms"];
  const localeEntries = LOCALES.flatMap((locale) =>
    staticPages.map((page) => ({
      url: `${SITE_URL}/${locale}${page}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((l) => [l, `${SITE_URL}/${l}${page}`]),
        ),
      },
    })),
  );

  const localeHomePages = LOCALES.map((locale) => ({
    url: `${SITE_URL}/${locale}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 1.0,
    alternates: {
      languages: Object.fromEntries(
        LOCALES.map((l) => [l, `${SITE_URL}/${l}`]),
      ),
    },
  }));

  const rootEntry = {
    url: SITE_URL,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 1.0,
    alternates: {
      languages: Object.fromEntries([
        ["x-default", SITE_URL],
        ...LOCALES.map((l) => [l, `${SITE_URL}/${l}`]),
      ]),
    },
  };

  return [rootEntry, ...localeHomePages, ...localeEntries];
}
