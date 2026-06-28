"use client";

import { useCountdown } from "@/hooks/use-countdown";
import { AnimatedDigit } from "./animated-digit";
import { useTranslations } from "next-intl";

export function Countdown() {
  const time = useCountdown();
  const t = useTranslations("countdown");

  if (time.isReleased) {
    return (
      <div className="flex flex-col items-center gap-6">
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(48px, 8vw, 80px)",
            fontWeight: 800,
            letterSpacing: "0.03em",
            textTransform: "uppercase",
            lineHeight: 1,
            color: "#FFD700",
            textAlign: "center",
          }}
        >
          {t("released")}
        </h2>
      </div>
    );
  }

  return (
    <div
      className="flex flex-wrap items-end justify-center"
      style={{ gap: "clamp(8px, 2vw, 20px)" }}
    >
      <AnimatedDigit value={time.days}    label={t("days")} />
      <AnimatedDigit value={time.hours}   label={t("hours")} />
      <AnimatedDigit value={time.minutes} label={t("minutes")} />
      <AnimatedDigit value={time.seconds} label={t("seconds")} />

      {/* Milliseconds — accent teal, same card style */}
      <div className="flex flex-col items-center" style={{ gap: "10px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(26, 16, 48, 0.85)",
            borderTop: "1px solid rgba(192, 132, 240, 0.15)",
            borderLeft: "1px solid rgba(192, 132, 240, 0.08)",
            width: "clamp(64px, 9vw, 90px)",
            height: "clamp(72px, 10vw, 100px)",
            backdropFilter: "blur(8px)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* top edge glow */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "1px",
              background:
                "linear-gradient(90deg, transparent, rgba(0,212,170,0.5), transparent)",
              pointerEvents: "none",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(24px, 3.5vw, 38px)",
              fontWeight: 800,
              letterSpacing: "0.03em",
              lineHeight: 1,
              color: "#00D4AA",
            }}
          >
            {time.milliseconds.toString().padStart(3, "0")}
          </span>
        </div>
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#FFD700",
          }}
        >
          {t("milliseconds")}
        </span>
      </div>
    </div>
  );
}
