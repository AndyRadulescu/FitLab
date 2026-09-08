import React from 'react';
import PhoneMockup from './phone-mockup';
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
        {/* Centered Phone Mockup */}
        <div className={styles.phoneWrapper}>
          <PhoneMockup
            imageSrc="/application-photo.jpg"
            alt={t('appShowcase.imageAlt')}
            priority
          />
        </div>

        {/* Short copy under the phone container */}
        <div className={styles.captionWrapper}>
          <p className={styles.caption}>
            {t('appShowcase.caption')}
          </p>
        </div>
      </div>
    </section>
  );
}
