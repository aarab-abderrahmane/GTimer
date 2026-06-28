"use client";

import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSettings } from "@/contexts/settings-context";
import { MusicPlayer } from "@/components/audio/music-player";
import { VolumeSlider } from "@/components/audio/volume-slider";
import { LOCALES, type Locale } from "@/lib/constants";

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
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            background: "rgba(6, 6, 16, 0.75)",
            backdropFilter: "blur(10px)",
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-md overflow-hidden"
            style={{
              background: "rgba(26, 16, 48, 0.95)",
              border: "1px solid rgba(192, 132, 240, 0.2)",
              backdropFilter: "blur(16px)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between"
              style={{
                padding: "24px 28px 20px",
                borderBottom: "1px solid rgba(192, 132, 240, 0.12)",
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "28px",
                  fontWeight: 800,
                  letterSpacing: "0.03em",
                  textTransform: "uppercase",
                  color: "#FFFFFF",
                  margin: 0,
                  lineHeight: 1,
                }}
              >
                Settings
              </h2>
              <button
                onClick={onClose}
                className="flex items-center justify-center rounded-full p-2 transition-all duration-300"
                style={{
                  color: "#9999BB",
                  background: "rgba(192,132,240,0.08)",
                  border: "none",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "#FFFFFF";
                  (e.currentTarget as HTMLElement).style.background =
                    "rgba(192,132,240,0.18)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "#9999BB";
                  (e.currentTarget as HTMLElement).style.background =
                    "rgba(192,132,240,0.08)";
                }}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div
              className="flex flex-col"
              style={{ gap: "0", padding: "8px 0" }}
            >
              <SettingRow label={t("language")}>
                <select
                  value={settings.language}
                  onChange={(e) =>
                    updateSettings({ language: e.target.value as Locale })
                  }
                  style={{
                    background: "rgba(6,6,16,0.7)",
                    border: "1px solid rgba(192,132,240,0.25)",
                    borderRadius: "50px",
                    padding: "6px 16px",
                    fontFamily: "var(--font-body)",
                    fontSize: "13px",
                    fontWeight: 400,
                    color: "#E0E0FF",
                    outline: "none",
                    cursor: "pointer",
                    transition: "border-color 300ms",
                  }}
                  onFocus={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "#C084F0";
                  }}
                  onBlur={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "rgba(192,132,240,0.25)";
                  }}
                >
                  {LOCALES.map((locale) => (
                    <option
                      key={locale}
                      value={locale}
                      style={{
                        background: "#1a1030",
                        color: "#E0E0FF",
                      }}
                    >
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
    <div
      className="flex items-center justify-between"
      style={{
        padding: "16px 28px",
        borderBottom: "1px solid rgba(192, 132, 240, 0.08)",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "13px",
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#9999BB",
        }}
      >
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
      className="relative transition-all duration-300"
      style={{
        width: "40px",
        height: "22px",
        borderRadius: "50px",
        background: enabled ? "#C084F0" : "rgba(42, 26, 64, 0.9)",
        border: "1px solid rgba(192,132,240,0.3)",
        cursor: "pointer",
        outline: "none",
        transition: "background 300ms cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: "2px",
          left: enabled ? "20px" : "2px",
          width: "16px",
          height: "16px",
          borderRadius: "50%",
          background: "#FFFFFF",
          transition: "left 300ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      />
    </button>
  );
}
