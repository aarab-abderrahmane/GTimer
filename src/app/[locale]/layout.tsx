import { Analytics } from "@vercel/analytics/next";
import { Barlow_Condensed, Barlow, Noto_Sans_Arabic } from "next/font/google";
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
import { DirectionProvider } from "@/components/layout/direction-provider";
import { getDirection } from "@/lib/direction";
import { getOgLocale } from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
  variable: "--font-barlow-condensed",
});

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  display: "swap",
  variable: "--font-barlow",
});

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "600", "700", "800"],
  display: "swap",
  variable: "--font-noto-sans-arabic",
});

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "site" });
  const ogLocale = getOgLocale(locale);
  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      locale: ogLocale,
    },
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
    <html
      lang={locale}
      className={`${barlowCondensed.variable} ${barlow.variable} ${notoSansArabic.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/icons/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="google-site-verification" content="z9LbqnBkjyC57ROYgndrX5bduTaPKU9NPiwJXJsb29A" />
      </head>
      <body className="min-h-full antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <DirectionProvider>
            <SettingsProvider>
              <ToastProvider>
                <AudioProvider>
                  <div dir={getDirection(locale)} className="flex min-h-screen flex-col">
                    <Nav />
                    <main className="flex-1">{children}</main>
                    <Footer />
                  </div>
                  <ServiceWorkerRegister />
                </AudioProvider>
              </ToastProvider>
            </SettingsProvider>
          </DirectionProvider>
        </NextIntlClientProvider>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: SITE_NAME,
              url: SITE_URL,
              description: "The most beautiful GTA VI countdown experience.",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: `${SITE_URL}/?q={search_term_string}`,
                },
                "query-input": "required name=search_term_string",
              },
            }).replace(/</g, "\\u003c"),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: SITE_NAME,
              url: SITE_URL,
              applicationCategory: "Multimedia",
              operatingSystem: "Web",
              description: "The most beautiful GTA VI countdown experience.",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
            }).replace(/</g, "\\u003c"),
          }}
        />
        <Analytics />
      </body>
    </html>
  );
}