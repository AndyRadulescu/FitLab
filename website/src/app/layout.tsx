import './global.scss';

export const metadata = {
  title: 'Amazonia Fitlab',
  description: 'Tracker for your fitness journey!'
};

export default function RootLayout({ children }: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
    <body>{children}</body>
    </html>
  );
}
