"use client";

import type { Locale } from "@/lib/i18n/config";
import { type Dictionary, getDictionary } from "@/lib/i18n";
import { createContext, type ReactNode, useContext } from "react";

const I18nContext = createContext<Locale | null>(null);

export function I18nProvider({
  lang,
  children,
}: {
  lang: Locale;
  children: ReactNode;
}) {
  return <I18nContext.Provider value={lang}>{children}</I18nContext.Provider>;
}

export function useI18n(): { lang: Locale; t: Dictionary } {
  const lang = useContext(I18nContext);
  if (!lang) throw new Error("useI18n must be used inside I18nProvider");
  return { lang, t: getDictionary(lang) };
}
