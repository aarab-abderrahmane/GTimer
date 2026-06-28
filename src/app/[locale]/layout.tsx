import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { SettingsProvider } from "@/contexts/settings-context";
import { AudioProvider } from "@/contexts/audio-context";
import { ToastProvider } from "@/components/toast/toast";
import { ServiceWorkerRegister } from "@/components/layout/sw-register";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "site" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <SettingsProvider>
        <ToastProvider>
          <AudioProvider>
            <div className="flex min-h-screen flex-col">
              <Nav />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <ServiceWorkerRegister />
          </AudioProvider>
        </ToastProvider>
      </SettingsProvider>
    </NextIntlClientProvider>
  );
}
