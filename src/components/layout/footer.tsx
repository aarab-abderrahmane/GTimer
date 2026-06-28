"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="flex flex-col items-center gap-[var(--spacing-md)] px-[var(--spacing-xl)] py-[var(--spacing-lg)] max-sm:px-[var(--spacing-md)] border-t border-[var(--color-accent-violet)]/20">
      <div className="flex items-center gap-[var(--spacing-lg)]">
        <Link
          href="/privacy"
          className="font-[family-name:var(--font-body)] text-[var(--text-caption)] text-[var(--color-accent-yellow)] transition-colors hover:text-[var(--color-content)]"
        >
          Privacy
        </Link>
        <Link
          href="/terms"
          className="font-[family-name:var(--font-body)] text-[var(--text-caption)] text-[var(--color-accent-yellow)] transition-colors hover:text-[var(--color-content)]"
        >
          Terms
        </Link>
      </div>
      <p className="font-[family-name:var(--font-body)] text-[var(--text-caption)] text-[var(--color-content-secondary)] text-center">
        {t("copyright")}
      </p>
    </footer>
  );
}
