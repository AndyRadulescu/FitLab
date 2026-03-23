'use client';

import { Globe } from 'lucide-react';
import { Trans, useTranslation } from 'react-i18next';
import { analytics } from '../../../init-firebase-auth';
import { logEvent } from 'firebase/analytics';
import { Card } from '@my-org/shared-ui';
import clsx from 'clsx';

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const isEn = i18n.language.startsWith('en');

  const toggleLanguage = async () => {
    const switcher = isEn ? 'ro' : 'en';
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
      <div className="flex justify-start items-center w-full mb-6 px-4">
        <div className="text-center p-2 rounded-xl bg-gray-800 dark:bg-black mr-4 shadow-inner">
          <Globe size={24} className="text-gray-200 primary-text-dark" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100"><Trans i18nKey="profile.change.language" /></h3>
          <p className="tracking-widest text-[10px] font-bold text-amber-300/80 uppercase">Localization</p>
        </div>
      </div>

      <div className="flex justify-center w-full pb-2">
        <div className="flex flex-col items-center">
          <button
            onClick={toggleLanguage}
            className="relative flex items-center w-56 h-12 p-1 bg-gray-200/50 dark:bg-zinc-800/50 rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-amber-500/10 group"
            aria-label="Toggle Language"
          >
            {/* Sliding Pill */}
            <div
              className={clsx(
                "absolute h-10 w-[108px] bg-white dark:bg-zinc-700 rounded-full shadow-lg transition-all duration-300 ease-out transform",
                isEn ? "translate-x-0" : "translate-x-[108px]"
              )}
            />

            {/* Labels */}
            <div className="relative flex w-full items-center z-10">
              <div className={clsx(
                "flex-1 text-center text-xs font-black tracking-widest transition-colors duration-300",
                isEn ? "text-amber-600 primary-text-dark" : "text-gray-400 dark:text-gray-500"
              )}>
                ENGLISH
              </div>
              <div className={clsx(
                "flex-1 text-center text-xs font-black tracking-widest transition-colors duration-300",
                !isEn ? "text-amber-600 primary-text-dark" : "text-gray-400 dark:text-gray-500"
              )}>
                ROMÂNĂ
              </div>
            </div>
          </button>

          <p className="mt-4 text-[11px] font-semibold text-gray-400 uppercase tracking-tighter opacity-50">
            {isEn ? "Currently viewing in English" : "Acum vizualizezi în Română"}
          </p>
        </div>
      </div>
    </Card>
  );
}
