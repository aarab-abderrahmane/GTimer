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
    <div className="flex flex-col items-center" style={{ gap: "10px" }}>
      <div style={{ display: "flex", gap: "3px" }}>
        {chars.map((char, i) => (
          <div
            key={`${i}-slot`}
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              /* Matte dark surface — no rounded corners on cards */
              background: "rgba(26, 16, 48, 0.85)",
              borderTop: "1px solid rgba(192, 132, 240, 0.15)",
              borderLeft: "1px solid rgba(192, 132, 240, 0.08)",
              width: "clamp(56px, 8vw, 80px)",
              height: "clamp(72px, 10vw, 100px)",
              backdropFilter: "blur(8px)",
            }}
          >
            {/* Subtle top-edge highlight */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "1px",
                background:
                  "linear-gradient(90deg, transparent, rgba(192,132,240,0.4), transparent)",
                pointerEvents: "none",
              }}
            />
            <AnimatePresence mode="popLayout">
              <motion.span
                key={`${i}-${char}`}
                initial={
                  prefersReducedMotion
                    ? {}
                    : { y: 40, opacity: 0, filter: "blur(4px)" }
                }
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                exit={
                  prefersReducedMotion
                    ? {}
                    : { y: -40, opacity: 0, filter: "blur(4px)" }
                }
                transition={{
                  duration: 0.3,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(36px, 5.5vw, 60px)",
                  fontWeight: 800,
                  letterSpacing: "0.03em",
                  textTransform: "uppercase",
                  lineHeight: 1,
                  color: "#FFFFFF",
                }}
              >
                {char}
              </motion.span>
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Label — gold eyebrow style */}
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
        {label}
      </span>
    </div>
  );
}
