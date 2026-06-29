"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { Locale } from "@/lib/constants";

export interface Settings {
  language: Locale;
  country: string;
  timezone: string;
  volume: number;
  musicEnabled: boolean;
  soundEnabled: boolean;
  popupDismissed: boolean;
}

interface SettingsContextValue {
  settings: Settings;
  updateSettings: (partial: Partial<Settings>) => void;
}

const defaultSettings: Settings = {
  language: "en",
  country: "US",
  timezone: "",
  volume: 50,
  musicEnabled: false,
  soundEnabled: true,
  popupDismissed: false,
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

const STORAGE_KEY = "gtimer-settings";

function loadSettings(): Settings {
  if (typeof window === "undefined") return defaultSettings;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...defaultSettings, ...JSON.parse(stored) };
    }
  } catch {}
  return defaultSettings;
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(loadSettings);

  useEffect(() => {
    if (!settings.timezone && typeof window !== "undefined") {
      try {
        const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
        setSettings((prev) => ({ ...prev, timezone: detected }));
      } catch {}
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {}
  }, [settings]);

  const updateSettings = useCallback((partial: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
