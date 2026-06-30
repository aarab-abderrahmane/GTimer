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
        className="flex items-center gap-2 rounded-full px-3 py-1.5 transition-all duration-300 backdrop-blur-md"
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "12px",
          fontWeight: 600,
          letterSpacing: "0.05em",
          color: "#E0E0FF",
          background: "rgba(26,16,48,0.6)",
          border: "1px solid rgba(192,132,240,0.2)",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor =
            "rgba(192,132,240,0.5)";
          (e.currentTarget as HTMLElement).style.color = "#FFFFFF";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor =
            "rgba(192,132,240,0.2)";
          (e.currentTarget as HTMLElement).style.color = "#E0E0FF";
        }}
      >
        <Globe className="h-3.5 w-3.5 shrink-0" />
        <span>{LANGUAGE_NAMES[locale]}</span>
        <ChevronDown
          className={cn(
            "h-3 w-3 shrink-0 transition-transform duration-300",
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
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute end-0 top-full z-50 overflow-y-auto"
            style={{
              marginTop: "8px",
              maxHeight: "240px",
              width: "176px",
              background: "rgba(13, 13, 30, 0.96)",
              border: "1px solid rgba(192,132,240,0.2)",
              backdropFilter: "blur(16px)",
            }}
          >
            {LOCALES.map((l) => (
              <button
                key={l}
                onClick={() => switchLocale(l)}
                className="flex w-full items-center gap-3 text-start transition-all duration-200"
                style={{
                  padding: "10px 16px",
                  fontFamily: "var(--font-body)",
                  fontSize: "13px",
                  fontWeight: l === locale ? 600 : 300,
                  color: l === locale ? "#FFD700" : "#E0E0FF",
                  background:
                    l === locale
                      ? "rgba(192,132,240,0.1)"
                      : "transparent",
                  border: "none",
                  cursor: "pointer",
                  borderBottom: "1px solid rgba(192,132,240,0.06)",
                }}
                onMouseEnter={(e) => {
                  if (l !== locale) {
                    (e.currentTarget as HTMLElement).style.background =
                      "rgba(192,132,240,0.07)";
                    (e.currentTarget as HTMLElement).style.color = "#FFFFFF";
                  }
                }}
                onMouseLeave={(e) => {
                  if (l !== locale) {
                    (e.currentTarget as HTMLElement).style.background =
                      "transparent";
                    (e.currentTarget as HTMLElement).style.color = "#E0E0FF";
                  }
                }}
              >
                {l === locale && (
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "#FFD700",
                      flexShrink: 0,
                    }}
                  />
                )}
                <span className={cn(l !== locale && "ms-[14px]")}>
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
