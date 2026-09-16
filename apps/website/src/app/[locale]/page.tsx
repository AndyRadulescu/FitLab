import React from 'react';
import { Metadata } from 'next';
import HeroSection from '../components/hero-section';
import WhatIOfferSection from '../components/what-i-offer';
import MeetCoachSection from '../components/meet-coach-section';
import AppShowcaseSection from '../components/app-showcase-section';
import FaqSection from '../components/faq-section';
import PhilosophySection from '../components/philosophy-section';
import FinalCtaSection from '../components/final-cta-section';
import { getServerTranslations } from '../i18n/server';
import { supportedLocales, isValidLocale, defaultLocale } from '../i18n/utils';

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
  const isRo = safeLocale === 'ro';

  const title = isRo
    ? 'Diana Bucelea | Amazonia - FitLab | Antrenor Personal & Nutriție'
    : 'Diana Bucelea | Amazonia - FitLab | Personal Trainer & Nutrition Coach';

  const description = isRo
    ? 'Diana Bucelea - Antrenor personal și nutriționist certificat la Amazonia FitLab. Antrenamente personalizate bazate pe știință, nutriție sustenabilă și monitorizare prin aplicația FitLab.'
    : 'Diana Bucelea - Certified personal trainer & nutritionist at Amazonia FitLab. Science-backed customized workout and nutrition programs tailored to your lifestyle.';

  const canonicalUrl =
    safeLocale === 'ro'
      ? 'https://amazonia-fitlab.ro/ro/'
      : 'https://amazonia-fitlab.ro/en/';

  return {
    title: {
      absolute: title,
    },
    description,
    keywords: [
      'Diana Bucelea',
      'diana bucelea',
      'Diana Bucelea fitness',
      'Diana Bucelea antrenor',
      'Diana Bucelea nutritionist',
      'Amazonia FitLab',
      'amazonia fitlab',
      'antrenor personal bucuresti',
      'coaching fitness',
      'nutritie personalizata',
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
          url: '/amazonia-fitlab.jpg',
          width: 1200,
          height: 630,
          alt: 'Diana Bucelea - Amazonia FitLab',
        },
        {
          url: '/about-me.jpeg',
          width: 933,
          height: 1400,
          alt: 'Diana Bucelea - Antrenor Personal & Nutriționist',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/amazonia-fitlab.jpg'],
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: 'https://amazonia-fitlab.ro/en/',
        ro: 'https://amazonia-fitlab.ro/ro/',
        'x-default': 'https://amazonia-fitlab.ro/en/',
      },
    },
  };
}

export default async function LocalizedLandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale = isValidLocale(locale) ? locale : defaultLocale;

  return (
    <div className="auth-theme-trigger min-h-screen bg-black text-white selection:bg-primary selection:text-white">
      <HeroSection locale={safeLocale} />
      <WhatIOfferSection locale={safeLocale} />
      <MeetCoachSection locale={safeLocale} />
      <AppShowcaseSection locale={safeLocale} />
      <FaqSection locale={safeLocale} />
      <PhilosophySection locale={safeLocale} />
      <FinalCtaSection locale={safeLocale} />
    </div>
  );
}
