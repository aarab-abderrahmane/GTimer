"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import { useCountdown } from "@/hooks/use-countdown";
import { AnimatedDigit } from "./animated-digit";
import { useTranslations } from "next-intl";
import { useTickSound, useTick2Sound } from "@/components/audio/sound-effects";
import { SOUND_EFFECTS } from "@/lib/music";
import { useSettings } from "@/contexts/settings-context";

function FinalSeconds({ seconds, onTick }: { seconds: number; onTick: () => void }) {
  const prevRef = useRef(seconds);
  const onTickRef = useRef(onTick);
  const isLastTen = seconds <= 10;

  useEffect(() => {
    onTickRef.current = onTick;
  });

  useEffect(() => {
    if (seconds !== prevRef.current) {
      prevRef.current = seconds;
      onTickRef.current();
    }
  });

  return (
    <div className="flex flex-col items-center" style={{ gap: "24px" }}>
      <AnimatePresence mode="popLayout">
        <motion.span
          key={seconds}
          initial={{ scale: 1.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.6, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(120px, 22vw, 220px)",
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: "0.02em",
            color: isLastTen ? "#FF6B9D" : "#FFD700",
            textShadow: isLastTen
              ? "0 0 60px rgba(255,107,157,0.6), 0 0 120px rgba(255,107,157,0.3)"
              : "0 0 30px rgba(255,215,0,0.4), 0 0 60px rgba(255,215,0,0.2)",
            transition: "color 0.4s, text-shadow 0.4s",
          }}
        >
          {seconds}
        </motion.span>
      </AnimatePresence>
      <span
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "14px",
          fontWeight: 700,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: isLastTen ? "#FF6B9D" : "#FFD700",
          transition: "color 0.4s",
        }}
      >
        SECONDS REMAINING
      </span>
    </div>
  );
}

export function Countdown() {
  const time = useCountdown();
  const t = useTranslations("countdown");
  const tick = useTickSound();
  const tick2 = useTick2Sound();
  const { settings } = useSettings();
  const prevSecondsRef = useRef(time.seconds);
  const soundEnabledRef = useRef(settings.soundEnabled);
  const isFinal = time.total > 0 && time.total <= 60000;

  useEffect(() => {
    soundEnabledRef.current = settings.soundEnabled;
  }, [settings.soundEnabled]);

  useEffect(() => {
    if (time.seconds !== prevSecondsRef.current) {
      prevSecondsRef.current = time.seconds;
      if (!isFinal && !time.isReleased) {
        tick();
      }
    }
  });

  useEffect(() => {
    if (!time.isReleased) return;

    function blast(count: number, spread: number) {
      confetti({ particleCount: count, spread, origin: { y: 0.5 } });
      const a = new Audio(SOUND_EFFECTS.celebration);
      a.volume = 0.5;
      a.play().catch(() => {});
    }

    blast(200, 120);
    const interval = setInterval(() => blast(120, 100), 3000);
    return () => clearInterval(interval);
  }, [time.isReleased]);

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

  if (isFinal) {
    return <FinalSeconds seconds={time.seconds} onTick={tick2} />;
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
