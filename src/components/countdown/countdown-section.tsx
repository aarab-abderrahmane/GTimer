"use client";

import { useState, lazy, Suspense, useEffect, useRef } from "react";
import { BackgroundVideo } from "../background/background-video";
import { BackgroundOverlay } from "@/components/background/background-overlay";
import { Countdown } from "@/components/countdown/countdown";
import { VILoader } from "@/components/countdown/vi-loader";
import { CopyLink } from "@/components/share/copy-link";
import { useCountry } from "@/hooks/use-country";

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
  const { country, timezone, timezoneOffset } = useCountry();

  // Staggered scroll-reveal on mount
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{ background: "transparent" }}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden"
    >
      {/* ── Background ── */}
      <BackgroundVideo src="/videos/background.mp4" />
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
              color: "#FFD700",
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
          style={{ transitionDelay: "300ms", width: "100%", maxWidth: "400px" }}
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
          <Countdown />
        </div>

        {/* Release date + timezone */}
        <div
          className={cn(
            "mt-10 flex flex-col items-center gap-2 transition-all duration-700",
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
          style={{ transitionDelay: "500ms" }}
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

        {/* CTA Row: Pre-Order + Copy Link */}
        <div className="flex flex-col items-center gap-4 mt-10">
          <div
            className={cn(
              "flex flex-wrap items-center justify-center gap-6 transition-all duration-700",
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
            )}
            style={{ transitionDelay: "600ms" }}
          >
            {/* Primary CTA — hot pink pill */}
            <a
              href="https://www.rockstargames.com/VI"
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
              Pre-Order Now
            </a>

            <CopyLink />
          </div>

          {/* Share QR — below the two buttons */}
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
            {showQR ? "Hide QR" : "Share QR"}
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
