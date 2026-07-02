export const PRE_ORDER_DATE = new Date("2026-06-25T00:00:00Z");
export const RELEASE_DATE = new Date("2026-11-19T00:00:00Z");

export const SITE_NAME = "GTimer";
export const SITE_DESCRIPTION = "The most beautiful GTA VI countdown experience.";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://gtimer-auto.vercel.app";

export const LOCALES = ["en", "fr", "es", "pt-BR", "de", "it", "ja", "ko", "zh-CN", "zh-TW", "ar"] as const;
export const DEFAULT_LOCALE = "en";

export type Locale = (typeof LOCALES)[number];

export const LANGUAGE_NAMES: Record<Locale, string> = {
  en: "English",
  fr: "Français",
  es: "Español",
  "pt-BR": "Português (Brasil)",
  de: "Deutsch",
  it: "Italiano",
  ja: "日本語",
  ko: "한국어",
  "zh-CN": "简体中文",
  "zh-TW": "繁體中文",
  ar: "العربية",
};
