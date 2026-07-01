"use client";

import { useState, lazy, Suspense, useEffect, useRef, useMemo } from "react";
import { BackgroundVideo } from "../background/background-video";
import { BackgroundOverlay } from "@/components/background/background-overlay";
import { Countdown } from "@/components/countdown/countdown";
import { VILoader } from "@/components/countdown/vi-loader";
import { CopyLink } from "@/components/share/copy-link";
import { ScreenshotButton } from "@/components/share/screenshot-button";
import { useCountry } from "@/hooks/use-country";
import { useCountdown } from "@/hooks/use-countdown";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

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
  releaseDate: string;
}

export function CountdownSection({
  heading,
  releaseDate,
}: CountdownSectionProps) {
  const [showQR, setShowQR] = useState(false);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const t = useTranslations("countdown");
  const ts = useTranslations("share");
  const { country, timezone, timezoneOffset } = useCountry();
  const time = useCountdown();

  const screenshotData = useMemo(() => ({
    days: time.days,
    hours: time.hours,
    minutes: time.minutes,
    seconds: time.seconds,
    timezone,
    timezoneOffset,
    countryFlag: country.flag,
    logoUrl: "/images/gta-vi-logo.png" 
  }), [time.days, time.hours, time.minutes, time.seconds, timezone, timezoneOffset, country.flag]);

  // Staggered scroll-reveal on mount
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{ background: "transparent" }}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden pt-4"
    >
      {/* ── Background ── */}
      <BackgroundVideo src="https://github.com/aabderahman190-oss/gtimer_video/releases/download/v1.0/0701.mp4" poster="/images/background.jpg" />
      <BackgroundOverlay />

      {/* ── Ambient hue animation layer ── */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          zIndex: -1,
          animation: "hero-pulse 12s ease-in-out infinite",
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(192,132,240,0.08) 0%, transparent 70%)",
        }}
      />

      {/* ── Main content ── */}
      <div
        className="relative z-10 flex flex-col items-center px-6 text-center"
        style={{ paddingTop: "clamp(56px, 10vw, 80px)", paddingBottom: "clamp(32px, 6vw, 48px)", width: "100%" }}
      >
        {/* Eyebrow label — gold, tracked */}
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(18px, 2.5vw, 24px)",
              fontWeight: 700,
              letterSpacing: "0.05em",
              color: "#FFD700",
              margin: 0,
              lineHeight: 1.3,
            }}
          >
            {t('comingDate')}
          </p>

          <div
            style={{
              width: "clamp(40px, 6vw, 60px)",
              height: "1px",
              background:
                "linear-gradient(90deg, transparent, rgba(255,215,0,0.5), transparent)",
            }}
          />

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

        {/* Platform logos */}
        {/* <div
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
        </div> */}

        {/* VI Loader Animation */}
        <div
          className={cn(
            "mb-6 transition-all duration-700",
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
          style={{ transitionDelay: "300ms", width: "100%", maxWidth: "clamp(280px, 50vw, 400px)" }}
        >
          <VILoader />
        </div>

        {/* Countdown digits */}
        <div
          className={cn(
            "transition-all duration-700",
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
          style={{ transitionDelay: "400ms" }}
        >
          <Countdown time={time} />
        </div>

        {/* Release date + timezone */}
        <div
          className={cn(
            "mt-10 flex flex-col items-center gap-4 transition-all duration-700",
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
          style={{ transitionDelay: "500ms" }}
        >
        

          <div
            className="flex items-center gap-2"
            style={{
              background: "rgba(0, 0, 0, 0.2)",
              borderRadius: "50px",
              padding: "6px 16px",
              backdropFilter: "blur(8px)",
            }}
          >
            <span style={{ fontSize: "16px", lineHeight: 1 }}>
              {country.flag}
            </span>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "12px",
                fontWeight: 600,
                color: "#E0E0FF",
              }}
            >
              {timezone}
            </span>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "11px",
                fontWeight: 400,
                color: "#9999BB",
              }}
            >
              ({timezoneOffset})
            </span>
          </div>
        </div>

        {/* CTA Row: Pre-Order + button group */}
        <div className="flex flex-col items-center gap-4 mt-10">
          <div
            className={cn(
              "flex flex-wrap items-center justify-center gap-4 transition-all duration-700",
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
            )}
            style={{ transitionDelay: "600ms" }}
          >
            {/* Primary CTA — hot pink pill */}
            <a
              href="https://www.amazon.com/Midnight-1-PlayStation-5/dp/B0H6K928WL?sr=8-2&language=en_US&ref_=as_li_ss_tl"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-full px-8 py-3 transition-all duration-300"
              style={{
                background: "#FF6B9D",
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
              {t("preOrder")}
            </a>

            {/* Button group: Screenshot + Copy Link */}
            <div
              className="flex items-center px-2 py-3.5 overflow-hidden rounded-full"
              style={{
                background: "rgba(26, 16, 48, 0.21)",
                border: "1px solid rgba(191, 132, 240, 0.14)",
                backdropFilter: "blur(8px)",
              }}
            >
              <ScreenshotButton data={screenshotData} />
              <div
                style={{
                  width: "1px",
                  height: "20px",
                  background: "rgba(192,132,240,0.2)",
                  flexShrink: 0,
                }}
              />
              <CopyLink />
            </div>
          </div>

          {/* Share QR — below */}
          <button
            onClick={() => setShowQR(!showQR)}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#9999BB",
              background: "none",
              border: "none",
              cursor: "pointer",
              marginTop: "4px",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = "#E0E0FF";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = "#9999BB";
            }}
          >
            {showQR ? ts("hideQR") : ts("shareQR")}
          </button>
        </div>

        {/* QR code */}
        {showQR && (
          <div className="mt-6">
            <Suspense
              fallback={
                <div
                  className="animate-pulse"
                  style={{ width: 144, height: 144, background: "rgba(26,16,48,0.8)" }}
                />
              }
            >
              <QRCode size={120} />
            </Suspense>
          </div>
        )}
      </div>

      <Suspense fallback={null}>
        <ExtensionPopup />
      </Suspense>
    </section>
  );
}
