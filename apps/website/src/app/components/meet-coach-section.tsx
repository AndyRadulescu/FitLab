import React from 'react';
import Image from 'next/image';
import { Award, ArrowRight, CheckCircle2 } from 'lucide-react';
import { GlassyReflection } from './glassy-reflection';
import { getServerTranslations } from '../i18n/server';
import { defaultLocale, Locale } from '../i18n/utils';
import MetallicButton from './metallic-button';

export default async function MeetCoachSection({
  locale = defaultLocale,
}: {
  locale?: Locale;
}) {
  const { t } = await getServerTranslations(locale);

  const credentials = [
    t('meetCoach.badge1'),
    t('meetCoach.badge2'),
    t('meetCoach.badge3'),
  ];

  return (
    <section
      id="meet-coach"
      className="relative px-6 py-24 bg-black/80 border-b border-zinc-900 scroll-mt-12 overflow-hidden"
      aria-label={t('meetCoach.eyebrow')}
    >
      <GlassyReflection showGlowOnMobile={false} showLineOnMobile={true} />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Coach Portrait Column */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[320px] sm:max-w-[360px] lg:max-w-[380px] aspect-[933/1300] rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl bg-zinc-950 group">
              <Image
                src="/about-me.jpeg"
                alt={t('meetCoach.imageAlt')}
                fill
                sizes="(max-width: 768px) 340px, (max-width: 1200px) 380px, 420px"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

              {/* Floating Credential Pill on Image */}
              <div className="absolute bottom-5 left-5 right-5 p-3.5 rounded-2xl bg-zinc-900/80 backdrop-blur-md border border-zinc-700/60 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary shrink-0">
                  <Award size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-white font-bold text-xs truncate">
                    {t('meetCoach.name')}
                  </p>
                  <p className="text-zinc-400 text-[11px] truncate">
                    {t('meetCoach.role')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Coach Bio & Highlights Column */}
          <div className="lg:col-span-7 flex flex-col items-start">
            <span className="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-3">
              {t('meetCoach.eyebrow')}
            </span>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-2">
              {t('meetCoach.name')}
            </h2>

            <p className="text-zinc-400 font-medium text-base sm:text-lg mb-6">
              {t('meetCoach.role')}
            </p>

            <p className="text-zinc-300 text-base leading-relaxed mb-4">
              {t('meetCoach.bio')}
            </p>

            <p className="text-zinc-200 font-semibold text-sm sm:text-base border-l-2 border-primary pl-4 py-1 mb-8 bg-zinc-900/30 rounded-r-lg">
              {t('meetCoach.highlight')}
            </p>

            {/* Credential Checkmarks */}
            <div className="w-full space-y-2.5 mb-8">
              {credentials.map((badge, idx) => (
                <div
                  key={`coach-badge-${idx}`}
                  className="flex items-center gap-2.5 text-zinc-300 text-xs sm:text-sm font-medium"
                >
                  <CheckCircle2 size={16} className="text-amber-400 shrink-0" />
                  <span>{badge}</span>
                </div>
              ))}
            </div>

            {/* Link to About Me Page */}
            <MetallicButton
              href={`/${locale}/about-me`}
              size="md"
              icon={<ArrowRight size={18} />}
            >
              {t('meetCoach.cta')}
            </MetallicButton>
          </div>
        </div>
      </div>
    </section>
  );
}

export { MeetCoachSection };
