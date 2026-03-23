'use client';

import { Globe, Languages } from 'lucide-react';
import { Trans, useTranslation } from 'react-i18next';
import { analytics } from '../../../init-firebase-auth';
import { logEvent } from 'firebase/analytics';
import { Card } from '@my-org/shared-ui';

export function LanguageToggle() {
  const { i18n } = useTranslation();

  const toggleLanguage = async () => {
    const switcher = i18n.language.startsWith('en') ? 'ro' : 'en';
    await i18n.changeLanguage(switcher);
    localStorage.setItem('language', switcher);
    if (analytics) {
      logEvent(analytics, 'language-switch', {
        language: switcher
      });
    }
  };

  return (
    <Card>
      <div className="flex justify-start items-center w-full mb-4 px-4">
        <div className="text-center p-2 rounded-md bg-gray-700 dark:bg-black mr-4">
          <Globe size={24} className="text-gray-200 primary-text-dark" />
        </div>
        <div>
          <h3 className="text-lg"><Trans i18nKey="profile.change.language" /></h3>
          <p className="tracking-widest text-sm text-gray-500">LOCALIZATION</p>
        </div>
      </div>
      <div className="flex justify-center w-full mb-4">
        <div className="text-center">
          <p className="mb-2"><Trans i18nKey="profile.change.language">Change language</Trans></p>
          <button
            onClick={toggleLanguage}
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
        </div>
      </div>
    </Card>
  );
}
