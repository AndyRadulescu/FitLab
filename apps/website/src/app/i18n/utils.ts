export const supportedLocales = ['en', 'ro'] as const;
export type Locale = (typeof supportedLocales)[number];
export const defaultLocale: Locale = 'en';

export function isValidLocale(locale?: string | null): locale is Locale {
  if (!locale) return false;
  return (supportedLocales as readonly string[]).includes(locale);
}

export function normalizeLocale(lang?: string | null): Locale | null {
  if (!lang) return null;
  const base = lang.trim().split('-')[0].toLowerCase();
  if (base === 'en') return 'en';
  if (base === 'ro') return 'ro';
  return null;
}
