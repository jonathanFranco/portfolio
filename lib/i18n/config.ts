export const LOCALES = ["pt", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "pt";

export const LOCALE_COOKIE = "NEXT_LOCALE";

export const HTML_LANG: Record<Locale, string> = {
  pt: "pt-BR",
  en: "en",
};

export function isLocale(value: string | undefined): value is Locale {
  return LOCALES.includes(value as Locale);
}
