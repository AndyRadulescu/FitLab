import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import { getInitialLanguage } from './app/core/i18n-utils';

i18next
  .use(Backend)
  .use(initReactI18next)
  .init({
    fallbackLng: 'ro',
    lng: getInitialLanguage(),
    react: {
      useSuspense: true,
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18next;
