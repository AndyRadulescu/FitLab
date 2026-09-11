import React, { Suspense } from 'react';
import { Analytics } from '@vercel/analytics/next';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import CookieBanner from '../components/cookie-banner';
import { supportedLocales, isValidLocale, defaultLocale, Locale } from '../i18n/utils';

export function generateStaticParams() {
  return supportedLocales.map((locale) => ({ locale }));
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

  return (
    <html lang={safeLocale}>
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
