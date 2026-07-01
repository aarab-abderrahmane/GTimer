"use client";

import { useEffect, useRef } from "react";
import { PRE_ORDER_DATE, RELEASE_DATE } from "@/lib/constants";
import { VI_PATHS } from "@/lib/vi-paths";

const TOTAL_MS = RELEASE_DATE.getTime() - PRE_ORDER_DATE.getTime();
const TARGET = Math.min(Math.max((Date.now() - PRE_ORDER_DATE.getTime()) / TOTAL_MS, 0), 1);
const ANIM_DURATION = 2500;

export function VILoader() {
  const coloredRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const g = coloredRef.current;
    if (!g) return;

    let start: number | null = null;
    let rafId: number;

    function ease(t: number) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function animate(time: number) {
      const el = g;
      if (!el) return;
      if (!start) start = time;
      let t = Math.min((time - start) / ANIM_DURATION, 1);
      t = ease(t);
      const progress = t * TARGET;
      el.style.clipPath = `inset(${(1 - progress) * 100}% 0 0 0)`;
      if (t < 1) {
        rafId = requestAnimationFrame(animate);
      }
    }

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div
      className="w-full"
      style={{
        position: "relative",
        aspectRatio: "240 / 176.85",
        maxWidth: "clamp(280px, 50vw, 400px)",
        margin: "0 auto",
      }}
    >
      <svg
        viewBox="0 0 240 176.85"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
        }}
      >
        <defs>
          <linearGradient id="vi-gradient" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#ffc200" />
            <stop offset="14%" stopColor="#f05a28" />
            <stop offset="38%" stopColor="#e0188a" />
            <stop offset="64%" stopColor="#8b3fcc" />
            <stop offset="100%" stopColor="#6eb4f7" />
          </linearGradient>
        </defs>
        <g fill="white">
          {VI_PATHS.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
        <g ref={coloredRef} fill="url(#vi-gradient)" style={{ clipPath: "inset(100% 0 0 0)" }}>
          {VI_PATHS.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
      </svg>
    </div>
  );
}
