import './global.scss';
import { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://amazonia-fitlab.ro/'),
  title: {
    default: 'Diana Bucelea | Amazonia - FitLab | Personal Trainer & Nutritionist',
    template: '%s | Diana Bucelea - Amazonia FitLab',
  },
  description:
    'Diana Bucelea - Antrenor personal și nutriționist certificat la Amazonia FitLab. Programe personalizate de fitness și nutriție bazate pe știință, fără restricții absurde, asistate de aplicația FitLab.',
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
    'online coaching fitness',
    'body transformation',
    'ISSA certified personal trainer',
    'precision nutrition coach',
  ],
  authors: [
    { name: 'Diana Bucelea', url: 'https://www.instagram.com/dianabucelea/' },
    { name: 'Amazonia FitLab', url: 'https://amazonia-fitlab.ro/' },
  ],
  creator: 'Diana Bucelea',
  publisher: 'Amazonia - FitLab',
  category: 'fitness',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Diana Bucelea | Amazonia - FitLab | Personal Trainer & Nutritionist',
    description:
      'Diana Bucelea - Antrenor personal și nutriționist certificat la Amazonia FitLab. Programe personalizate de fitness și nutriție bazate pe știință, fără restricții absurde.',
    url: 'https://amazonia-fitlab.ro/',
    siteName: 'Diana Bucelea | Amazonia - FitLab',
    images: [
      {
        url: '/amazonia-fitlab.jpg',
        width: 1200,
        height: 630,
        alt: 'Diana Bucelea - Amazonia FitLab Landing page',
      },
      {
        url: '/about-me.jpeg',
        width: 933,
        height: 1400,
        alt: 'Diana Bucelea - Antrenor Personal & Nutriționist',
      },
    ],
    locale: 'ro_RO',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Diana Bucelea | Amazonia - FitLab | Personal Trainer & Nutritionist',
    description:
      'Diana Bucelea - Antrenor personal și nutriționist certificat la Amazonia FitLab. Programe personalizate de fitness și nutriție bazate pe știință, fără restricții absurde.',
    images: ['/amazonia-fitlab.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'cWpDXCgw5xLtm1XLCUipCC5Q1kG7TZKqrBvofMsMy6k',
  },
};

// html/body are rendered by [locale]/layout.tsx so that lang={locale} is set
// dynamically per page without client-side JavaScript.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children as React.ReactElement;
}
