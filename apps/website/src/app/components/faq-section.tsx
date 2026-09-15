import React from 'react';
import { GlassyReflection } from './glassy-reflection';
import { getServerTranslations } from '../i18n/server';
import { defaultLocale, Locale } from '../i18n/utils';
import FaqAccordion, { FaqItem } from './faq-accordion';
import styles from './faq-section.module.scss';

export default async function FaqSection({
  locale = defaultLocale,
}: {
  locale?: Locale;
}) {
  const { t } = await getServerTranslations(locale);

  const faqItems: FaqItem[] = [
    {
      question: t('faq.q1'),
      answer: t('faq.a1'),
    },
    {
      question: t('faq.q2'),
      answer: t('faq.a2'),
    },
    {
      question: t('faq.q3'),
      answer: t('faq.a3'),
    },
    {
      question: t('faq.q4'),
      answer: t('faq.a4'),
    },
    {
      question: t('faq.q5'),
      answer: t('faq.a5'),
    },
    {
      question: t('faq.q6'),
      answer: t('faq.a6'),
    },
  ];

  return (
    <section id="faq" className={styles.section} aria-label={t('faq.eyebrow')}>
      <GlassyReflection showGlowOnMobile={false} showLineOnMobile={true} />

      <div className={styles.container}>
        <header className={styles.header}>
          <span className={styles.eyebrow}>{t('faq.eyebrow')}</span>
          <h2 className={styles.title}>{t('faq.title')}</h2>
          <p className={styles.subtitle}>{t('faq.subtitle')}</p>
        </header>

        <FaqAccordion items={faqItems} defaultOpenIndex={0} />
      </div>
    </section>
  );
}

export { FaqSection };
