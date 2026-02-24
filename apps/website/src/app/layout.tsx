import './global.scss';
import Footer from './components/footer';

export const metadata = {
  title: 'Amazonia - FitLab',
  description: 'Amazonia - FitLab isn\'t just an app; it\'s a digital laboratory for your body. Quantify your mood, track every centimeter of progress, and master the metrics that matter.',
  openGraph: {
    title: 'Amazonia - FitLab',
    description: 'Amazonia - FitLab isn\'t just an app; it\'s a digital laboratory for your body. Quantify your mood, track every centimeter of progress, and master the metrics that matter.',
    url: 'https://amazonia-fitlab.ro/',
    images: [
      {
        url: 'https://amazonia-fitlab.ro/amazonia-fitlab.jpg',
        width: 1200,
        height: 630,
        alt: 'Amazonia - FitLab Landing page',
      },
    ],
    type: 'website',
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
    </body>
    </html>
  );
}
