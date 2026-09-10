import React from 'react';
import Image from 'next/image';
import { getServerTranslations } from '../i18n/server';
import { defaultLocale, Locale } from '../i18n/utils';

export default async function AboutMeContent({
  locale = defaultLocale,
}: {
  locale?: Locale;
}) {
  const { t } = await getServerTranslations(locale);

  return (
    <main className="auth-theme-trigger min-h-screen bg-black text-zinc-300 selection:bg-primary selection:text-white mt-[8svh] md:mt-[10svh] px-6 py-12 lg:py-20">
      <div className="max-w-6xl mx-auto">
        {/* Title on top in the middle */}
        <header className="text-center mb-10 md:mb-16">
          <span className="primary-text-gradient uppercase tracking-widest text-[11px] md:text-xs font-bold block mb-3">
            {t('aboutMe.eyebrow')}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
            {t('aboutMe.name')}
          </h1>
        </header>

        {/* Responsive Layout: Desktop 2-column (Photo left, Text right) / Mobile flex (Title -> Photo -> Text) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          {/* Photo: Left on Desktop / 2nd in mobile order */}
          <div className="relative w-full max-w-[320px] sm:max-w-[360px] md:max-w-[420px] lg:max-w-[460px] mx-auto aspect-[933/1400]">
            <Image
              src="/about-me.jpeg"
              alt={t('aboutMe.imageAlt')}
              fill
              priority
              sizes="(max-width: 768px) 360px, (max-width: 1200px) 440px, 480px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Text: Right on Desktop / 3rd in mobile order */}
          <div className="space-y-4 text-xs leading-relaxed text-zinc-300">
            <p>{t('aboutMe.p1')}</p>
            <p>{t('aboutMe.p2')}</p>
            <p className="font-semibold text-white">
              {t('aboutMe.highlight')}
            </p>
            <p>{t('aboutMe.p3')}</p>
            <p>{t('aboutMe.p4')}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
