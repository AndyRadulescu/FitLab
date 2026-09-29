import React from 'react';
import Image from 'next/image';
import { TrendingUp } from 'lucide-react';
import clsx from 'clsx';
import MobileCardsScroller from './mobile-cards-scroller';
import { Locale, defaultLocale } from '../i18n/utils';
import styles from './results-section.module.scss';

export interface ResultItem {
  id: string;
  src: string;
  width: number;
  height: number;
  altEn: string;
  altRo: string;
}

export const RESULTS_ITEMS: ResultItem[] = [
  {
    id: 'result-1',
    src: '/results/91c9725b-a85e-4d45-9073-635d55dabd50.JPG',
    width: 945,
    height: 2048,
    altEn: 'Client physique transformation progress',
    altRo: 'Progres transformare fizică client',
  },
  {
    id: 'result-2',
    src: '/results/99a7a4c7-1440-4f36-bde2-8fe63fe33635.JPG',
    width: 2048,
    height: 1928,
    altEn: 'Client body recomposition progress',
    altRo: 'Progres recompoziție corporală client',
  },
  {
    id: 'result-3',
    src: '/results/IMG_0366.jpg',
    width: 1206,
    height: 1416,
    altEn: 'Client fitness progress check-in',
    altRo: 'Check-in progres fitness client',
  },
  {
    id: 'result-4',
    src: '/results/IMG_0367.jpg',
    width: 1206,
    height: 1555,
    altEn: 'Client body transformation progress',
    altRo: 'Progres transformare corporală client',
  },
  {
    id: 'result-5',
    src: '/results/IMG_0370.jpg',
    width: 1206,
    height: 1506,
    altEn: 'Client posture and muscle definition progress',
    altRo: 'Progres postură și definire musculară client',
  },
  {
    id: 'result-6',
    src: '/results/IMG_8708.JPG',
    width: 3024,
    height: 4032,
    altEn: 'Client muscle tone and fat loss progress',
    altRo: 'Tonifiere musculară și scădere în grăsime client',
  },
  {
    id: 'result-7',
    src: '/results/b8dc37d2-f7ae-4938-9fd3-0c1557155e6a.JPG',
    width: 1158,
    height: 2048,
    altEn: 'Client strength and physique milestones',
    altRo: 'Etape transformare fizică și forță client',
  },
];

interface ResultsSectionProps {
  locale?: Locale;
}

export default function ResultsSection({ locale = defaultLocale }: ResultsSectionProps) {
  const isRo = locale === 'ro';

  const strings = {
    eyebrow: isRo ? 'Transformări' : 'Transformations',
    title: isRo ? 'Rezultate Reale & Măsurabile' : 'Real, Measurable Results',
    intro: isRo
      ? 'Educația mea continuă îmi permite să disting recomandările susținute de dovezi științifice de informațiile promovate doar pentru că sunt populare. De aceea, procesul meu de coaching începe cu o analiză completă a nevoilor, obiectivelor și stilului tău de viață, nu cu un plan standard.'
      : 'My ongoing education enables me to distinguish evidence-backed recommendations from information popularized purely because it is trending. That is why my coaching process starts with a comprehensive analysis of your needs, goals, and lifestyle, rather than a one-size-fits-all plan.',
  };

  const renderCard = (item: ResultItem, isScroller = false) => {
    const alt = isRo ? item.altRo : item.altEn;

    return (
      <div
        key={`${isScroller ? 'scroll-' : 'grid-'}${item.id}`}
        className={clsx(styles.mediaCard, isScroller && styles.scrollerCard)}
        aria-label={alt}
      >
        <div className={clsx(styles.imageWrapper, isScroller && styles.scrollerImageWrapper)}>
          <Image
            src={encodeURI(item.src)}
            alt={alt}
            width={item.width}
            height={item.height}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={clsx(styles.cardImage, isScroller && styles.scrollerCardImage)}
            loading="lazy"
          />
          <div className={styles.hoverOverlay} aria-hidden="true" />
        </div>
      </div>
    );
  };

  return (
    <section className={styles.resultsSection} aria-label={strings.title}>
      {/* Ambient Glow */}
      <div className={styles.ambientGlow} aria-hidden="true" />

      <div className={styles.container}>
        {/* Section Header with Eyebrow, Title and p3 Intro */}
        <header className={styles.header}>
          <span className={`${styles.eyebrow} primary-text-gradient`}>
            <TrendingUp className="w-3.5 h-3.5 text-primary inline" aria-hidden="true" />
            {strings.eyebrow}
          </span>
          <h2 className={styles.title}>{strings.title}</h2>
          <p className={styles.intro}>{strings.intro}</p>
        </header>

        {/* Desktop Dynamic Masonry Columns (>= 769px) */}
        <div className={styles.masonryGrid}>
          {RESULTS_ITEMS.map((item) => renderCard(item, false))}
        </div>

        {/* Mobile Horizontal Scroller (< 769px) */}
        <div className={clsx('mobileScrollerWrapper', styles.scrollerWrapper)}>
          <MobileCardsScroller speed={0.9}>
            {RESULTS_ITEMS.map((item) => renderCard(item, true))}
          </MobileCardsScroller>
        </div>
      </div>
    </section>
  );
}
