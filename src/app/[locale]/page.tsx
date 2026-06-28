import { getTranslations } from "next-intl/server";
import { CountdownSection } from "@/components/countdown/countdown-section";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "countdown" });

  return (
    <CountdownSection
      heading={t("heading")}
      subheading={t("subheading")}
      releaseDate={t("releaseDate")}
    />
  );
}
