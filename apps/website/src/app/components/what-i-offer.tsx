import React from 'react';
import { Activity, Camera, LineChart } from 'lucide-react';
import { GlassyReflection } from './glassy-reflection';
import { getServerTranslations } from '../i18n/server';
import { defaultLocale, Locale } from '../i18n/utils';

export default async function WhatIOfferSection({
  locale = defaultLocale,
}: {
  locale?: Locale;
}) {
  const { t } = await getServerTranslations(locale);

  return (
    <section
      id="what-i-offer"
      className="relative px-6 py-24 bg-zinc-950/50 border-y border-zinc-900 scroll-mt-12 overflow-hidden"
    >
      <GlassyReflection showGlowOnMobile={true} showLineOnMobile={true} />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-3">
            {t('whatIOffer.eyebrow')}
          </h2>
          <h3 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
            {t('whatIOffer.title')}
          </h3>
          <p className="text-gray-400 text-base md:text-lg">
            {t('whatIOffer.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4 p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/60">
            <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center text-primary">
              <Activity size={24} />
            </div>
            <h4 className="text-xl font-bold">{t('whatIOffer.card1Title')}</h4>
            <p className="text-gray-400">
              {t('whatIOffer.card1Desc')}
            </p>
          </div>

          <div className="space-y-4 p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/60">
            <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center text-primary">
              <Camera size={24} />
            </div>
            <h4 className="text-xl font-bold">{t('whatIOffer.card2Title')}</h4>
            <p className="text-gray-400">
              {t('whatIOffer.card2Desc')}
            </p>
          </div>

          <div className="space-y-4 p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/60">
            <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center text-primary">
              <LineChart size={24} />
            </div>
            <h4 className="text-xl font-bold">{t('whatIOffer.card3Title')}</h4>
            <p className="text-gray-400">
              {t('whatIOffer.card3Desc')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
