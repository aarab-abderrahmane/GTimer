import { getTranslations } from "next-intl/server";

export default async function ExtensionPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "extension" });

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-[var(--spacing-xl)] px-4 pt-24 text-center">
      <h1 className="font-[family-name:var(--font-display)] text-[var(--text-headline)] text-[var(--color-accent-warm)] max-sm:text-4xl">
        {t("title")}
      </h1>
      <p className="max-w-md font-[family-name:var(--font-body)] text-[var(--text-subheading-sm)] text-[var(--color-content-secondary)]">
        {t("description")}
      </p>
      <p className="font-[family-name:var(--font-body)] text-[var(--text-body)] text-[var(--color-border-subtle)]">
        Chrome &bull; Edge &bull; Firefox
      </p>
      <p className="font-[family-name:var(--font-body)] text-[var(--text-caption)] text-[var(--color-content-secondary)]">
        Coming soon
      </p>
    </div>
  );
}
