"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Download } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useSettings } from "@/contexts/settings-context";

export function ExtensionPopup() {
  const t = useTranslations("extension");
  const { settings, updateSettings } = useSettings();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (settings.popupDismissed) return;

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, [settings.popupDismissed]);

  const handleDismiss = () => {
    setIsVisible(false);
    updateSettings({ popupDismissed: true });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-[var(--spacing-xl)] right-[var(--spacing-xl)] z-40 max-sm:bottom-[var(--spacing-md)] max-sm:right-[var(--spacing-md)] max-sm:left-[var(--spacing-md)]"
        >
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] bg-[var(--color-surface)]/95 p-[var(--spacing-lg)] backdrop-blur-[12px] max-sm:w-full">
            <button
              onClick={handleDismiss}
              className="absolute right-[var(--spacing-sm)] top-[var(--spacing-sm)] rounded-full p-[2px] text-[var(--color-content-secondary)] transition-colors hover:text-[var(--color-content)]"
            >
              <X className="h-3 w-3" />
            </button>

            <div className="flex flex-col gap-[var(--spacing-md)]">
              <div className="flex items-center gap-[var(--spacing-md)]">
                <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-accent)]/20">
                  <Download className="h-5 w-5 text-[var(--color-accent)]" />
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-[var(--text-body)] text-[var(--color-content)]">
                    {t("title")}
                  </h3>
                  <p className="font-[family-name:var(--font-body)] text-[var(--text-caption)] text-[var(--color-content-secondary)]">
                    {t("description")}
                  </p>
                </div>
              </div>

              <div className="flex gap-[var(--spacing-sm)]">
                <Link
                  href="/extension"
                  className="flex-1 rounded-[var(--radius-pill)] bg-[var(--color-button-surface)] px-[var(--spacing-md)] py-[var(--spacing-sm)] text-center font-[family-name:var(--font-body)] text-[var(--text-body)] text-[var(--color-surface)] transition-transform hover:scale-[1.02]"
                >
                  {t("cta")}
                </Link>
                <button
                  onClick={handleDismiss}
                  className="rounded-[var(--radius-pill)] border border-[var(--color-border-subtle)] px-[var(--spacing-md)] py-[var(--spacing-sm)] font-[family-name:var(--font-body)] text-[var(--text-caption)] text-[var(--color-content-secondary)] transition-colors hover:text-[var(--color-content)]"
                >
                  {t("dismiss")}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
