export interface Country {
  code: string;
  name: string;
  flag: string;
  timezones: string[];
}

export const COUNTRIES: Country[] = [
  { code: "US", name: "United States", flag: "🇺🇸", timezones: ["America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles"] },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", timezones: ["Europe/London"] },
  { code: "FR", name: "France", flag: "🇫🇷", timezones: ["Europe/Paris"] },
  { code: "ES", name: "Spain", flag: "🇪🇸", timezones: ["Europe/Madrid"] },
  { code: "DE", name: "Germany", flag: "🇩🇪", timezones: ["Europe/Berlin"] },
  { code: "IT", name: "Italy", flag: "🇮🇹", timezones: ["Europe/Rome"] },
  { code: "BR", name: "Brazil", flag: "🇧🇷", timezones: ["America/Sao_Paulo"] },
  { code: "JP", name: "Japan", flag: "🇯🇵", timezones: ["Asia/Tokyo"] },
  { code: "KR", name: "South Korea", flag: "🇰🇷", timezones: ["Asia/Seoul"] },
  { code: "CN", name: "China", flag: "🇨🇳", timezones: ["Asia/Shanghai"] },
  { code: "TW", name: "Taiwan", flag: "🇹🇼", timezones: ["Asia/Taipei"] },
  { code: "SA", name: "Saudi Arabia", flag: "🇸🇦", timezones: ["Asia/Riyadh"] },
  { code: "AE", name: "UAE", flag: "🇦🇪", timezones: ["Asia/Dubai"] },
  { code: "AU", name: "Australia", flag: "🇦🇺", timezones: ["Australia/Sydney", "Australia/Melbourne"] },
  { code: "CA", name: "Canada", flag: "🇨🇦", timezones: ["America/Toronto", "America/Vancouver"] },
  { code: "MX", name: "Mexico", flag: "🇲🇽", timezones: ["America/Mexico_City"] },
  { code: "AR", name: "Argentina", flag: "🇦🇷", timezones: ["America/Argentina/Buenos_Aires"] },
  { code: "RU", name: "Russia", flag: "🇷🇺", timezones: ["Europe/Moscow"] },
  { code: "IN", name: "India", flag: "🇮🇳", timezones: ["Asia/Kolkata"] },
];

export function getCountryByCode(code: string): Country | undefined {
  return COUNTRIES.find((c) => c.code === code);
}

export function detectCountry(): string {
  if (typeof window === "undefined") return "US";
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const match = COUNTRIES.find((c) =>
      c.timezones.some((tz) => timezone.startsWith(tz.split("/")[0])),
    );
    if (match) return match.code;

    const lang = navigator.language;
    const parts = lang.split("-");
    if (parts.length > 1) {
      const code = parts[1].toUpperCase();
      if (COUNTRIES.some((c) => c.code === code)) return code;
    }
  } catch {}
  return "US";
}

export function getCountryFlag(code: string): string {
  return getCountryByCode(code)?.flag ?? "🌍";
}
