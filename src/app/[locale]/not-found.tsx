import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function NotFound({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "notFound" });

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
      }}
    >
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(72px, 12vw, 128px)",
          fontWeight: 800,
          letterSpacing: "0.03em",
          color: "#FFD700",
          lineHeight: 1,
        }}
      >
        404
      </h1>
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "16px",
          fontWeight: 300,
          color: "#9999BB",
          maxWidth: "360px",
          lineHeight: 1.7,
        }}
      >
        {t("description")}
      </p>
      <Link
        href={`/${locale}`}
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "13px",
          fontWeight: 600,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          color: "#FFFFFF",
          background: "#C084F0",
          borderRadius: "50px",
          padding: "12px 32px",
          textDecoration: "none",
          transition: "filter 300ms",
        }}
      >
        {t("cta")}
      </Link>
    </div>
  );
}
