export const PRE_ORDER_DATE = new Date("2026-06-25T00:00:00Z");
export const RELEASE_DATE = new Date("2026-11-29T00:00:00Z");

export const SITE_NAME = "GTimer";
export const SITE_DESCRIPTION = "The most beautiful GTA VI countdown experience.";
export const SITE_URL = "https://gtimer.app";

export const LOCALES = ["en", "fr", "es", "pt-BR", "de", "it", "ja", "ko", "zh-CN", "zh-TW", "ar"] as const;
export const DEFAULT_LOCALE = "en";

export type Locale = (typeof LOCALES)[number];
