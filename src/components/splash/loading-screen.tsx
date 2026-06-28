"use client";

import { motion } from "motion/react";

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--color-surface)]">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-center gap-[var(--spacing-xl)]"
      >
        <h1 className="font-[family-name:var(--font-display)] text-[var(--text-hero)] text-[var(--color-accent-warm)] leading-none max-sm:text-6xl">
          GTimer
        </h1>
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="h-[2px] w-24 rounded-full bg-[var(--color-accent)]"
        />
      </motion.div>
    </div>
  );
}
