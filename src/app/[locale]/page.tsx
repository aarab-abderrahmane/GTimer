import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { CountdownSection } from "@/components/countdown/countdown-section";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "countdown" });
  return {
    title: t("heading"),
    description: t("releaseDate"),
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "countdown" });

  return (
    <CountdownSection
      heading={t("heading")}
      releaseDate={t("releaseDate")}
    />
  );
}
