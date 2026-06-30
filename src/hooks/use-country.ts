"use client";

import { useMemo } from "react";
import { detectCountry, getCountryByCode, type Country } from "@/lib/countries";
import { useSettings } from "@/contexts/settings-context";

function getTimezoneOffset(tz: string): string {
  try {
    const date = new Date();
    const str = date.toLocaleString("en", {
      timeZone: tz,
      timeZoneName: "shortOffset",
    });
    const match = str.match(/([+-]\d{1,2})(:\d{2})?/);
    if (match) {
      const sign = match[1][0] === "+" ? "+" : "-";
      const hours = match[1].slice(1).padStart(2, "0");
      const mins = match[2] ? match[2].slice(1) : "00";
      return `UTC${sign}${hours}:${mins}`;
    }
  } catch {}
  return "UTC";
}

export function useCountry(): {
  country: Country;
  timezone: string;
  timezoneOffset: string;
} {
  const { settings } = useSettings();
  const browserTz = useMemo(
    () => {
      try {
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
      } catch {
        return "UTC";
      }
    },
    [],
  );

  const timezone = settings.timezone || browserTz;
  const timezoneOffset = useMemo(() => getTimezoneOffset(timezone), [timezone]);

  const countryCode = settings.country || detectCountry();
  const country = getCountryByCode(countryCode) ?? {
    code: "US",
    name: "United States",
    flag: "🇺🇸",
    timezones: ["America/New_York"],
  };

  return { country, timezone, timezoneOffset };
}
