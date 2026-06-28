"use client";

import { Copy, Check } from "lucide-react";
import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export function CopyLink() {
  const t = useTranslations("share");
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }, []);

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "flex items-center gap-[var(--spacing-sm)] rounded-[var(--radius-pill)] px-[var(--spacing-md)] py-[var(--spacing-sm)] backdrop-blur-[6.25px] transition-all",
        copied
          ? "bg-[var(--color-accent)]/20 text-[var(--color-accent)]"
          : "text-[var(--color-content-secondary)] hover:text-[var(--color-content)]",
      )}
    >
      {copied ? (
        <Check className="h-4 w-4" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
      <span className="font-[family-name:var(--font-body)] text-[var(--text-body)]">
        {copied ? t("copied") : t("copyLink")}
      </span>
    </button>
  );
}
