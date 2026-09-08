import React from 'react';
import { Metadata } from 'next';
import Navbar from '../components/navbar';
import HeroSection from '../components/hero-section';
import WhatIOfferSection from '../components/what-i-offer';
import AppShowcaseSection from '../components/app-showcase-section';
import PhilosophySection from '../components/philosophy-section';
import Footer from '../components/footer';
import CookieBanner from '../components/cookie-banner';
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
  const { t } = await getServerTranslations(safeLocale);

  const title =
    safeLocale === 'ro'
      ? 'Amazonia - FitLab | Monitorizare Precisă a Fitnessului'
      : 'Amazonia - FitLab | Precision Fitness Tracking';

  const canonicalUrl = safeLocale === 'ro' ? 'https://amazonia-fitlab.ro/' : 'https://amazonia-fitlab.ro/en/';

  return {
    title,
    description: t('hero.description'),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        ro: 'https://amazonia-fitlab.ro/',
        en: 'https://amazonia-fitlab.ro/en/',
        'x-default': 'https://amazonia-fitlab.ro/',
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
      <Navbar locale={safeLocale} />
      <HeroSection locale={safeLocale} />
      <WhatIOfferSection locale={safeLocale} />
      <AppShowcaseSection locale={safeLocale} />
      <PhilosophySection locale={safeLocale} />
      <Footer locale={safeLocale} />
      <CookieBanner locale={safeLocale} />
    </div>
  );
}
