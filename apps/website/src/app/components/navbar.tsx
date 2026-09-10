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
}

interface NavbarProps {
  locale?: string;
  translations?: NavbarTranslations;
}

export function Navbar({ locale = defaultLocale, translations }: NavbarProps) {
  const t = getClientTranslations(locale);
  const home = translations?.home || t.nav.home;
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

  // Prevent background scrolling while mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const homeHref = locale === 'en' ? '/en/' : '/ro/';
  const aboutHref = locale === 'en' ? '/en/about-me/' : '/ro/about-me/';
  const aboutLabel = t.nav.aboutMe || (locale === 'en' ? 'About Me' : 'Despre mine');

  const navLinks = [
    { href: homeHref, label: home },
    { href: aboutHref, label: aboutLabel },
  ];

  const isLinkActive = (href: string) => {
    const normalizedPath = pathname?.endsWith('/') ? pathname : `${pathname}/`;
    const normalizedHref = href.endsWith('/') ? href : `${href}/`;
    if (
      normalizedHref === '/' &&
      (normalizedPath === '/' || normalizedPath === '/ro/')
    ) {
      return true;
    }
    return normalizedPath === normalizedHref;
  };

  return (
    <header
      className={clsx(
        'fixed top-0 md:top-5 left-0 right-0 z-40 flex justify-center transition-colors duration-300',
      )}
    >
      <nav
        className="max-w-7xl px-6 md:rounded-full h-20 flex items-center justify-between relative
        bg-black/40 backdrop-blur-md
        md:bg-black/30 md:backdrop-blur-xl md:border-b md:border-white/10 md:rounded-full w-full
        "
      >
        <GlassyReflection showGlowOnMobile={false} />
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
                    : 'text-zinc-400 hover:text-white',
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

      {/* Mobile Navigation Full-Screen Overlay */}
      <div
        className={clsx(
          'md:hidden fixed inset-x-0 top-20 bottom-0 h-[calc(100svh-5rem)] w-full bg-black/95 backdrop-blur-2xl border-t border-white/10 transition-all duration-300 ease-in-out overflow-y-auto z-40',
          isMobileMenuOpen
            ? 'opacity-100 visible pointer-events-auto'
            : 'opacity-0 invisible pointer-events-none'
        )}
      >
        <div className="px-6 py-8 flex flex-col justify-between min-h-full">
          <div className="space-y-3">
            {navLinks.map(({ href, label }, idx) => {
              const active = isLinkActive(href);
              return (
                <Link
                  key={`${href}-${idx}`}
                  href={href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={clsx(
                    'flex items-center justify-between px-4 py-3.5 rounded-xl text-lg font-semibold transition-colors',
                    active
                      ? 'bg-white/10 text-white'
                      : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                  )}
                >
                  <span>{label}</span>
                  {active && (
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="pt-8 border-t border-zinc-900 text-center">
            <p className="text-xs text-zinc-500 uppercase tracking-widest">
              Amazonia FitLab
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
