import type { Locale } from "./constants";

const RTL_LOCALES: Locale[] = ["ar"];

export function getDirection(locale: Locale | string): "ltr" | "rtl" {
  return RTL_LOCALES.includes(locale as Locale) ? "rtl" : "ltr";
}
