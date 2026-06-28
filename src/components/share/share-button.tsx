"use client";

import { useCallback } from "react";
import { Share2, Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function ShareButton() {
  const t = useTranslations("share");
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "GTimer",
          text: "GTA VI Countdown",
          url: window.location.href,
        });
      } catch {}
    } else {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, []);

  return (
    <button
      onClick={handleShare}
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
        <Share2 className="h-4 w-4" />
      )}
      <span className="font-[family-name:var(--font-body)] text-[var(--text-body)]">
        {copied ? t("copied") : t("copyLink")}
      </span>
    </button>
  );
}
