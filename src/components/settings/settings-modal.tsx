"use client";

import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSettings } from "@/contexts/settings-context";
import { MusicPlayer } from "@/components/audio/music-player";
import { VolumeSlider } from "@/components/audio/volume-slider";
import { LOCALES, type Locale } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LANGUAGE_NAMES: Record<Locale, string> = {
  en: "English",
  fr: "Français",
  es: "Español",
  "pt-BR": "Português (Brasil)",
  de: "Deutsch",
  it: "Italiano",
  ja: "日本語",
  ko: "한국어",
  "zh-CN": "简体中文",
  "zh-TW": "繁體中文",
  ar: "العربية",
};

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const t = useTranslations("settings");
  const { settings, updateSettings } = useSettings();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-[6.25px]"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-md overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] bg-[var(--color-surface)]/95 backdrop-blur-[12px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-[var(--spacing-xl)] pt-[var(--spacing-xl)]">
              <h2 className="font-[family-name:var(--font-display)] text-[var(--text-subheading-sm)] text-[var(--color-content)]">
                Settings
              </h2>
              <button
                onClick={onClose}
                className="rounded-full p-[var(--spacing-xs)] text-[var(--color-content-secondary)] transition-colors hover:text-[var(--color-content)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-col gap-[var(--spacing-lg)] px-[var(--spacing-xl)] py-[var(--spacing-xl)]">
              <SettingRow label={t("language")}>
                <select
                  value={settings.language}
                  onChange={(e) =>
                    updateSettings({ language: e.target.value as Locale })
                  }
                  className="rounded-[var(--radius-pill)] border border-[var(--color-border-subtle)] bg-[var(--color-surface-alt)] px-[var(--spacing-md)] py-[var(--spacing-xs)] text-[var(--text-body)] text-[var(--color-content)] outline-none transition-colors focus:border-[var(--color-accent)]"
                >
                  {LOCALES.map((locale) => (
                    <option key={locale} value={locale}>
                      {LANGUAGE_NAMES[locale]}
                    </option>
                  ))}
                </select>
              </SettingRow>

              <SettingRow label={t("music")}>
                <MusicPlayer />
              </SettingRow>

              <SettingRow label={t("volume")}>
                <VolumeSlider />
              </SettingRow>

              <SettingRow label={t("sound")}>
                <ToggleSwitch
                  enabled={settings.soundEnabled}
                  onChange={(v) => updateSettings({ soundEnabled: v })}
                />
              </SettingRow>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SettingRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-[family-name:var(--font-body)] text-[var(--text-body)] text-[var(--color-content-secondary)]">
        {label}
      </span>
      {children}
    </div>
  );
}

function ToggleSwitch({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={cn(
        "relative h-5 w-9 rounded-full transition-colors",
        enabled
          ? "bg-[var(--color-accent)]"
          : "bg-[var(--color-border-subtle)]",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform",
          enabled ? "translate-x-[18px]" : "translate-x-[2px]",
        )}
      />
    </button>
  );
}
