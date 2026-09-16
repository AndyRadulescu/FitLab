import { createInstance } from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next/initReactI18next';
import { defaultLocale, isValidLocale, Locale, supportedLocales } from './utils';

const initServerI18next = async (locale: string) => {
  const i18nInstance = createInstance();
  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (language: string, namespace: string) =>
          import(`../locales/${language}/${namespace}.json`)
      )
    )
    .init({
      supportedLngs: supportedLocales,
      fallbackLng: defaultLocale,
      lng: locale,
      defaultNS: 'translation',
      interpolation: {
        escapeValue: false,
      },
    });
  return i18nInstance;
};

export async function getServerTranslations(locale: string) {
  const safeLocale: Locale = isValidLocale(locale) ? locale : defaultLocale;
  const instance = await initServerI18next(safeLocale);
  return {
    t: instance.getFixedT(safeLocale, 'translation'),
    i18n: instance,
  };
}
