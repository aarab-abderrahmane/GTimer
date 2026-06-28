"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-[var(--spacing-xl)] px-4 text-center">
      <h1 className="font-[family-name:var(--font-display)] text-[var(--text-headline)] text-[var(--color-accent-warm)]">
        Something went wrong
      </h1>
      <p className="font-[family-name:var(--font-body)] text-[var(--text-subheading-sm)] text-[var(--color-content-secondary)] max-w-md">
        The countdown encountered an error. Don&apos;t worry — the release date
        hasn&apos;t changed.
      </p>
      <button
        onClick={reset}
        className="rounded-[var(--radius-pill)] bg-[var(--color-button-surface)] px-[var(--spacing-2xl)] py-[var(--spacing-md)] font-[family-name:var(--font-display)] text-[var(--text-button)] text-[var(--color-surface)] transition-transform hover:scale-105"
      >
        Try again
      </button>
    </div>
  );
}
