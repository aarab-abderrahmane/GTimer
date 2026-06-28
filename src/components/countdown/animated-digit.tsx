"use client";

import { motion, AnimatePresence, useReducedMotion } from "motion/react";

interface AnimatedDigitProps {
  value: number;
  label: string;
  digits?: number;
}

export function AnimatedDigit({ value, label, digits = 2 }: AnimatedDigitProps) {
  const prefersReducedMotion = useReducedMotion();
  const padded = value.toString().padStart(digits, "0");
  const chars = padded.split("");

  return (
    <div className="flex flex-col items-center gap-[var(--spacing-sm)]">
      <div className="flex gap-[2px]">
        {chars.map((char, i) => (
          <div
            key={`${i}-${char}`}
            className="relative flex h-[var(--spacing-5xl)] w-[calc(var(--spacing-5xl)*0.7)] items-center justify-center overflow-hidden rounded-[var(--radius-md)] bg-[var(--color-surface-alt)] sm:h-[120px] sm:w-[90px]"
          >
            <AnimatePresence mode="popLayout">
              <motion.span
                key={`${i}-${char}`}
                initial={prefersReducedMotion ? {} : { y: 40, opacity: 0, filter: "blur(4px)" }}
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                exit={prefersReducedMotion ? {} : { y: -40, opacity: 0, filter: "blur(4px)" }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="font-[family-name:var(--font-display)] text-[var(--text-hero)] text-[var(--color-content)] leading-none tracking-[-1.28px] max-sm:text-5xl"
              >
                {char}
              </motion.span>
            </AnimatePresence>
          </div>
        ))}
      </div>
      <span className="font-[family-name:var(--font-body)] text-[var(--text-caption)] text-[var(--color-content-secondary)] uppercase tracking-widest">
        {label}
      </span>
    </div>
  );
}
