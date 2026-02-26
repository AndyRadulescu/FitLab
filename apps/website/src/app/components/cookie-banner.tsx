'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const ACCEPTED = 'accepted';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent || consent !== ACCEPTED) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000); // 1000ms = 1 second

      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', ACCEPTED);
    setIsVisible(false);
  };

  const skipCookies = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-in fade-in slide-in-from-bottom-10 duration-500">
      <div
        className="max-w-4xl mx-auto bg-black/75 backdrop-blur-md border border-zinc-900 rounded-2xl shadow-2xl p-6 text-white overflow-hidden relative">

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <h3 className="text-xl font-bold flex items-center gap-2 mb-2">
              <span className="text-2xl">💪</span>
              Fuel Your Progress with Cookies?
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              We use cookies to optimize your laboratory experience and track your body metrics more precisely.
              Don't worry, these cookies have 0 calories! <span className="italic">Gains guaranteed.</span>
              {' '}
              <Link href="/privacy-policy" className="text-primary underline hover:text-white transition-colors">
                Check our formula.
              </Link>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={skipCookies}
              className="px-6 py-2.5 rounded-full border border-gray-600 font-semibold text-sm hover:bg-white/10 transition-colors"
            >
              Skip Set
            </button>
            <button
              onClick={acceptCookies}
              className="px-8 py-2.5 rounded-full primary-gradient text-black font-bold text-sm shadow-lg hover:scale-105 active:scale-95 transition-all"
            >
              Crush It 💪
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
