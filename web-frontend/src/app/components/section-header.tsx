import { ReactNode } from 'react';

export function SectionHeader({ children }: { children: ReactNode }) {
  return <h2 className="text-xl font-bold mb-2 text-gray-700 dark:text-white">{children}</h2>;
}
