import React from 'react';
import { Metadata } from 'next';
import Navbar from './components/navbar';
import HeroSection from './components/hero-section';
import WhatIOfferSection from './components/what-i-offer';
import PhilosophySection from './components/philosophy-section';
import Footer from './components/footer';
import CookieBanner from './components/cookie-banner';
import { getServerTranslations } from './i18n/server';
import { defaultLocale } from './i18n/utils';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerTranslations(defaultLocale);
  return {
    title: 'Amazonia - FitLab | Monitorizare Precisă a Fitnessului',
    description: t('hero.description'),
    alternates: {
      canonical: 'https://amazonia-fitlab.ro/',
      languages: {
        ro: 'https://amazonia-fitlab.ro/',
        en: 'https://amazonia-fitlab.ro/en/',
        'x-default': 'https://amazonia-fitlab.ro/',
      },
    },
  };
}

export default async function RootPage() {
  return (
    <div className="auth-theme-trigger min-h-screen bg-black text-white selection:bg-primary selection:text-white">
      <Navbar locale={defaultLocale} />
      <HeroSection locale={defaultLocale} />
      <WhatIOfferSection locale={defaultLocale} />
      <PhilosophySection locale={defaultLocale} />
      <Footer locale={defaultLocale} />
      <CookieBanner locale={defaultLocale} />
    </div>
  );
}
