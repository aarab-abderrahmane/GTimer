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
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "24px",
        padding: "0 16px",
        textAlign: "center",
        background: "#0d0d1e",
      }}
    >
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(36px, 6vw, 64px)",
          fontWeight: 800,
          letterSpacing: "0.03em",
          textTransform: "uppercase",
          color: "#FF6B9D",
          lineHeight: 1,
        }}
      >
        Something went wrong
      </h1>
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "16px",
          fontWeight: 300,
          color: "#9999BB",
          maxWidth: "400px",
          lineHeight: 1.7,
        }}
      >
        The countdown encountered an error. Don&apos;t worry — the release date
        hasn&apos;t changed.
      </p>
      <button
        onClick={reset}
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "13px",
          fontWeight: 600,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          color: "#FFFFFF",
          background: "#C084F0",
          border: "none",
          borderRadius: "50px",
          padding: "12px 32px",
          cursor: "pointer",
          transition: "filter 300ms",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.filter = "brightness(1.15)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.filter = "";
        }}
      >
        Try again
      </button>
    </div>
  );
}
