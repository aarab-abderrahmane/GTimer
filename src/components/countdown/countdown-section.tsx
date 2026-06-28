"use client";

import { useState, lazy, Suspense, useEffect, useRef } from "react";
import Image from "next/image";
import { Settings, Volume2, VolumeX } from "lucide-react";
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
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const t = useTranslations("countdown");
  const { country, timezone, timezoneOffset } = useCountry();
  const { settings, updateSettings } = useSettings();

  // Staggered scroll-reveal on mount
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (isNaN(RELEASE_DATE.getTime())) {
    return (
      <section className="flex min-h-screen items-center justify-center px-8">
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-subheading-sm)",
            color: "var(--color-pink)",
          }}
        >
          Countdown target date is invalid.
        </p>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      style={{ background: "transparent" }}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden"
    >
      {/* ── Ambient living background ── */}
      <BackgroundVideo src="/videos/background.mp4" />
      <BackgroundOverlay />

      {/* ── Ambient hue animation layer ── */}
      <div
        className="pointer-events-none fixed inset-0 -z-5"
        style={{
          animation: "hero-pulse 12s ease-in-out infinite",
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(192,132,240,0.08) 0%, transparent 70%)",
        }}
      />

      {/* ── Top-right utility controls ── */}
      <div
        className="fixed top-5 right-6 z-50 flex flex-wrap items-center justify-end gap-1"
        style={{ maxWidth: "calc(100vw - 140px)" }}
      >
        <LanguageSelector />
        <CountrySelector />
        <MusicPlayer />
        <VolumeSlider />
        <button
          onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
          className={cn(
            "flex items-center justify-center rounded-full p-2 backdrop-blur-md transition-all duration-300",
            settings.soundEnabled
              ? "text-[#E0E0FF] hover:text-white"
              : "text-[#9999BB] hover:text-[#E0E0FF]",
          )}
          aria-label={settings.soundEnabled ? "Mute sounds" : "Enable sounds"}
          style={{ cursor: "pointer" }}
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
          className="flex items-center justify-center rounded-full p-2 backdrop-blur-md transition-all duration-300 hover:text-white"
          aria-label="Open settings"
          style={{ color: "#E0E0FF", cursor: "pointer" }}
        >
          <Settings className="h-4 w-4" />
        </button>
      </div>

      {/* ── Main content ── */}
      <div
        className="relative z-10 flex flex-col items-center px-6 text-center"
        style={{ paddingTop: "80px", paddingBottom: "48px", width: "100%" }}
      >

        {/* Eyebrow label — gold, tracked */}
        <div
          className={cn(
            "mb-6 transition-all duration-700",
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
          style={{ transitionDelay: "0ms" }}
        >
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--color-gold)",
            }}
          >
            COMING NOVEMBER 19, 2026
          </span>
        </div>

        {/* Hero headline */}
        <h1
          className={cn(
            "mb-4 transition-all duration-700",
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(56px, 10vw, 96px)",
            fontWeight: 800,
            letterSpacing: "0.03em",
            textTransform: "uppercase",
            lineHeight: 1,
            color: "#FFFFFF",
            transitionDelay: "100ms",
          }}
        >
          {heading}
        </h1>

        {/* Sub-headline (Logos) */}
        <div
          className={cn(
            "mb-12 flex justify-center transition-all duration-700",
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
          style={{ transitionDelay: "200ms" }}
        >
          <Image
            src="/images/platforms.png"
            alt="PlayStation 5 and Xbox Series X|S"
            width={300}
            height={80}
            style={{ objectFit: "contain" }}
          />
        </div>

        {/* Countdown digits */}
        <div
          className={cn(
            "transition-all duration-700",
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
          style={{ transitionDelay: "300ms" }}
        >
          <Countdown />
        </div>

        {/* Release date + timezone */}
        <div
          className={cn(
            "mt-10 flex flex-col items-center gap-2 transition-all duration-700",
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
          style={{ transitionDelay: "400ms" }}
        >
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "14px",
              fontWeight: 300,
              color: "#E0E0FF",
            }}
          >
            {t("releaseDate")}: {releaseDate}
          </p>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "12px",
              color: "#9999BB",
            }}
          >
            {country.flag} {timezone} ({timezoneOffset})
          </p>
        </div>

        {/* QR toggle + Pre-Order CTA */}
        <div
          className={cn(
            "mt-10 flex flex-wrap items-center justify-center gap-4 transition-all duration-700",
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
          style={{ transitionDelay: "500ms" }}
        >
          {/* Primary CTA — hot pink pill */}
          <a
            href="https://www.rockstargames.com/VI"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden rounded-full px-8 py-3 transition-all duration-300"
            style={{
              background: "var(--color-pink)",
              fontFamily: "var(--font-body)",
              fontSize: "13px",
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              color: "#FFFFFF",
              textDecoration: "none",
              animation: "glow-pulse 3s ease-in-out infinite",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.filter = "brightness(1.1)";
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 0 24px rgba(255, 107, 157, 0.45)";
              (e.currentTarget as HTMLElement).style.animation = "none";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.filter = "";
              (e.currentTarget as HTMLElement).style.boxShadow = "";
              (e.currentTarget as HTMLElement).style.animation =
                "glow-pulse 3s ease-in-out infinite";
            }}
          >
            Pre-Order Now
          </a>

          {/* Ghost QR link */}
          <button
            onClick={() => setShowQR(!showQR)}
            className="group flex items-center gap-2 transition-all duration-300"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "13px",
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              color: "#E0E0FF",
              opacity: 0.7,
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.opacity = "1";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.opacity = "0.7";
            }}
          >
            {showQR ? "Hide QR" : "Share QR"} →
          </button>
        </div>

        {/* QR code */}
        {showQR && (
          <div className="mt-8">
            <Suspense
              fallback={
                <div
                  className="animate-pulse"
                  style={{
                    width: 144,
                    height: 144,
                    background: "var(--color-bg-elevated)",
                  }}
                />
              }
            >
              <QRCode size={120} />
            </Suspense>
          </div>
        )}
      </div>

      {/* ── Settings modal ── */}
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
