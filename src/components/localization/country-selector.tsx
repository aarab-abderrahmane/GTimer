"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, MapPin } from "lucide-react";
import { COUNTRIES, getCountryFlag } from "@/lib/countries";
import { useSettings } from "@/contexts/settings-context";
import { cn } from "@/lib/utils";

export function CountrySelector() {
  const { settings, updateSettings } = useSettings();
  const [isOpen, setIsOpen] = useState(false);

  const flag = getCountryFlag(settings.country);

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
        <MapPin className="h-3.5 w-3.5 shrink-0" />
        <span>{flag}</span>
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
            className="absolute right-0 top-full z-50 overflow-y-auto"
            style={{
              marginTop: "8px",
              maxHeight: "240px",
              width: "192px",
              background: "rgba(13, 13, 30, 0.96)",
              border: "1px solid rgba(192,132,240,0.2)",
              backdropFilter: "blur(16px)",
            }}
          >
            {COUNTRIES.map((country) => (
              <button
                key={country.code}
                onClick={() => {
                  updateSettings({ country: country.code });
                  setIsOpen(false);
                }}
                className="flex w-full items-center gap-3 text-left transition-all duration-200"
                style={{
                  padding: "10px 16px",
                  fontFamily: "var(--font-body)",
                  fontSize: "13px",
                  fontWeight: country.code === settings.country ? 600 : 300,
                  color:
                    country.code === settings.country ? "#FFD700" : "#E0E0FF",
                  background:
                    country.code === settings.country
                      ? "rgba(192,132,240,0.1)"
                      : "transparent",
                  border: "none",
                  cursor: "pointer",
                  borderBottom: "1px solid rgba(192,132,240,0.06)",
                }}
                onMouseEnter={(e) => {
                  if (country.code !== settings.country) {
                    (e.currentTarget as HTMLElement).style.background =
                      "rgba(192,132,240,0.07)";
                    (e.currentTarget as HTMLElement).style.color = "#FFFFFF";
                  }
                }}
                onMouseLeave={(e) => {
                  if (country.code !== settings.country) {
                    (e.currentTarget as HTMLElement).style.background =
                      "transparent";
                    (e.currentTarget as HTMLElement).style.color = "#E0E0FF";
                  }
                }}
              >
                <span>{country.flag}</span>
                <span className="flex-1 truncate">{country.name}</span>
                {country.code === settings.country && (
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
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
