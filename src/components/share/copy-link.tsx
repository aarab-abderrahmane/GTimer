"use client";

import { Copy, Check } from "lucide-react";
import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";

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
      className="group flex items-center gap-2 transition-all px-3  rounded-full  duration-300"
      style={{
        fontFamily: "var(--font-body)",
        fontSize: "13px",
        fontWeight: 600,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        color: copied ? "#C084F0" : "#E0E0FF",
        opacity: copied ? 1 : 0.7,
        background: "none",
        border: "none",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.opacity = "1";
      }}
      onMouseLeave={(e) => {
        if (!copied) (e.currentTarget as HTMLElement).style.opacity = "0.7";
      }}
    >
      {copied ? (
        <Check className="h-4 w-4" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
      <span className="hidden group-hover:inline">{copied ? t("copied") : t("copyLink")}</span>
    </button>
  );
}
