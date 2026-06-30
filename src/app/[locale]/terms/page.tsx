import { getTranslations } from "next-intl/server";

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "termsPage" });

  const headingStyle = {
    fontFamily: "var(--font-display)",
    fontSize: "clamp(36px, 5vw, 56px)",
    fontWeight: 800,
    letterSpacing: "0.03em",
    textTransform: "uppercase" as const,
    lineHeight: 1,
    color: "#FFD700",
    marginBottom: "8px",
  };

  const bodyStyle = {
    fontFamily: "var(--font-body)",
    fontSize: "16px",
    fontWeight: 300,
    lineHeight: 1.75,
    color: "#9999BB",
  };

  return (
    <div
      style={{
        maxWidth: "640px",
        margin: "0 auto",
        padding: "96px 24px 64px",
        display: "flex",
        flexDirection: "column" as const,
        gap: "20px",
      }}
    >
      <h1 style={headingStyle}>{t("title")}</h1>
      <p style={bodyStyle}>{t("description")}</p>
      <p style={bodyStyle}>{t("trademarks")}</p>
      <p style={bodyStyle}>{t("disclaimer")}</p>
    </div>
  );
}
