'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getClientTranslations } from '../i18n/client';
import { defaultLocale } from '../i18n/utils';

export interface CookieBannerTranslations {
  title?: string;
  description?: string;
  checkFormula?: string;
  skip?: string;
  accept?: string;
}

const ACCEPTED = 'accepted';

interface CookieBannerProps {
  locale?: string;
  translations?: CookieBannerTranslations;
}

export default function CookieBanner({
  locale = defaultLocale,
  translations,
}: CookieBannerProps) {
  const t = getClientTranslations(locale);
  const title = translations?.title || t.cookieBanner.title;
  const description = translations?.description || t.cookieBanner.description;
  const checkFormula = translations?.checkFormula || t.cookieBanner.checkFormula;
  const skip = translations?.skip || t.cookieBanner.skip;
  const accept = translations?.accept || t.cookieBanner.accept;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('cookie-consent');
      if (!consent || consent !== ACCEPTED) {
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, 1000); // 1000ms = 1 second

        return () => clearTimeout(timer);
      }
    } catch {
      // localStorage may fail in restricted/private environments
    }
  }, []);

  const acceptCookies = () => {
    try {
      localStorage.setItem('cookie-consent', ACCEPTED);
    } catch {
      // localStorage may fail
    }
    setIsVisible(false);
  };

  const skipCookies = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-in fade-in slide-in-from-bottom-10 duration-500">
      <div className="max-w-4xl mx-auto bg-black/75 backdrop-blur-md border border-zinc-900 rounded-2xl shadow-2xl p-6 text-white overflow-hidden relative">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <h3 className="text-xl font-bold flex items-center gap-2 mb-2">
              <span className="text-2xl">💪</span>
              {title}
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              {description}{' '}
              <Link href="/privacy-policy/" className="text-primary underline hover:text-white transition-colors">
                {checkFormula}
              </Link>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={skipCookies}
              className="px-6 py-2.5 rounded-full border border-gray-600 font-semibold text-sm hover:bg-white/10 transition-colors"
            >
              {skip}
            </button>
            <button
              onClick={acceptCookies}
              className="px-8 py-2.5 rounded-full primary-gradient text-black font-bold text-sm shadow-lg hover:scale-105 active:scale-95 transition-all"
            >
              {accept}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
