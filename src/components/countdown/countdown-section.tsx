"use client";

import { useState, lazy, Suspense } from "react";
import { Settings, Volume2, VolumeX } from "lucide-react";
import { BackgroundImage } from "@/components/background/background-image";
import { BackgroundVideo } from "../background/background-video";
import { BackgroundOverlay } from "@/components/background/background-overlay";
import { Countdown } from "@/components/countdown/countdown";
import { MusicPlayer } from "@/components/audio/music-player";
import { VolumeSlider } from "@/components/audio/volume-slider";
import { ShareButton } from "@/components/share/share-button";
import { LanguageSelector } from "@/components/localization/language-selector";
import { CountrySelector } from "@/components/localization/country-selector";
import { useCountry } from "@/hooks/use-country";
import { useSettings } from "@/contexts/settings-context";
import { RELEASE_DATE } from "@/lib/constants";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

const SettingsModal = lazy(() =>
  import("@/components/settings/settings-modal").then((m) => ({
    default: m.SettingsModal,
  })),
);

const QRCode = lazy(() =>
  import("@/components/share/qr-code").then((m) => ({ default: m.QRCode })),
);

const ExtensionPopup = lazy(() =>
  import("@/components/extension/install-popup").then((m) => ({
    default: m.ExtensionPopup,
  })),
);

interface CountdownSectionProps {
  heading: string;
  subheading: string;
  releaseDate: string;
}

export function CountdownSection({
  heading,
  subheading,
  releaseDate,
}: CountdownSectionProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const t = useTranslations("countdown");
  const { country, timezone, timezoneOffset } = useCountry();
  const { settings, updateSettings } = useSettings();

  if (isNaN(RELEASE_DATE.getTime())) {
    return (
      <section className="flex min-h-screen items-center justify-center px-[var(--spacing-xl)]">
        <p className="font-[family-name:var(--font-body)] text-[var(--text-subheading-sm)] text-[var(--color-accent-warm)]">
          Countdown target date is invalid.
        </p>
      </section>
    );
  }

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-[var(--spacing-xl)] motion-safe:animate-fade-in max-sm:px-[var(--spacing-md)]">
      {/* <BackgroundImage  src="/images/background.jpg" /> */}
      <BackgroundVideo src="/videos/background.mp4" />
      <BackgroundOverlay />

      <div className="fixed top-4 right-4 z-30 flex items-center gap-[var(--spacing-sm)] max-sm:top-2 max-sm:right-2">
        <LanguageSelector />
        <CountrySelector />
        <MusicPlayer />
        <VolumeSlider />
        <button
          onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
          className={cn(
            "rounded-[var(--radius-pill)] p-[var(--spacing-sm)] backdrop-blur-[6.25px] transition-colors",
            settings.soundEnabled
              ? "text-[var(--color-content-secondary)] hover:text-[var(--color-content)]"
              : "text-[var(--color-border-subtle)]",
          )}
          aria-label={settings.soundEnabled ? "Mute sounds" : "Enable sounds"}
        >
          {settings.soundEnabled ? (
            <Volume2 className="h-4 w-4" />
          ) : (
            <VolumeX className="h-4 w-4" />
          )}
        </button>
        <ShareButton />
        <button
          onClick={() => setSettingsOpen(true)}
          className="rounded-[var(--radius-pill)] p-[var(--spacing-sm)] text-[var(--color-content-secondary)] backdrop-blur-[6.25px] transition-colors hover:text-[var(--color-content)]"
          aria-label="Open settings"
        >
          <Settings className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-col items-center gap-[var(--spacing-2xl)] text-center">
        <h1 className="font-[family-name:var(--font-display)] text-[var(--text-hero)] text-[var(--color-accent-warm)] leading-none tracking-[-1.28px] max-sm:text-5xl">
          {heading}
        </h1>
        <p className="font-[family-name:var(--font-body)] text-[var(--text-subheading-sm)] text-[var(--color-content-secondary)] max-sm:text-base">
          {subheading}
        </p>
        <Countdown />
        <div className="flex flex-col items-center gap-[var(--spacing-sm)]">
          <p className="font-[family-name:var(--font-body)] text-[var(--text-body)] text-[var(--color-content-secondary)]">
            {t("releaseDate")}: {releaseDate}
          </p>
          <p className="font-[family-name:var(--font-body)] text-[var(--text-caption)] text-[var(--color-accent-sky)]">
            {country.flag} {timezone} ({timezoneOffset})
          </p>
        </div>

        {showQR && (
          <Suspense
            fallback={
              <div className="h-[144px] w-[144px] animate-pulse rounded-[var(--radius-md)] bg-[var(--color-surface-alt)]" />
            }
          >
            <QRCode size={120} />
          </Suspense>
        )}
        <button
          onClick={() => setShowQR(!showQR)}
          className="font-[family-name:var(--font-body)] text-[var(--text-caption)] text-[var(--color-accent)] underline underline-offset-4 hover:text-[var(--color-content)]"
        >
          {showQR ? "Hide QR" : "Show QR"}
        </button>
      </div>

      {settingsOpen && (
        <Suspense fallback={null}>
          <SettingsModal
            isOpen={settingsOpen}
            onClose={() => setSettingsOpen(false)}
          />
        </Suspense>
      )}

      <Suspense fallback={null}>
        <ExtensionPopup />
      </Suspense>
    </section>
  );
}
