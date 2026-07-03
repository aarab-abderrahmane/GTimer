import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });

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

  const subheadingStyle = {
    fontFamily: "var(--font-display)",
    fontSize: "clamp(22px, 3vw, 28px)",
    fontWeight: 800,
    letterSpacing: "0.05em",
    textTransform: "uppercase" as const,
    color: "#C084F0",
    marginTop: "16px",
  };

  const bodyStyle = {
    fontFamily: "var(--font-body)",
    fontSize: "16px",
    fontWeight: 300,
    lineHeight: 1.75,
    color: "#9999BB",
  };

  const faqQStyle = {
    fontFamily: "var(--font-body)",
    fontSize: "16px",
    fontWeight: 600,
    lineHeight: 1.5,
    color: "#E0E0FF",
    marginTop: "12px",
  };

  const faqAStyle = {
    fontFamily: "var(--font-body)",
    fontSize: "15px",
    fontWeight: 300,
    lineHeight: 1.75,
    color: "#9999BB",
    marginTop: "4px",
  };

  return (
    <>
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
        <h1 style={headingStyle}>{t("heading")}</h1>
        <p style={bodyStyle}>{t("intro")}</p>

        <h2 style={subheadingStyle}>{t("releaseLabel")}</h2>
        <p style={bodyStyle}>{t("releaseInfo")}</p>

        <h2 style={subheadingStyle}>{t("platformsLabel")}</h2>
        <p style={bodyStyle}>{t("platformsInfo")}</p>

        <h2 style={subheadingStyle}>{t("countdownLabel")}</h2>
        <p style={bodyStyle}>{t("countdownInfo")}</p>

        <h2 style={subheadingStyle}>{t("faq")}</h2>

        <p style={faqQStyle}>{t("faqQ1")}</p>
        <p style={faqAStyle}>{t("faqA1")}</p>

        <p style={faqQStyle}>{t("faqQ2")}</p>
        <p style={faqAStyle}>{t("faqA2")}</p>

        <p style={faqQStyle}>{t("faqQ3")}</p>
        <p style={faqAStyle}>{t("faqA3")}</p>

        <p style={faqQStyle}>{t("faqQ4")}</p>
        <p style={faqAStyle}>{t("faqA4")}</p>

        <p style={faqQStyle}>{t("faqQ5")}</p>
        <p style={faqAStyle}>{t("faqA5")}</p>

        <p style={faqQStyle}>{t("faqQ6")}</p>
        <p style={faqAStyle}>{t("faqA6")}</p>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: t("faqQ1"),
                acceptedAnswer: {
                  "@type": "Answer",
                  text: t("faqA1"),
                },
              },
              {
                "@type": "Question",
                name: t("faqQ2"),
                acceptedAnswer: {
                  "@type": "Answer",
                  text: t("faqA2"),
                },
              },
              {
                "@type": "Question",
                name: t("faqQ3"),
                acceptedAnswer: {
                  "@type": "Answer",
                  text: t("faqA3"),
                },
              },
              {
                "@type": "Question",
                name: t("faqQ4"),
                acceptedAnswer: {
                  "@type": "Answer",
                  text: t("faqA4"),
                },
              },
              {
                "@type": "Question",
                name: t("faqQ5"),
                acceptedAnswer: {
                  "@type": "Answer",
                  text: t("faqA5"),
                },
              },
              {
                "@type": "Question",
                name: t("faqQ6"),
                acceptedAnswer: {
                  "@type": "Answer",
                  text: t("faqA6"),
                },
              },
            ],
          }).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
