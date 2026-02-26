import './global.scss';
import Footer from './components/footer';
import CookieBanner from './components/cookie-banner';
import { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://amazonia-fitlab.ro/'),
  title: 'Amazonia - FitLab | Precision Fitness Tracking',
  description: 'Amazonia - FitLab isn\'t just an app; it\'s a digital laboratory for your body. Quantify your mood, track every centimeter of progress, and master the metrics that matter.',
  keywords: ['fitness tracking', 'mood tracking', 'body measurements', 'progress photos', 'workout log', 'health metrics', 'Amazonia FitLab', 'biometric precision', 'fitness app', 'body transformation', 'gym progress', 'health laboratory'],
  authors: [{ name: 'Amazonia FitLab' }],
  category: 'fitness',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Amazonia - FitLab | Precision Fitness Tracking',
    description: 'Amazonia - FitLab isn\'t just an app; it\'s a digital laboratory for your body. Quantify your mood, track every centimeter of progress, and master the metrics that matter.',
    url: 'https://amazonia-fitlab.ro/',
    siteName: 'Amazonia - FitLab',
    images: [
      {
        url: '/amazonia-fitlab.jpg',
        width: 1200,
        height: 630,
        alt: 'Amazonia - FitLab Landing page',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Amazonia - FitLab | Precision Fitness Tracking',
    description: 'Amazonia - FitLab isn\'t just an app; it\'s a digital laboratory for your body. Quantify your mood, track every centimeter of progress, and master the metrics that matter.',
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
  }
};

export default function RootLayout({ children }: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
    <body>
    {children}
    <Footer />
    <CookieBanner />
    </body>
    </html>
  );
}
