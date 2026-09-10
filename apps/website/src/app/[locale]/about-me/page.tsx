import React from 'react';
import { Metadata } from 'next';
import AboutMeContent from '../../components/about-me-content';
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

  return {
    title,
    description,
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

  return <AboutMeContent locale={safeLocale} />;
}
