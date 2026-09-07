export const supportedLocales = ['en', 'ro'] as const;
export type Locale = (typeof supportedLocales)[number];
export const defaultLocale: Locale = 'ro';

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

export function detectClientLanguage(): Locale {
  if (typeof window === 'undefined') {
    return defaultLocale;
  }

  // 1. Check saved language in localStorage
  try {
    const saved = localStorage.getItem('language');
    const normalizedSaved = normalizeLocale(saved);
    if (normalizedSaved) {
      return normalizedSaved;
    }
  } catch {
    // localStorage might be disabled in private mode
  }

  // 2. Check browser languages (e.g. ['en-US', 'en'], ['ro-MD', 'ro'])
  const browserLanguages = navigator.languages || [navigator.language];
  for (const lang of browserLanguages) {
    const normalized = normalizeLocale(lang);
    if (normalized) {
      return normalized;
    }
  }

  // 3. Default fallback
  return defaultLocale;
}
