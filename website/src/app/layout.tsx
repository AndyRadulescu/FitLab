import './global.scss';
import { useTranslation } from 'react-i18next';

export const metadata = {
  title: 'Amazonia Fitlab',
  description: 'Tracker for your fitness journey!'
};

export default function RootLayout({ children }: {
  children: React.ReactNode;
}) {
  const { i18n } = useTranslation();
  console.log(i18n.language);
  return (
    <html lang={i18n.language}>
    <body>{children}</body>
    </html>
  );
}
