'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

export default function Footer() {
  const pathname = usePathname();
  console.log(pathname);
  const navLinks = [
    { href: '/privacy-policy/', label: 'Privacy Policy' },
    { href: '/terms/', label: 'Terms of use' },
    { href: '/data-deletion/', label: 'Data Deletion' },
  ];

  return (
    <footer className="px-6 py-12 border-t border-zinc-900 text-gray-600">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-sm">
          &copy; 2026 AMAZONIA - FITLAB. SCIENCE-BACKED FITNESS.
        </div>
        <div className="flex gap-8 text-sm font-medium">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                'hover:text-white',
                pathname === href && 'text-primary'
              )}
            >
              {label}
            </Link>
          ))}
          <a href="mailto:andyradulescu@synapselabs.org" className="hover:text-white">Contact</a>
        </div>
      </div>
    </footer>
  );
}
