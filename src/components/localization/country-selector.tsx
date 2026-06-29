"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, MapPin, Search } from "lucide-react";
import { COUNTRIES, getCountryFlag } from "@/lib/countries";
import { useSettings } from "@/contexts/settings-context";
import { cn } from "@/lib/utils";

export function CountrySelector() {
  const { settings, updateSettings } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  const flag = getCountryFlag(settings.country);

  const filtered = query
    ? COUNTRIES.filter(
        (c) =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.code.toLowerCase().includes(query.toLowerCase()),
      )
    : COUNTRIES;

  return (
    <div className="relative">
      <button
        onClick={() => { setIsOpen(!isOpen); if (isOpen) setQuery(""); }}
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
            className="absolute right-0 top-full z-50 overflow-hidden"
            style={{
              marginTop: "8px",
              width: "220px",
              background: "rgba(13, 13, 30, 0.96)",
              border: "1px solid rgba(192,132,240,0.2)",
              backdropFilter: "blur(16px)",
            }}
          >
            <div style={{ padding: "8px 12px", borderBottom: "1px solid rgba(192,132,240,0.1)" }}>
              <div className="relative flex items-center">
                <Search className="absolute left-2 h-3.5 w-3.5" style={{ color: "#9999BB" }} />
                <input
                  type="text"
                  placeholder="Search countries..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "6px 10px 6px 28px",
                    fontFamily: "var(--font-body)",
                    fontSize: "12px",
                    background: "rgba(26,16,48,0.6)",
                    border: "1px solid rgba(192,132,240,0.2)",
                    color: "#E0E0FF",
                    outline: "none",
                  }}
                />
              </div>
            </div>
            <div
              className="overflow-y-auto"
              style={{ maxHeight: "200px", scrollbarWidth: "thin" }}
            >
              {filtered.length === 0 && (
                <p
                  style={{
                    padding: "16px",
                    fontFamily: "var(--font-body)",
                    fontSize: "12px",
                    color: "#9999BB",
                    textAlign: "center",
                  }}
                >
                  No countries found
                </p>
              )}
              {filtered.map((country) => (
                <button
                  key={country.code}
                  onClick={() => {
                    updateSettings({ country: country.code, timezone: country.timezones[0] });
                    setIsOpen(false);
                    setQuery("");
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
