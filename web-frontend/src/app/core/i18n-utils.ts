export const getInitialLanguage = () => {
  const savedLanguage = localStorage.getItem('language');
  if (savedLanguage) {
    return savedLanguage;
  }

  const browserLanguages = navigator.languages || [navigator.language];
  for (const lang of browserLanguages) {
    const base = lang.split('-')[0].toLowerCase();
    if (base === 'ro' || base === 'en') {
      return base;
    }
  }

  return 'ro';
};
