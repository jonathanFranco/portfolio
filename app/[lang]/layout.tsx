import { AppLoader } from "@/components/app-loader";
import { I18nProvider } from "@/components/i18n-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { getDictionary } from "@/lib/i18n";
import { HTML_LANG, isLocale, LOCALES, type Locale } from "@/lib/i18n/config";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Archivo, Inter_Tight, JetBrains_Mono } from "next/font/google";
import type React from "react";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import "../globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const SITE_URL = "https://jonfrancodev.vercel.app";

const CRITICAL_CSS = [
  "html{background:#080a0f;color-scheme:dark}",
  "html.light{background:#fbfbfd;color-scheme:light}",
  ".app-loader{position:fixed;inset:0;z-index:100;background:#080a0f}",
  "html.light .app-loader{background:#fbfbfd}",
].join("");

interface LangParams {
  params: { lang: string };
}

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export function generateMetadata({ params }: LangParams): Metadata {
  const lang = (isLocale(params.lang) ? params.lang : "pt") as Locale;
  const { meta } = getDictionary(lang);
  return {
    metadataBase: new URL(SITE_URL),
    title: meta.title,
    description: meta.description,
    authors: [{ name: "Jonathan Franco", url: SITE_URL }],
    keywords: meta.keywords,
    alternates: {
      canonical: `/${lang}`,
      languages: {
        [HTML_LANG.pt]: "/pt",
        [HTML_LANG.en]: "/en",
        "x-default": "/pt",
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `/${lang}`,
      locale: lang === "pt" ? "pt_BR" : "en_US",
      type: "website",
    },
  };
}

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { lang: string };
}>) {
  if (!isLocale(params.lang)) notFound();
  const lang = params.lang;

  return (
    <html lang={HTML_LANG[lang]} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
        <style>{CRITICAL_CSS}</style>
        <noscript>
          <style>{`.app-loader{display:none}html{overflow:auto!important}.fade-up,.line-mask>span{animation-play-state:running!important}`}</style>
        </noscript>
      </head>
      <body
        className={`font-sans ${archivo.variable} ${interTight.variable} ${jetbrainsMono.variable}`}
      >
        <Suspense fallback={null}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <I18nProvider lang={lang}>
              <AppLoader />
              {children}
            </I18nProvider>
          </ThemeProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  );
}
