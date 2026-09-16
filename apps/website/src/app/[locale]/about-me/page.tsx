import React from 'react';
import { Metadata } from 'next';
import AboutMeContent from '../../components/about-me-content';
import DiplomasGrid from '../../components/diplomas-grid';
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

  const title = t('aboutMe.metaTitle');
  const description = t('aboutMe.metaDescription');
  const canonicalUrl =
    safeLocale === 'ro'
      ? 'https://amazonia-fitlab.ro/ro/about-me/'
      : 'https://amazonia-fitlab.ro/en/about-me/';

  const isRo = safeLocale === 'ro';

  return {
    title: {
      absolute: title,
    },
    description,
    keywords: [
      'Diana Bucelea',
      'diana bucelea',
      'Diana Bucelea despre mine',
      'Diana Bucelea diplome',
      'Diana Bucelea certificari',
      'Diana Bucelea antrenor personal',
      'Diana Bucelea nutritionist',
      'Diana Bucelea ISSA',
      'Diana Bucelea Precision Nutrition',
      'Amazonia FitLab',
    ],
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Diana Bucelea | Amazonia - FitLab',
      locale: isRo ? 'ro_RO' : 'en_US',
      type: 'profile',
      images: [
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
      images: ['/about-me.jpeg'],
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: 'https://amazonia-fitlab.ro/en/about-me/',
        ro: 'https://amazonia-fitlab.ro/ro/about-me/',
        'x-default': 'https://amazonia-fitlab.ro/en/about-me/',
      },
    },
  };
}

export default async function LocalizedAboutMePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale = isValidLocale(locale) ? locale : defaultLocale;

  return (
    <>
      <AboutMeContent locale={safeLocale} />
      <DiplomasGrid locale={safeLocale} />
    </>
  );
}
