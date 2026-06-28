"use client";

import { cn } from "@/lib/utils";

interface BackgroundOverlayProps {
  blur?: boolean;
  className?: string;
}

export function BackgroundOverlay({ blur = false, className }: BackgroundOverlayProps) {
  return (
    <div
      className={cn("fixed inset-0 -z-10", className)}
      style={{
        background: [
          /* Bottom-up dark vignette — cinematic photography treatment */
          "linear-gradient(to top, rgba(6,6,16,0.92) 0%, rgba(6,6,16,0.4) 40%, transparent 70%)",
          /* Top nav gradient */
          "linear-gradient(to bottom, rgba(6,6,16,0.7) 0%, transparent 25%)",
          /* Center subtle tint to keep bg readable */
          "radial-gradient(ellipse 100% 80% at 50% 50%, rgba(13,13,30,0.3) 0%, transparent 70%)",
        ].join(", "),
        backdropFilter: blur ? "blur(2px)" : "none",
      }}
    />
  );
}
