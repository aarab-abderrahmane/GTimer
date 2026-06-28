"use client";

import { useMemo } from "react";
import { QRCodeSVG } from "qrcode.react";

interface QRCodeProps {
  url?: string;
  size?: number;
}

export function QRCode({ url, size = 128 }: QRCodeProps) {
  const href = useMemo(
    () => (typeof window !== "undefined" ? url ?? window.location.href : url ?? ""),
    [url],
  );

  if (!href) return null;

  return (
    <div className="rounded-[var(--radius-md)] bg-white p-[var(--spacing-md)]">
      <QRCodeSVG value={href} size={size} fgColor="#111117" bgColor="#ffffff" />
    </div>
  );
}
