import { Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { logEvent, Analytics } from 'firebase/analytics';

interface LanguageToggleProps {
  analytics?: Analytics | null;
}

export function LanguageToggle({ analytics }: LanguageToggleProps) {
  const { i18n } = useTranslation();

  const toggleLanguage = async () => {
    const switcher = i18n.language.startsWith('en') ? 'ro' : 'en';
    await i18n.changeLanguage(switcher);
    localStorage.setItem('language', switcher);
    if (analytics) {
      logEvent(analytics, 'language-switch', {
        language: switcher,
      });
    }
  };

  return (
    <button
      onClick={() => void toggleLanguage()}
      className="flex items-center gap-2 px-4 py-2 border-gray-400 dark:border-gray-700 dark:bg-slate-400 border-solid border-1 rounded-full shadow-sm transition-colors text-sm font-medium"
    >
      <Languages
        size={16}
        className="text-primary"
      />
      <span className="dark:text-gray-800">{i18n.language.startsWith('en') ? 'English' : 'Română'}</span>
      <span className="text-xs text-primary border-l pl-2 ml-1">
        {i18n.language.startsWith('en') ? 'RO' : 'EN'}
      </span>
    </button>
  );
}
