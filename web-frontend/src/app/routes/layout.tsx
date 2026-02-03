import { Analytics } from '../analytics-tracker';
import { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Analytics />
      {children}
    </>
  );
}
