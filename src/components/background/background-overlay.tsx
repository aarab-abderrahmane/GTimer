"use client";

import { cn } from "@/lib/utils";

interface BackgroundOverlayProps {
  blur?: boolean;
  className?: string;
}

export function BackgroundOverlay({ blur = true, className }: BackgroundOverlayProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 -z-10",
        blur && "backdrop-blur-[2px]",
        "bg-gradient-to-b from-[var(--color-surface)]/40 via-transparent to-[var(--color-surface)]/80",
        className,
      )}
    />
  );
}
