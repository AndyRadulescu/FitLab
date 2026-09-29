import React from 'react';
import { Metadata } from 'next';
import ResultsSection from '../../components/results-section';
import FoodSection from '../../components/food-section';
import TestimonialsSection from '../../components/testimonials-section';
import { getServerTranslations } from '../../i18n/server';
import { supportedLocales, isValidLocale, defaultLocale } from '../../i18n/utils';

export function generateStaticParams() {
  return supportedLocales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale = isValidLocale(locale) ? locale : defaultLocale;
  const { t } = await getServerTranslations(safeLocale);

  const title = t('testimonialsPage.metaTitle');
  const description = t('testimonialsPage.metaDescription');
  const canonicalUrl =
    safeLocale === 'ro'
      ? 'https://amazonia-fitlab.ro/ro/testimonials/'
      : 'https://amazonia-fitlab.ro/en/testimonials/';

  const isRo = safeLocale === 'ro';

  return {
    title: {
      absolute: title,
    },
    description,
    keywords: [
      'Diana Bucelea',
      'diana bucelea',
      'Diana Bucelea rezultate',
      'Diana Bucelea testimoniale',
      'Diana Bucelea transformari',
      'Diana Bucelea pareri clienti',
      'Diana Bucelea nutritie',
      'antrenor personal bucuresti rezultate',
      'coaching fitness pareri',
      'Amazonia FitLab',
    ],
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Diana Bucelea | Amazonia - FitLab',
      locale: isRo ? 'ro_RO' : 'en_US',
      type: 'website',
      images: [
        {
          url: '/results/IMG_8708.JPG',
          width: 1200,
          height: 630,
          alt: isRo
            ? 'Transformări și Testimoniale Clienți - Diana Bucelea'
            : 'Client Transformations & Testimonials - Diana Bucelea',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/results/IMG_8708.JPG'],
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: 'https://amazonia-fitlab.ro/en/testimonials/',
        ro: 'https://amazonia-fitlab.ro/ro/testimonials/',
        'x-default': 'https://amazonia-fitlab.ro/en/testimonials/',
      },
    },
  };
}

export default async function LocalizedTestimonialsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale = isValidLocale(locale) ? locale : defaultLocale;
  const { t } = await getServerTranslations(safeLocale);

  return (
    <main className="auth-theme-trigger bg-black text-zinc-300 selection:bg-primary selection:text-white mt-[8svh] md:mt-[10svh]">
      {/* Page Title & Intro Header */}
      <section className="px-6 pt-12 pb-6 md:pt-16 md:pb-8 text-center max-w-4xl mx-auto">
        <span className="primary-text-gradient uppercase tracking-widest text-[11px] md:text-xs font-bold block mb-3">
          {t('testimonialsPage.eyebrow')}
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-4">
          {t('testimonialsPage.title')}
        </h1>
        <p className="text-sm md:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          {t('testimonialsPage.subtitle')}
        </p>
      </section>

      {/* Section 1: Results (Desktop masonry, Mobile scroller, starts with p3) */}
      <ResultsSection locale={safeLocale} />

      {/* Section 2: Food (Desktop masonry, Mobile scroller, starts with p4) */}
      <FoodSection locale={safeLocale} />

      {/* Section 3: Testimonials (Always horizontal scroller on desktop and mobile) */}
      <TestimonialsSection locale={safeLocale} />
    </main>
  );
}
