export const OG_LOCALE_MAP: Record<string, string> = {
  en: "en_US",
  fr: "fr_FR",
  es: "es_ES",
  "pt-BR": "pt_BR",
  de: "de_DE",
  it: "it_IT",
  ja: "ja_JP",
  ko: "ko_KR",
  "zh-CN": "zh_CN",
  "zh-TW": "zh_TW",
  ar: "ar_SA",
};

export function getOgLocale(locale: string): string {
  return OG_LOCALE_MAP[locale] ?? "en_US";
}
