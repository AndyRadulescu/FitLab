'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { getClientTranslations } from '../i18n/client';
import { defaultLocale } from '../i18n/utils';

export interface FooterTranslations {
  copyright?: string;
  privacyPolicy?: string;
  terms?: string;
  dataDeletion?: string;
  contact?: string;
}

interface FooterProps {
  locale?: string;
  translations?: FooterTranslations;
}

export default function Footer({ locale = defaultLocale, translations }: FooterProps) {
  const t = getClientTranslations(locale);
  const copyright = translations?.copyright || t.footer.copyright;
  const privacyPolicy = translations?.privacyPolicy || t.footer.privacyPolicy;
  const terms = translations?.terms || t.footer.terms;
  const dataDeletion = translations?.dataDeletion || t.footer.dataDeletion;
  const contact = translations?.contact || t.footer.contact;

  const pathname = usePathname();
  const navLinks = [
    { href: '/privacy-policy/', label: privacyPolicy },
    { href: '/terms/', label: terms },
    { href: '/data-deletion/', label: dataDeletion },
  ];

  return (
    <footer className="px-6 py-12 border-t border-zinc-900 text-gray-600">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-[11px] md:text-sm">
          {copyright}
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
          <a href="mailto:andyradulescu@synapselabs.org" className="hover:text-white">
            {contact}
          </a>
        </div>
      </div>
    </footer>
  );
}
