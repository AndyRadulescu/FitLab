import en from '../locales/en/translation.json';
import ro from '../locales/ro/translation.json';
import { defaultLocale, isValidLocale, Locale } from './utils';

const dictionaries = { en, ro } as const;

export function getClientTranslations(locale: string = defaultLocale) {
  const safeLocale: Locale = isValidLocale(locale) ? locale : defaultLocale;
  return dictionaries[safeLocale];
}
