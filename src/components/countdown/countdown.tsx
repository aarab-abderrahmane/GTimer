"use client";

import { useCountdown } from "@/hooks/use-countdown";
import { AnimatedDigit } from "./animated-digit";
import { useTranslations } from "next-intl";

export function Countdown() {
  const time = useCountdown();
  const t = useTranslations("countdown");

  if (time.isReleased) {
    return (
      <div className="flex flex-col items-center gap-[var(--spacing-lg)]">
        <h2 className="font-[family-name:var(--font-display-condensed)] text-[var(--text-headline)] text-[var(--color-accent-warm)] text-center">
          {t("released")}
        </h2>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-[var(--spacing-xl)]">
      <AnimatedDigit value={time.years} label={t("years")} digits={1} />
      <AnimatedDigit value={time.months} label={t("months")} />
      <AnimatedDigit value={time.weeks} label={t("weeks")} digits={1} />
      <AnimatedDigit value={time.days} label={t("days")} />
      <AnimatedDigit value={time.hours} label={t("hours")} />
      <AnimatedDigit value={time.minutes} label={t("minutes")} />
      <AnimatedDigit value={time.seconds} label={t("seconds")} />
      <div className="flex flex-col items-center">
        <div className="flex h-[var(--spacing-5xl)] w-[70px] items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-surface-alt)] sm:h-[120px] sm:w-[90px]">
          <span className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-accent-sky)] leading-none sm:text-4xl">
            {time.milliseconds.toString().padStart(3, "0")}
          </span>
        </div>
        <span className="mt-[var(--spacing-sm)] font-[family-name:var(--font-body)] text-[var(--text-caption)] text-[var(--color-content-secondary)] uppercase tracking-widest">
          {t("milliseconds")}
        </span>
      </div>
    </div>
  );
}
