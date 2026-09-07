'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import clsx from 'clsx';
import { GlassyReflection } from './glassy-reflection';
import { LanguageToggler } from './language-toggler';
import { getClientTranslations } from '../i18n/client';
import { defaultLocale } from '../i18n/utils';

export interface NavbarTranslations {
  home?: string;
  terms?: string;
  privacyPolicy?: string;
  dataDeletion?: string;
}

interface NavbarProps {
  locale?: string;
  translations?: NavbarTranslations;
}

export function Navbar({
  locale = defaultLocale,
  translations,
}: NavbarProps) {
  const t = getClientTranslations(locale);
  const home = translations?.home || t.nav.home;
  const terms = translations?.terms || t.nav.terms;
  const privacyPolicy = translations?.privacyPolicy || t.nav.privacyPolicy;
  const dataDeletion = translations?.dataDeletion || t.nav.dataDeletion;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on pathname change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Close mobile menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const homeHref = locale === 'en' ? '/en/' : '/';

  const navLinks = [
    { href: homeHref, label: home },
    { href: '/terms/', label: terms },
    { href: '/privacy-policy/', label: privacyPolicy },
    { href: '/data-deletion/', label: dataDeletion },
  ];

  const isLinkActive = (href: string) => {
    const normalizedPath = pathname?.endsWith('/') ? pathname : `${pathname}/`;
    const normalizedHref = href.endsWith('/') ? href : `${href}/`;
    if (normalizedHref === '/' && (normalizedPath === '/' || normalizedPath === '/ro/')) {
      return true;
    }
    return normalizedPath === normalizedHref;
  };

  return (
    <header
      className={clsx(
        'fixed top-0 md:top-5 left-0 right-0 z-40 transition-colors duration-300',
        // Mobile: Transparent background with backdrop blur only (no border, no reflection)
        'bg-black/40 backdrop-blur-md',
        // Desktop: Glassy design with border line, transparent background, backdrop blur, and specular reflection
        'md:bg-black/30 md:backdrop-blur-xl md:border-b md:border-white/10 md:rounded-full md:mx-32'
      )}
    >
      <GlassyReflection showGlowOnMobile={false} />

      <nav className="max-w-7xl mx-auto px-6 md:rounded-full h-20 flex items-center justify-between relative">
        {/* Brand / Logo */}
        <Link
          href={homeHref}
          className="flex items-center gap-2 group transition-opacity hover:opacity-90"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <span className="text-xl font-black tracking-tighter uppercase italic">
            Amazonia <span className="primary-text-gradient">FitLab</span>
          </span>
        </Link>

        {/* Desktop Nav Links & Language Toggler */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navLinks.map(({ href, label }) => {
            const active = isLinkActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={clsx(
                  'relative py-1 transition-colors duration-200',
                  active
                    ? 'text-white font-semibold'
                    : 'text-zinc-400 hover:text-white'
                )}
              >
                {label}
                {active && (
                  <span className="absolute -bottom-1 left-0 right-0 h-[2px] primary-gradient rounded-full" />
                )}
              </Link>
            );
          })}
          <LanguageToggler locale={locale} />
        </div>

        {/* Mobile Actions: Language Toggler + Hamburger Button */}
        <div className="md:hidden flex items-center gap-3">
          <LanguageToggler locale={locale} />
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="flex items-center justify-center w-10 h-10 rounded-lg text-zinc-300 hover:text-white hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 transition-transform duration-200" />
            ) : (
              <Menu className="w-6 h-6 transition-transform duration-200" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Drawer / Dropdown */}
      <div
        className={clsx(
          'md:hidden transition-all duration-300 ease-in-out overflow-hidden',
          isMobileMenuOpen
            ? 'max-h-96 opacity-100'
            : 'max-h-0 opacity-0 pointer-events-none'
        )}
      >
        <div className="px-6 pt-2 pb-6 space-y-2 bg-black/40 backdrop-blur-md">
          {navLinks.map(({ href, label }) => {
            const active = isLinkActive(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={clsx(
                  'flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  active
                    ? 'bg-white/10 text-white font-semibold'
                    : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                )}
              >
                <span>{label}</span>
                {active && (
                  <span className="w-2 h-2 rounded-full bg-secondary" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
