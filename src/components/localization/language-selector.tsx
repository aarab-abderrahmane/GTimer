"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Globe } from "lucide-react";
import { LOCALES, type Locale } from "@/lib/constants";
import { cn } from "@/lib/utils";

const LANGUAGE_NAMES: Record<Locale, string> = {
  en: "English",
  fr: "Français",
  es: "Español",
  "pt-BR": "Português",
  de: "Deutsch",
  it: "Italiano",
  ja: "日本語",
  ko: "한국어",
  "zh-CN": "简体中文",
  "zh-TW": "繁體中文",
  ar: "العربية",
};

export function LanguageSelector() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split("/").filter(Boolean);
    if (LOCALES.includes(segments[0] as Locale)) {
      segments[0] = newLocale;
    } else {
      segments.unshift(newLocale);
    }
    setIsOpen(false);
    router.push(`/${segments.join("/")}`);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-[var(--spacing-sm)] rounded-[var(--radius-pill)] px-[var(--spacing-md)] py-[var(--spacing-xs)] text-[var(--text-body)] text-[var(--color-content-secondary)] backdrop-blur-[6.25px] transition-colors hover:text-[var(--color-content)]"
      >
        <Globe className="h-4 w-4" />
        <span>{LANGUAGE_NAMES[locale]}</span>
        <ChevronDown
          className={cn(
            "h-3 w-3 transition-transform",
            isOpen && "rotate-180",
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-50 mt-[var(--spacing-sm)] max-h-64 w-44 overflow-y-auto rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] bg-[var(--color-surface)]/95 backdrop-blur-[12px]"
          >
            {LOCALES.map((l) => (
              <button
                key={l}
                onClick={() => switchLocale(l)}
                className={cn(
                  "flex w-full items-center gap-[var(--spacing-md)] px-[var(--spacing-md)] py-[var(--spacing-sm)] text-left text-[var(--text-body)] transition-colors",
                  l === locale
                    ? "text-[var(--color-accent)] bg-[var(--color-accent)]/10"
                    : "text-[var(--color-content-secondary)] hover:text-[var(--color-content)] hover:bg-[var(--color-surface-alt)]",
                )}
              >
                {l === locale && (
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
                )}
                <span className={cn(l !== locale && "ml-[calc(0.375rem+6px)]")}>
                  {LANGUAGE_NAMES[l]}
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
