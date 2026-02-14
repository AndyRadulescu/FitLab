import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export function useHtmlLang() {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.dir();
    console.log(i18n.language);
  }, [i18n.language]);
}
