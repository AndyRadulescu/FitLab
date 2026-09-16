import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import CookieBanner from '../components/cookie-banner';
import {
  supportedLocales,
  isValidLocale,
  defaultLocale,
  Locale,
} from '../i18n/utils';

export function generateStaticParams() {
  return supportedLocales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale: Locale = isValidLocale(locale) ? locale : defaultLocale;
  const isRo = safeLocale === 'ro';

  const title = isRo
    ? 'Diana Bucelea | Amazonia - FitLab | Antrenor Personal & Nutriționist'
    : 'Diana Bucelea | Amazonia - FitLab | Personal Trainer & Nutritionist';

  const description = isRo
    ? 'Diana Bucelea - Antrenor personal și nutriționist certificat la Amazonia FitLab. Programe personalizate de fitness și nutriție bazate pe știință, fără restricții absurde, asistate de aplicația FitLab.'
    : 'Diana Bucelea - Certified personal trainer and nutritionist at Amazonia FitLab. Science-backed customized workout and nutrition programs tailored to your lifestyle.';

  return {
    title: {
      default: title,
      template: isRo
        ? '%s | Diana Bucelea - Amazonia FitLab'
        : '%s | Diana Bucelea - Amazonia FitLab',
    },
    description,
    keywords: [
      'Diana Bucelea',
      'diana bucelea',
      'Diana Bucelea fitness',
      'Diana Bucelea antrenor personal',
      'Diana Bucelea nutritionist',
      'Diana Bucelea coaching',
      'Amazonia FitLab',
      'amazonia fitlab',
      'antrenor personal bucuresti',
      'nutritie personalizata',
      'fitness tracking',
      'coaching fitness romania',
      'online personal trainer',
      'ISSA personal trainer',
      'precision nutrition coach',
    ],
    authors: [
      { name: 'Diana Bucelea', url: 'https://www.instagram.com/dianabucelea/' },
      { name: 'Amazonia FitLab', url: 'https://amazonia-fitlab.ro' },
    ],
    creator: 'Diana Bucelea',
    publisher: 'Amazonia - FitLab',
    metadataBase: new URL('https://amazonia-fitlab.ro/'),
    alternates: {
      canonical: `https://amazonia-fitlab.ro/${safeLocale}/`,
      languages: {
        en: 'https://amazonia-fitlab.ro/en/',
        ro: 'https://amazonia-fitlab.ro/ro/',
        'x-default': 'https://amazonia-fitlab.ro/en/',
      },
    },
    openGraph: {
      title,
      description,
      url: `https://amazonia-fitlab.ro/${safeLocale}/`,
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
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale: Locale = isValidLocale(locale) ? locale : defaultLocale;
  const isRo = safeLocale === 'ro';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': 'https://amazonia-fitlab.ro/#dianabucelea',
        name: 'Diana Bucelea',
        givenName: 'Diana',
        familyName: 'Bucelea',
        gender: 'Female',
        jobTitle: isRo
          ? 'Antrenor Personal & Nutriționist'
          : 'Personal Trainer & Nutritionist',
        url: `https://amazonia-fitlab.ro/${safeLocale}/about-me`,
        image: 'https://amazonia-fitlab.ro/about-me.jpeg',
        description: isRo
          ? 'Diana Bucelea este antrenor personal și nutriționist certificat (ISSA, Precision Nutrition, Henselmans PT). Oferă coaching 1-la-1 în sală și online, cu nutriție personalizată și monitorizare precisă prin aplicația FitLab.'
          : 'Diana Bucelea is a certified personal trainer and nutritionist (ISSA, Precision Nutrition, Henselmans PT). Provides 1-on-1 in-person and online coaching, custom nutrition, and precision tracking with FitLab.',
        worksFor: {
          '@type': 'Organization',
          '@id': 'https://amazonia-fitlab.ro/#organization',
          name: 'Amazonia - FitLab',
          url: 'https://amazonia-fitlab.ro',
        },
        sameAs: ['https://www.instagram.com/dianabucelea/'],
        knowsAbout: [
          'Personal Training',
          'Clinical Nutrition',
          'Fitness Coaching',
          'Strength Training',
          'Body Composition',
          'Flexible Dieting',
        ],
      },
      {
        '@type': 'SportsActivityLocation',
        '@id': 'https://amazonia-fitlab.ro/#organization',
        name: 'Amazonia - FitLab',
        alternateName: ['FitLab', 'Amazonia FitLab'],
        url: 'https://amazonia-fitlab.ro',
        logo: 'https://amazonia-fitlab.ro/logo.svg',
        image: 'https://amazonia-fitlab.ro/amazonia-fitlab.jpg',
        founder: {
          '@id': 'https://amazonia-fitlab.ro/#dianabucelea',
        },
        description: isRo
          ? 'Fitness și nutriție personalizate bazate pe știința actuală create de Diana Bucelea. Antrenamente 1-la-1 și aplicația mobilă FitLab.'
          : 'Personalized fitness and nutrition coaching based on current science by Diana Bucelea. 1-on-1 coaching and FitLab companion mobile app.',
        sameAs: ['https://www.instagram.com/dianabucelea/'],
      },
      {
        '@type': 'WebSite',
        '@id': 'https://amazonia-fitlab.ro/#website',
        url: 'https://amazonia-fitlab.ro',
        name: 'Diana Bucelea | Amazonia - FitLab',
        publisher: {
          '@id': 'https://amazonia-fitlab.ro/#organization',
        },
        inLanguage: isRo ? 'ro-RO' : 'en-US',
      },
    ],
  };

  return (
    <html lang={safeLocale}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Navbar locale={safeLocale} />
        {children}
        <Footer locale={safeLocale} />
        <CookieBanner locale={safeLocale} />
        <Suspense>
          <Analytics />
        </Suspense>
      </body>
    </html>
  );
}
