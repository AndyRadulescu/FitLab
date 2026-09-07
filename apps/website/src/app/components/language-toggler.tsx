'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Languages } from 'lucide-react';
import clsx from 'clsx';
import { Locale } from '../i18n/utils';

function RomanianFlag({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 30 20"
      className={className}
      aria-hidden="true"
    >
      <rect width="10" height="20" fill="#002B7F" />
      <rect x="10" width="10" height="20" fill="#FCD116" />
      <rect x="20" width="10" height="20" fill="#CE1126" />
    </svg>
  );
}

function UsaFlag({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 30 20"
      className={className}
      aria-hidden="true"
    >
      <rect width="30" height="20" fill="#B22234" />
      <rect y="1.54" width="30" height="1.54" fill="#FFFFFF" />
      <rect y="4.62" width="30" height="1.54" fill="#FFFFFF" />
      <rect y="7.69" width="30" height="1.54" fill="#FFFFFF" />
      <rect y="10.77" width="30" height="1.54" fill="#FFFFFF" />
      <rect y="13.85" width="30" height="1.54" fill="#FFFFFF" />
      <rect y="16.92" width="30" height="1.54" fill="#FFFFFF" />
      <rect width="12" height="10.77" fill="#3C3B6E" />
      <circle cx="3" cy="2.7" r="0.7" fill="#FFFFFF" />
      <circle cx="6" cy="2.7" r="0.7" fill="#FFFFFF" />
      <circle cx="9" cy="2.7" r="0.7" fill="#FFFFFF" />
      <circle cx="4.5" cy="5.4" r="0.7" fill="#FFFFFF" />
      <circle cx="7.5" cy="5.4" r="0.7" fill="#FFFFFF" />
      <circle cx="3" cy="8.1" r="0.7" fill="#FFFFFF" />
      <circle cx="6" cy="8.1" r="0.7" fill="#FFFFFF" />
      <circle cx="9" cy="8.1" r="0.7" fill="#FFFFFF" />
    </svg>
  );
}

interface LanguageTogglerProps {
  locale: Locale | string;
  className?: string;
}

export function LanguageToggler({ locale, className }: LanguageTogglerProps) {
  const router = useRouter();
  const currentLocale = locale === 'en' ? 'en' : 'ro';
  const targetLocale: Locale = currentLocale === 'en' ? 'ro' : 'en';

  const handleToggle = () => {
    try {
      localStorage.setItem('language', targetLocale);
    } catch {
      // localStorage may fail in restricted/private environments
    }

    if (targetLocale === 'en') {
      router.push('/en/');
    } else {
      router.push('/');
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={clsx(
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50',
        className
      )}
      title={currentLocale === 'en' ? 'Switch to Romanian (RO)' : 'Comută în Engleză (EN)'}
      aria-label={currentLocale === 'en' ? 'Switch to Romanian' : 'Switch to English'}
    >
      <Languages className="w-4 h-4 text-zinc-300" aria-hidden="true" />
      <span className="w-5 h-3.5 rounded-[2px] overflow-hidden shadow-sm inline-flex items-center justify-center shrink-0">
        {currentLocale === 'en' ? (
          <UsaFlag className="w-full h-full object-cover" />
        ) : (
          <RomanianFlag className="w-full h-full object-cover" />
        )}
      </span>
    </button>
  );
}

export default LanguageToggler;
