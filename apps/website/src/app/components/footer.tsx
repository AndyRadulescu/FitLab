'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { ArrowUpRight } from 'lucide-react';
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
        <div className="text-[11px] md:text-sm text-center md:text-left">
          {copyright}
        </div>
        <div className="flex flex-col items-center md:items-end gap-3.5">
          <div className="flex flex-wrap justify-center md:justify-end gap-6 md:gap-8 text-sm font-medium">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={clsx(
                  'hover:text-white transition-colors duration-200',
                  pathname === href && 'text-primary'
                )}
              >
                {label}
              </Link>
            ))}
            <a
              href="mailto:andyradulescu@synapselabs.org"
              className="hover:text-white transition-colors duration-200"
            >
              {contact}
            </a>
          </div>

          <a
            href="https://www.synapselabs.org/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Crafted by Synapse Labs @andy radulescu"
            className="group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-zinc-800/80 bg-zinc-950/60 hover:bg-zinc-900/90 hover:border-zinc-700/80 text-xs text-zinc-400 hover:text-zinc-200 transition-all duration-300 shadow-sm backdrop-blur-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500/80 group-hover:bg-orange-400 transition-colors animate-pulse" />
            <span className="font-light tracking-wide">
              crafted by{' '}
              <span className="font-semibold text-zinc-200 group-hover:text-white transition-colors underline-offset-4 group-hover:underline">
                synapse labs
              </span>
            </span>
            <span className="text-zinc-500 group-hover:text-orange-400/90 font-medium transition-colors">
              @andyRadulescu
            </span>
            <ArrowUpRight
              size={12}
              className="text-zinc-500 group-hover:text-orange-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
