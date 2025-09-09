import type { Locale } from "./config";
import en from "./dictionaries/en";
import pt, { type Dictionary } from "./dictionaries/pt";

export type { Dictionary };

const DICTIONARIES: Record<Locale, Dictionary> = { pt, en };

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}
