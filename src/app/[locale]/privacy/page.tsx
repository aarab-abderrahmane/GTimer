export default async function PrivacyPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-1 flex-col gap-[var(--spacing-lg)] px-4 pt-24 pb-12">
      <h1 className="font-[family-name:var(--font-display)] text-[var(--text-headline)] text-[var(--color-accent-warm)] max-sm:text-4xl">
        Privacy Policy
      </h1>
      <p className="font-[family-name:var(--font-body)] text-[var(--text-body)] text-[var(--color-content-secondary)]">
        GTimer is a fan project and does not collect any personal data.
      </p>
      <p className="font-[family-name:var(--font-body)] text-[var(--text-body)] text-[var(--color-content-secondary)]">
        All settings are stored locally in your browser using localStorage. No
        information is sent to any server.
      </p>
      <p className="font-[family-name:var(--font-body)] text-[var(--text-body)] text-[var(--color-content-secondary)]">
        We use privacy-friendly analytics (Cloudflare Web Analytics) that do not
        use cookies or collect personal information.
      </p>
      <h2 className="font-[family-name:var(--font-display-condensed)] text-[var(--text-subheading)] text-[var(--color-content)] mt-[var(--spacing-xl)]">
        Contact
      </h2>
      <p className="font-[family-name:var(--font-body)] text-[var(--text-body)] text-[var(--color-content-secondary)]">
        If you have any questions, please open an issue on our GitHub repository.
      </p>
    </div>
  );
}
