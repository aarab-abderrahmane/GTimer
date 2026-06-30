import { getTranslations } from "next-intl/server";

export default async function ExtensionPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "extension" });

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "20px",
        padding: "96px 16px 48px",
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
          maxWidth: "400px",
          lineHeight: 1.7,
        }}
      >
        {t("description")}
      </p>
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "14px",
          fontWeight: 400,
          color: "rgba(192,132,240,0.6)",
          letterSpacing: "0.1em",
        }}
      >
        {t("browsers")}
      </p>
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "12px",
          fontWeight: 300,
          color: "#9999BB",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        {t("comingSoon")}
      </p>
    </div>
  );
}
