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
        className="flex items-center gap-[var(--spacing-sm)] rounded-[var(--radius-pill)] px-[var(--spacing-md)] py-[var(--spacing-xs)] text-[var(--text-body)] text-[var(--color-content-secondary)] backdrop-blur-[6.25px] transition-colors hover:text-[var(--color-content)]"
      >
        <MapPin className="h-4 w-4" />
        <span>{flag}</span>
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
            className="absolute right-0 top-full z-50 mt-[var(--spacing-sm)] max-h-64 w-48 overflow-y-auto rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] bg-[var(--color-surface)]/95 backdrop-blur-[12px]"
          >
            {COUNTRIES.map((country) => (
              <button
                key={country.code}
                onClick={() => {
                  updateSettings({ country: country.code });
                  setIsOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-[var(--spacing-md)] px-[var(--spacing-md)] py-[var(--spacing-sm)] text-left text-[var(--text-body)] transition-colors",
                  country.code === settings.country
                    ? "text-[var(--color-accent)] bg-[var(--color-accent)]/10"
                    : "text-[var(--color-content-secondary)] hover:text-[var(--color-content)] hover:bg-[var(--color-surface-alt)]",
                )}
              >
                <span>{country.flag}</span>
                <span className="flex-1 truncate">{country.name}</span>
                {country.code === settings.country && (
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
