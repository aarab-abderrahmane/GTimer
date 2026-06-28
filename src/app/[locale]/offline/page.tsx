import { getTranslations } from "next-intl/server";

export default async function OfflinePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "offline" });

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "20px",
        padding: "0 16px",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(36px, 6vw, 64px)",
          fontWeight: 800,
          letterSpacing: "0.03em",
          textTransform: "uppercase",
          color: "#FFD700",
          lineHeight: 1,
        }}
      >
        {t("title")}
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
    </div>
  );
}
