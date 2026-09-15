import React from 'react';
import { Activity, Camera, LineChart } from 'lucide-react';
import { GlassyReflection } from './glassy-reflection';
import FeatureCard from './feature-card';
import CoachingWorkflow from './coaching-workflow';
import { getServerTranslations } from '../i18n/server';
import { defaultLocale, Locale } from '../i18n/utils';

export default async function WhatIOfferSection({
  locale = defaultLocale,
}: {
  locale?: Locale;
}) {
  const { t } = await getServerTranslations(locale);

  const workflowSteps = [
    {
      tag: t('whatIOffer.workflow.step1Tag'),
      title: t('whatIOffer.workflow.step1Title'),
      description: t('whatIOffer.workflow.step1Desc'),
    },
    {
      tag: t('whatIOffer.workflow.step2Tag'),
      title: t('whatIOffer.workflow.step2Title'),
      description: t('whatIOffer.workflow.step2Desc'),
    },
    {
      tag: t('whatIOffer.workflow.step3Tag'),
      title: t('whatIOffer.workflow.step3Title'),
      description: t('whatIOffer.workflow.step3Desc'),
    },
    {
      tag: t('whatIOffer.workflow.step4Tag'),
      title: t('whatIOffer.workflow.step4Title'),
      description: t('whatIOffer.workflow.step4Desc'),
    },
    {
      tag: t('whatIOffer.workflow.step5Tag'),
      title: t('whatIOffer.workflow.step5Title'),
      description: t('whatIOffer.workflow.step5Desc'),
    },
  ];

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <FeatureCard
            icon={<Activity size={24} />}
            title={t('whatIOffer.card1Title')}
            description={t('whatIOffer.card1Desc')}
          />
          <FeatureCard
            icon={<Camera size={24} />}
            title={t('whatIOffer.card2Title')}
            description={t('whatIOffer.card2Desc')}
          />
          <FeatureCard
            icon={<LineChart size={24} />}
            title={t('whatIOffer.card3Title')}
            description={t('whatIOffer.card3Desc')}
          />
        </div>

        {/* Workflow / Coaching Journey Section (Git Source Tree) */}
        <div className="mt-28 md:mt-36 pt-16 border-t border-zinc-900/80">
          <CoachingWorkflow
            eyebrow={t('whatIOffer.workflow.eyebrow')}
            title={t('whatIOffer.workflow.title')}
            subtitle={t('whatIOffer.workflow.subtitle')}
            steps={workflowSteps}
          />
        </div>
      </div>
    </section>
  );
}
