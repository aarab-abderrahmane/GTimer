"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Globe, ChevronDown } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { LOCALES, LANGUAGE_NAMES, type Locale } from "@/lib/constants";
import { COUNTRIES, getCountryFlag } from "@/lib/countries";
import { useSettings } from "@/contexts/settings-context";
import { cn } from "@/lib/utils";


export function LocalizationMenu() {
  const locale = useLocale() as Locale;
  const t = useTranslations("settings");
  const pathname = usePathname();
  const router = useRouter();
  const { settings, updateSettings } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"language" | "country">("language");
  const [countryQuery, setCountryQuery] = useState("");
  const flag = getCountryFlag(settings.country);

  const close = () => {
    setIsOpen(false);
    setCountryQuery("");
  };
  const switchLocale = (newLocale: string) => {
    const segments = pathname.split("/").filter(Boolean);
    if (LOCALES.includes(segments[0] as Locale)) {
      segments[0] = newLocale;
    } else {
      segments.unshift(newLocale);
    }
    router.push(`/${segments.join("/")}`);
  };

  return (
    <div className="relative">
      <button
        onClick={() => { setIsOpen(!isOpen); if (isOpen) setCountryQuery(""); }}
        className="flex items-center gap-2 rounded-full px-4 py-1.5 transition-all duration-300 backdrop-blur-md"
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
          (e.currentTarget as HTMLElement).style.borderColor = "rgba(192,132,240,0.5)";
          (e.currentTarget as HTMLElement).style.color = "#FFFFFF";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = "rgba(192,132,240,0.2)";
          (e.currentTarget as HTMLElement).style.color = "#E0E0FF";
        }}
      >
        <Globe className="h-3.5 w-3.5 shrink-0" />
        <span>{LANGUAGE_NAMES[locale]} / {flag}</span>
        <ChevronDown
          className={cn(
            "h-3 w-3 shrink-0 transition-transform duration-300",
            isOpen && "rotate-180"
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
            className="absolute left-1/2 -translate-x-1/2 top-full z-50 overflow-hidden"
            style={{
              marginTop: "8px",
              width: "min(240px, calc(100vw - 32px))",
              background: "rgba(13, 13, 30, 0.96)",
              border: "1px solid rgba(192,132,240,0.2)",
              backdropFilter: "blur(16px)",
            }}
          >
            <div className="flex border-b border-white/10" style={{ borderColor: "rgba(192,132,240,0.2)" }}>
              <button
                onClick={() => { setActiveTab("language"); setCountryQuery(""); }}
                className="flex-1 py-2 text-[11px] font-bold uppercase tracking-wider transition-colors"
                style={{
                  color: activeTab === "language" ? "#FFD700" : "#9999BB",
                  background: activeTab === "language" ? "rgba(192,132,240,0.1)" : "transparent",
                  fontFamily: "var(--font-body)"
                }}
              >
                  {t("language")}
                </button>
                <button
                  onClick={() => setActiveTab("country")}
                  className="flex-1 py-2 text-[11px] font-bold uppercase tracking-wider transition-colors border-s border-white/10"
                  style={{
                    color: activeTab === "country" ? "#FFD700" : "#9999BB",
                    background: activeTab === "country" ? "rgba(192,132,240,0.1)" : "transparent",
                    borderColor: "rgba(192,132,240,0.2)",
                    fontFamily: "var(--font-body)"
                  }}
                >
                  {t("country")}
              </button>
            </div>

            <div className="overflow-y-auto max-h-60" style={{ scrollbarWidth: 'thin' }}>
              {activeTab === "language" && LOCALES.map((l) => (
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
                    background: l === locale ? "rgba(192,132,240,0.1)" : "transparent",
                    border: "none",
                    cursor: "pointer",
                    borderBottom: "1px solid rgba(192,132,240,0.06)",
                  }}
                  onMouseEnter={(e) => {
                    if (l !== locale) {
                      (e.currentTarget as HTMLElement).style.background = "rgba(192,132,240,0.07)";
                      (e.currentTarget as HTMLElement).style.color = "#FFFFFF";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (l !== locale) {
                      (e.currentTarget as HTMLElement).style.background = "transparent";
                      (e.currentTarget as HTMLElement).style.color = "#E0E0FF";
                    }
                  }}
                >
                  {l === locale && (
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#FFD700", flexShrink: 0 }} />
                  )}
                  <span className={cn(l !== locale && "ms-[14px]")}>{LANGUAGE_NAMES[l]}</span>
                </button>
              ))}

              {activeTab === "country" && (
                <>
                  <div style={{ padding: "8px 12px", borderBottom: "1px solid rgba(192,132,240,0.1)" }}>
                    <input
                      type="text"
                      placeholder={t("searchCountries")}
                      value={countryQuery}
                      onChange={(e) => setCountryQuery(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "6px 10px",
                        fontFamily: "var(--font-body)",
                        fontSize: "12px",
                        background: "rgba(26,16,48,0.6)",
                        border: "1px solid rgba(192,132,240,0.2)",
                        color: "#E0E0FF",
                        outline: "none",
                      }}
                    />
                  </div>
                  {COUNTRIES.filter(
                    (c) =>
                      !countryQuery ||
                      c.name.toLowerCase().includes(countryQuery.toLowerCase()) ||
                      c.code.toLowerCase().includes(countryQuery.toLowerCase()),
                  ).map((c) => (
                    <button
                      key={c.code}
                      onClick={() => {
                        updateSettings({ country: c.code, timezone: c.timezones[0] });
                      }}
                      className="flex w-full items-center gap-3 text-start transition-all duration-200"
                      style={{
                        padding: "10px 16px",
                        fontFamily: "var(--font-body)",
                        fontSize: "13px",
                        fontWeight: c.code === settings.country ? 600 : 300,
                        color: c.code === settings.country ? "#FFD700" : "#E0E0FF",
                        background: c.code === settings.country ? "rgba(192,132,240,0.1)" : "transparent",
                        border: "none",
                        cursor: "pointer",
                        borderBottom: "1px solid rgba(192,132,240,0.06)",
                      }}
                      onMouseEnter={(e) => {
                        if (c.code !== settings.country) {
                          (e.currentTarget as HTMLElement).style.background = "rgba(192,132,240,0.07)";
                          (e.currentTarget as HTMLElement).style.color = "#FFFFFF";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (c.code !== settings.country) {
                          (e.currentTarget as HTMLElement).style.background = "transparent";
                          (e.currentTarget as HTMLElement).style.color = "#E0E0FF";
                        }
                      }}
                    >
                      <span>{c.flag}</span>
                      <span className="flex-1 truncate">{c.name}</span>
                      {c.code === settings.country && (
                        <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#FFD700", flexShrink: 0 }} />
                      )}
                    </button>
                  ))}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
