import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function NotFound({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "notFound" });

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-[var(--spacing-xl)] px-4 text-center">
      <h1 className="font-[family-name:var(--font-display)] text-[var(--text-headline)] text-[var(--color-accent-warm)]">
        404
      </h1>
      <p className="font-[family-name:var(--font-body)] text-[var(--text-subheading-sm)] text-[var(--color-content-secondary)]">
        {t("description")}
      </p>
      <Link
        href={`/${locale}`}
        className="rounded-[var(--radius-pill)] bg-[var(--color-button-surface)] px-[var(--spacing-2xl)] py-[var(--spacing-md)] font-[family-name:var(--font-display)] text-[var(--text-button)] text-[var(--color-surface)] transition-transform hover:scale-105"
      >
        {t("cta")}
      </Link>
    </div>
  );
}
