"use client";

import { useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useAudio } from "@/contexts/audio-context";
import { cn } from "@/lib/utils";
import { getDirection } from "@/lib/direction";

interface SlideoutNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const links = [
  { href: "", label: "home" },
  { href: "/extension", label: "extension" },
];

export function SlideoutNav({ isOpen, onClose }: SlideoutNavProps) {
  const t = useTranslations("nav");
  const ts = useTranslations("settings");
  const locale = useLocale();
  const isRTL = getDirection(locale) === "rtl";
  const pathname = usePathname();
  const { isPlaying, toggle } = useAudio();

  const isActive = useCallback(
    (href: string) => {
      if (href === "") {
        return (
          pathname === `/${href}` ||
          pathname === `/${href}/` ||
          pathname.split("/").filter(Boolean).length === 1
        );
      }
      return pathname.includes(href);
    },
    [pathname],
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/60"
            onClick={onClose}
          />
          <motion.nav
            initial={{ x: isRTL ? "-100%" : "100%" }}
            animate={{ x: 0 }}
            exit={{ x: isRTL ? "-100%" : "100%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 end-0 z-50 flex h-full w-1/2 flex-col bg-[var(--color-surface-alt)] max-sm:w-full"
          >
            <div className="flex items-center justify-end p-[var(--spacing-page-edge)]">
              <button
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-[var(--color-text-primary)] transition-colors hover:bg-white/25"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-1 flex-col justify-center gap-[var(--spacing-xl)] px-[var(--spacing-page-edge)]">
              {links.map(({ href, label }) => {
                const active = isActive(href);
                return (
                  <Link
                    key={href}
                    href={href || "/"}
                    onClick={onClose}
                    className={cn(
                      "font-[family-name:var(--font-display)] text-3xl uppercase leading-none tracking-[0.03em] transition-colors sm:text-[28px] sm:leading-[1.1]",
                      active
                        ? "text-[var(--color-accent-gold)]"
                        : "text-[var(--color-accent-lavender)] hover:text-[var(--color-accent-gold)]",
                    )}
                  >
                    {t(label)}
                    {active && (
                      <span className="ms-[var(--spacing-sm)] text-[var(--color-accent-gold)]">
                        ›
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center gap-[var(--spacing-lg)] px-[var(--spacing-page-edge)] pb-[var(--spacing-xl)]">
              <button
                onClick={toggle}
                className={cn(
                  "rounded-[var(--radius-pill)] px-[var(--spacing-lg)] py-[var(--spacing-sm)] text-xs uppercase tracking-[0.15em] transition-colors",
                  isPlaying
                    ? "bg-[var(--color-accent-gold)]/20 text-[var(--color-accent-gold)]"
                    : "bg-white/10 text-[var(--color-text-caption)] hover:text-[var(--color-text-primary)]",
                )}
              >
                {isPlaying ? ts("musicOn") : ts("musicOff")}
              </button>
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}
