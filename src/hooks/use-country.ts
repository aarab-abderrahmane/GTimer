"use client";

import { useMemo } from "react";
import { detectCountry, getCountryByCode, type Country } from "@/lib/countries";
import { useSettings } from "@/contexts/settings-context";

function getTimezoneInfo() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const offset = -new Date().getTimezoneOffset();
    const hours = Math.floor(Math.abs(offset) / 60);
    const mins = Math.abs(offset) % 60;
    const sign = offset >= 0 ? "+" : "-";
    return {
      timezone: tz,
      timezoneOffset: `UTC${sign}${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`,
    };
  } catch {
    return { timezone: "UTC", timezoneOffset: "UTC+00:00" };
  }
}

export function useCountry(): {
  country: Country;
  timezone: string;
  timezoneOffset: string;
} {
  const { settings } = useSettings();
  const { timezone, timezoneOffset } = useMemo(() => getTimezoneInfo(), []);

  const countryCode = settings.country || detectCountry();
  const country = getCountryByCode(countryCode) ?? {
    code: "US",
    name: "United States",
    flag: "🇺🇸",
    timezones: ["America/New_York"],
  };

  return { country, timezone, timezoneOffset };
}
