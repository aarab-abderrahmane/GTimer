export interface Country {
  code: string;
  name: string;
  flag: string;
  timezones: string[];
}

export const COUNTRIES: Country[] = [
  { code: "NZ", name: "New Zealand", flag: "🇳🇿", timezones: ["Pacific/Auckland"] },
  { code: "AU", name: "Australia", flag: "🇦🇺", timezones: ["Australia/Sydney", "Australia/Melbourne", "Australia/Perth"] },
  { code: "PG", name: "Papua New Guinea", flag: "🇵🇬", timezones: ["Pacific/Port_Moresby"] },
  { code: "JP", name: "Japan", flag: "🇯🇵", timezones: ["Asia/Tokyo"] },
  { code: "KR", name: "South Korea", flag: "🇰🇷", timezones: ["Asia/Seoul"] },
  { code: "CN", name: "China", flag: "🇨🇳", timezones: ["Asia/Shanghai"] },
  { code: "HK", name: "Hong Kong", flag: "🇭🇰", timezones: ["Asia/Hong_Kong"] },
  { code: "TW", name: "Taiwan", flag: "🇹🇼", timezones: ["Asia/Taipei"] },
  { code: "SG", name: "Singapore", flag: "🇸🇬", timezones: ["Asia/Singapore"] },
  { code: "MY", name: "Malaysia", flag: "🇲🇾", timezones: ["Asia/Kuala_Lumpur"] },
  { code: "PH", name: "Philippines", flag: "🇵🇭", timezones: ["Asia/Manila"] },
  { code: "ID", name: "Indonesia", flag: "🇮🇩", timezones: ["Asia/Jakarta"] },
  { code: "TH", name: "Thailand", flag: "🇹🇭", timezones: ["Asia/Bangkok"] },
  { code: "VN", name: "Vietnam", flag: "🇻🇳", timezones: ["Asia/Ho_Chi_Minh"] },
  { code: "BD", name: "Bangladesh", flag: "🇧🇩", timezones: ["Asia/Dhaka"] },
  { code: "NP", name: "Nepal", flag: "🇳🇵", timezones: ["Asia/Kathmandu"] },
  { code: "IN", name: "India", flag: "🇮🇳", timezones: ["Asia/Kolkata"] },
  { code: "PK", name: "Pakistan", flag: "🇵🇰", timezones: ["Asia/Karachi"] },
  { code: "AE", name: "UAE", flag: "🇦🇪", timezones: ["Asia/Dubai"] },
  { code: "OM", name: "Oman", flag: "🇴🇲", timezones: ["Asia/Muscat"] },
  { code: "SA", name: "Saudi Arabia", flag: "🇸🇦", timezones: ["Asia/Riyadh"] },
  { code: "QA", name: "Qatar", flag: "🇶🇦", timezones: ["Asia/Qatar"] },
  { code: "KW", name: "Kuwait", flag: "🇰🇼", timezones: ["Asia/Kuwait"] },
  { code: "BH", name: "Bahrain", flag: "🇧🇭", timezones: ["Asia/Bahrain"] },
  { code: "IQ", name: "Iraq", flag: "🇮🇶", timezones: ["Asia/Baghdad"] },
  { code: "TR", name: "Turkey", flag: "🇹🇷", timezones: ["Europe/Istanbul"] },
  { code: "RU", name: "Russia", flag: "🇷🇺", timezones: ["Europe/Moscow"] },
  { code: "GR", name: "Greece", flag: "🇬🇷", timezones: ["Europe/Athens"] },
  { code: "FI", name: "Finland", flag: "🇫🇮", timezones: ["Europe/Helsinki"] },
  { code: "ZA", name: "South Africa", flag: "🇿🇦", timezones: ["Africa/Johannesburg"] },
  { code: "EG", name: "Egypt", flag: "🇪🇬", timezones: ["Africa/Cairo"] },
  { code: "MA", name: "Morocco", flag: "🇲🇦", timezones: ["Africa/Casablanca"] },
  { code: "FR", name: "France", flag: "🇫🇷", timezones: ["Europe/Paris"] },
  { code: "DE", name: "Germany", flag: "🇩🇪", timezones: ["Europe/Berlin"] },
  { code: "ES", name: "Spain", flag: "🇪🇸", timezones: ["Europe/Madrid"] },
  { code: "IT", name: "Italy", flag: "🇮🇹", timezones: ["Europe/Rome"] },
  { code: "NL", name: "Netherlands", flag: "🇳🇱", timezones: ["Europe/Amsterdam"] },
  { code: "BE", name: "Belgium", flag: "🇧🇪", timezones: ["Europe/Brussels"] },
  { code: "CH", name: "Switzerland", flag: "🇨🇭", timezones: ["Europe/Zurich"] },
  { code: "AT", name: "Austria", flag: "🇦🇹", timezones: ["Europe/Vienna"] },
  { code: "PL", name: "Poland", flag: "🇵🇱", timezones: ["Europe/Warsaw"] },
  { code: "CZ", name: "Czech Republic", flag: "🇨🇿", timezones: ["Europe/Prague"] },
  { code: "SE", name: "Sweden", flag: "🇸🇪", timezones: ["Europe/Stockholm"] },
  { code: "NO", name: "Norway", flag: "🇳🇴", timezones: ["Europe/Oslo"] },
  { code: "DK", name: "Denmark", flag: "🇩🇰", timezones: ["Europe/Copenhagen"] },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", timezones: ["Europe/London"] },
  { code: "IE", name: "Ireland", flag: "🇮🇪", timezones: ["Europe/Dublin"] },
  { code: "PT", name: "Portugal", flag: "🇵🇹", timezones: ["Europe/Lisbon"] },
  { code: "IS", name: "Iceland", flag: "🇮🇸", timezones: ["Atlantic/Reykjavik"] },
  { code: "BR", name: "Brazil", flag: "🇧🇷", timezones: ["America/Sao_Paulo"] },
  { code: "AR", name: "Argentina", flag: "🇦🇷", timezones: ["America/Argentina/Buenos_Aires"] },
  { code: "CL", name: "Chile", flag: "🇨🇱", timezones: ["America/Santiago"] },
  { code: "CA", name: "Canada", flag: "🇨🇦", timezones: ["America/Toronto", "America/Vancouver"] },
  { code: "US", name: "United States", flag: "🇺🇸", timezones: ["America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles"] },
  { code: "MX", name: "Mexico", flag: "🇲🇽", timezones: ["America/Mexico_City"] },
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
