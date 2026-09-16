import React from 'react';
import {
  ClipboardCheck,
  Dumbbell,
  UtensilsCrossed,
  HeartPulse,
} from 'lucide-react';
import PhoneMockup from './phone-mockup';
import FeatureCard from './feature-card';
import MobileCardsScroller from './mobile-cards-scroller';
import { GlassyReflection } from './glassy-reflection';
import { getServerTranslations } from '../i18n/server';
import { defaultLocale, Locale } from '../i18n/utils';
import styles from './app-showcase-section.module.scss';

export default async function AppShowcaseSection({
  locale = defaultLocale,
}: {
  locale?: Locale;
}) {
  const { t } = await getServerTranslations(locale);

  return (
    <section id="app-showcase" className={styles.showcaseSection} aria-label={t('appShowcase.eyebrow')}>
      <GlassyReflection showGlowOnMobile={false} showLineOnMobile={true} />
      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.header}>
          <h2 className={styles.eyebrow}>
            {t('appShowcase.eyebrow')}
          </h2>
          <h3 className={styles.title}>
            {t('appShowcase.title')}
          </h3>
          <p className={styles.subtitle}>
            {t('appShowcase.subtitle')}
          </p>
        </div>

        {/* Showcase Grid */}
        <div className={styles.showcaseGrid}>
          {/* Left Column: Weekly Check-ins & Workout Tracker */}
          <div className={styles.featureColumnLeft}>
            <FeatureCard
              icon={<ClipboardCheck size={24} />}
              title={t('appShowcase.features.checkins.title')}
              description={t('appShowcase.features.checkins.description')}
              tags={[
                t('appShowcase.features.checkins.tag1'),
                t('appShowcase.features.checkins.tag2'),
                t('appShowcase.features.checkins.tag3'),
              ]}
            />

            <FeatureCard
              icon={<Dumbbell size={24} />}
              title={t('appShowcase.features.workouts.title')}
              description={t('appShowcase.features.workouts.description')}
              tags={[
                t('appShowcase.features.workouts.tag1'),
                t('appShowcase.features.workouts.tag2'),
                t('appShowcase.features.workouts.tag3'),
              ]}
            />
          </div>

          {/* Center Column: Phone Mockup */}
          <div className={styles.phoneColumn}>
            <div className={styles.phoneGlow} aria-hidden="true" />
            <PhoneMockup
              imageSrc="/application-photo.jpg"
              alt={t('appShowcase.imageAlt')}
              priority
            />
          </div>

          {/* Right Column: Food Library & Overall Health Hub */}
          <div className={styles.featureColumnRight}>
            <FeatureCard
              icon={<UtensilsCrossed size={24} />}
              title={t('appShowcase.features.nutrition.title')}
              description={t('appShowcase.features.nutrition.description')}
              tags={[
                t('appShowcase.features.nutrition.tag1'),
                t('appShowcase.features.nutrition.tag2'),
                t('appShowcase.features.nutrition.tag3'),
              ]}
            />

            <FeatureCard
              icon={<HeartPulse size={24} />}
              title={t('appShowcase.features.health.title')}
              description={t('appShowcase.features.health.description')}
              tags={[
                t('appShowcase.features.health.tag1'),
                t('appShowcase.features.health.tag2'),
                t('appShowcase.features.health.tag3'),
              ]}
            />
          </div>
        </div>

        {/* Mobile Horizontal Scroller (visible on <768px, hidden on >768px) */}
        <div className={styles.mobileScrollerWrapper}>
          <MobileCardsScroller>
            <FeatureCard
              icon={<ClipboardCheck size={24} />}
              title={t('appShowcase.features.checkins.title')}
              description={t('appShowcase.features.checkins.description')}
              tags={[
                t('appShowcase.features.checkins.tag1'),
                t('appShowcase.features.checkins.tag2'),
                t('appShowcase.features.checkins.tag3'),
              ]}
            />
            <FeatureCard
              icon={<Dumbbell size={24} />}
              title={t('appShowcase.features.workouts.title')}
              description={t('appShowcase.features.workouts.description')}
              tags={[
                t('appShowcase.features.workouts.tag1'),
                t('appShowcase.features.workouts.tag2'),
                t('appShowcase.features.workouts.tag3'),
              ]}
            />
            <FeatureCard
              icon={<UtensilsCrossed size={24} />}
              title={t('appShowcase.features.nutrition.title')}
              description={t('appShowcase.features.nutrition.description')}
              tags={[
                t('appShowcase.features.nutrition.tag1'),
                t('appShowcase.features.nutrition.tag2'),
                t('appShowcase.features.nutrition.tag3'),
              ]}
            />
            <FeatureCard
              icon={<HeartPulse size={24} />}
              title={t('appShowcase.features.health.title')}
              description={t('appShowcase.features.health.description')}
              tags={[
                t('appShowcase.features.health.tag1'),
                t('appShowcase.features.health.tag2'),
                t('appShowcase.features.health.tag3'),
              ]}
            />
          </MobileCardsScroller>
        </div>

        {/* Short copy under the phone and features */}
        <div className={styles.captionWrapper}>
          <p className={styles.caption}>
            {t('appShowcase.caption')}
          </p>
        </div>
      </div>
    </section>
  );
}
