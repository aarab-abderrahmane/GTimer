export default async function TermsPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-1 flex-col gap-[var(--spacing-lg)] px-4 pt-24 pb-12">
      <h1 className="font-[family-name:var(--font-display)] text-[var(--text-headline)] text-[var(--color-accent-warm)] max-sm:text-4xl">
        Terms of Service
      </h1>
      <p className="font-[family-name:var(--font-body)] text-[var(--text-body)] text-[var(--color-content-secondary)]">
        GTimer is an unofficial fan project. We are not affiliated with,
        endorsed by, or connected to Rockstar Games or Take-Two Interactive.
      </p>
      <p className="font-[family-name:var(--font-body)] text-[var(--text-body)] text-[var(--color-content-secondary)]">
        All trademarks, copyrights, and intellectual property belong to their
        respective owners.
      </p>
      <p className="font-[family-name:var(--font-body)] text-[var(--text-body)] text-[var(--color-content-secondary)]">
        The countdown is provided as-is. While we strive for accuracy, we cannot
        guarantee it.
      </p>
    </div>
  );
}
