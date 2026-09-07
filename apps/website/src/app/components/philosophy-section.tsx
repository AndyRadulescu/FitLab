import React from 'react';
import { GlassyReflection } from './glassy-reflection';
import { getServerTranslations } from '../i18n/server';
import { defaultLocale, Locale } from '../i18n/utils';

export default async function PhilosophySection({
  locale = defaultLocale,
}: {
  locale?: Locale;
}) {
  const { t } = await getServerTranslations(locale);

  return (
    <section className="relative px-6 py-32 text-center max-w-4xl mx-auto overflow-hidden">
      <GlassyReflection showGlowOnMobile={true} showLineOnMobile={true} />
      <div className="relative z-10">
        <blockquote className="text-2xl md:text-4xl font-light italic text-gray-300">
          {t('philosophy.quote')}
        </blockquote>
        <div className="mt-8 flex items-center justify-center gap-3">
          <div className="h-[1px] w-8 primary-gradient"></div>
          <span className="primary-text-gradient font-bold tracking-widest uppercase text-sm">
            {t('philosophy.tag')}
          </span>
          <div className="h-[1px] w-8 primary-gradient"></div>
        </div>
      </div>
    </section>
  );
}
