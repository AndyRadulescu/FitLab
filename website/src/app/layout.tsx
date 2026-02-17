import './global.scss';
import Footer from './components/footer';

export const metadata = {
  title: 'Amazonia Fitlab',
  description: 'Amazonia FitLab isn\'t just an app; it\'s a digital laboratory for your body. Quantify your mood, track every centimeter of progress, and master the metrics that matter.'
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
