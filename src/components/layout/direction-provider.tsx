"use client";

import { useLocale } from "next-intl";
import { getDirection } from "@/lib/direction";
import { useEffect } from "react";

export function DirectionProvider({ children }: { children: React.ReactNode }) {
  const locale = useLocale();

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = getDirection(locale);
  }, [locale]);

  return <>{children}</>;
}
