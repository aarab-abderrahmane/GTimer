"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer
      className="flex flex-col items-center"
      style={{
        padding: "20px 32px",
        background: "linear-gradient(to top, rgba(6,6,16,0.8) 0%, transparent 100%)",
        borderTop: "1px solid rgba(192, 132, 240, 0.12)",
        gap: "10px",
      }}
    >
      <div className="flex items-center" style={{ gap: "24px" }}>
        <Link
          href="/privacy"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#9999BB",
            textDecoration: "none",
            transition: "color 300ms",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.color = "#E0E0FF";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.color = "#9999BB";
          }}
        >
          Privacy
        </Link>
        <span style={{ color: "rgba(192,132,240,0.25)", fontSize: "11px" }}>|</span>
        <Link
          href="/terms"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#9999BB",
            textDecoration: "none",
            transition: "color 300ms",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.color = "#E0E0FF";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.color = "#9999BB";
          }}
        >
          Terms
        </Link>
      </div>
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "11px",
          fontWeight: 400,
          letterSpacing: "0.05em",
          color: "#9999BB",
          textAlign: "center",
          margin: 0,
        }}
      >
        {t("copyright")}
      </p>
    </footer>
  );
}
