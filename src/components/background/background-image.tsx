"use client";

import { cn } from "@/lib/utils";

interface BackgroundImageProps {
  src?: string;
  className?: string;
}

export function BackgroundImage({ src, className }: BackgroundImageProps) {
  if (!src) {
    return (
      <div
        className={cn(
          "fixed inset-0 -z-10 bg-gradient-to-b from-[var(--color-surface)] via-[var(--color-surface-alt)] to-[var(--color-surface)]",
          className,
        )}
      />
    );
  }

  return (
    <div className={cn("fixed inset-0 -z-10", className)}>
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${src})` }}
      />
      <div className="absolute inset-0 bg-[var(--color-overlay)]" />
    </div>
  );
}
