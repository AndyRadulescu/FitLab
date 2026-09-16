import React from 'react';
import Image from 'next/image';
import { GlassyReflection } from './glassy-reflection';
import { getServerTranslations } from '../i18n/server';
import { defaultLocale, Locale } from '../i18n/utils';
import MetallicButton from './metallic-button';

export default async function FinalCtaSection({
  locale = defaultLocale,
}: {
  locale?: Locale;
}) {
  const { t } = await getServerTranslations(locale);

  return (
    <section
      id="contact"
      className="relative px-6 py-24 md:py-32 bg-gradient-to-b from-black via-zinc-950 to-black overflow-hidden border-t border-zinc-900 text-center"
      aria-label={t('finalCta.eyebrow')}
    >
      <GlassyReflection showGlowOnMobile={true} showLineOnMobile={true} />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Glow ambient background pill */}
        <div className="relative rounded-3xl p-8 sm:p-12 md:p-16 border border-zinc-800 bg-zinc-900/40 backdrop-blur-xl shadow-2xl overflow-hidden">
          <div
            className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-primary/15 blur-3xl rounded-full pointer-events-none"
            aria-hidden="true"
          />

          <span className="text-primary font-bold uppercase tracking-[0.25em] text-xs inline-block mb-3">
            {t('finalCta.eyebrow')}
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            {t('finalCta.title')}
          </h2>

          <p className="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            {t('finalCta.subtitle')}
          </p>

          <div className="flex justify-center items-center">
            <MetallicButton
              href="https://www.instagram.com/dianabucelea/"
              target="_blank"
              rel="noopener noreferrer"
              size="lg"
              className="px-8 sm:px-10 py-3.5 w-full"
              icon={
                <Image
                  src="/insta-white.svg"
                  alt=""
                  width={18}
                  height={18}
                  className="brightness-0 shrink-0"
                />
              }
            >
              {t('finalCta.buttonText')}
            </MetallicButton>
          </div>
        </div>
      </div>
    </section>
  );
}

export { FinalCtaSection };
