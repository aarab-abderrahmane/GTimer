import { getTranslations } from "next-intl/server";

export default async function OfflinePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "offline" });

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-[var(--spacing-xl)] px-4 text-center">
      <h1 className="font-[family-name:var(--font-display)] text-[var(--text-headline)] text-[var(--color-accent-warm)]">
        {t("title")}
      </h1>
      <p className="font-[family-name:var(--font-body)] text-[var(--text-subheading-sm)] text-[var(--color-content-secondary)]">
        {t("description")}
      </p>
    </div>
  );
}
