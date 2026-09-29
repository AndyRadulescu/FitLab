import React from 'react';
import Image from 'next/image';
import { MessageSquareQuote, User, Sparkles } from 'lucide-react';
import MobileCardsScroller from './mobile-cards-scroller';
import { Locale, defaultLocale } from '../i18n/utils';
import styles from './testimonials-section.module.scss';

export interface TestimonialItem {
  id: string;
  nameEn: string;
  nameRo: string;
  occupationEn: string;
  occupationRo: string;
  src: string;
  width: number;
  height: number;
}

export const TESTIMONIALS_DATA: TestimonialItem[] = [
  {
    id: 'testimonial-1',
    nameEn: 'Ana M.',
    nameRo: 'Ana M.',
    occupationEn: 'Product Manager',
    occupationRo: 'Manager de Produs',
    src: '/testimonials/testimonial1.JPG',
    width: 1374,
    height: 928,
  },
  {
    id: 'testimonial-2',
    nameEn: 'Ioana D.',
    nameRo: 'Ioana D.',
    occupationEn: 'Software Engineer',
    occupationRo: 'Inginer Software',
    src: '/testimonials/testimonial2.JPG',
    width: 1358,
    height: 526,
  },
  {
    id: 'testimonial-3',
    nameEn: 'Cristina S.',
    nameRo: 'Cristina S.',
    occupationEn: 'Marketing Specialist',
    occupationRo: 'Specialist Marketing',
    src: '/testimonials/testimonial3.JPG',
    width: 1328,
    height: 642,
  },
  {
    id: 'testimonial-4',
    nameEn: 'Raluca T.',
    nameRo: 'Raluca T.',
    occupationEn: 'Architect',
    occupationRo: 'Arhitect',
    src: '/testimonials/testimonial4.jpeg',
    width: 1480,
    height: 770,
  },
  {
    id: 'testimonial-5',
    nameEn: 'Maria V.',
    nameRo: 'Maria V.',
    occupationEn: 'Financial Analyst',
    occupationRo: 'Analist Financiar',
    src: '/testimonials/testimonial5.jpeg',
    width: 1376,
    height: 312,
  },
  {
    id: 'testimonial-6',
    nameEn: 'Simona B.',
    nameRo: 'Simona B.',
    occupationEn: 'Creative Director',
    occupationRo: 'Director Creativ',
    src: '/testimonials/testimonial6.jpeg',
    width: 1368,
    height: 584,
  },
  {
    id: 'testimonial-7',
    nameEn: 'Andreea N.',
    nameRo: 'Andreea N.',
    occupationEn: 'Lawyer',
    occupationRo: 'Avocat',
    src: '/testimonials/testimonial7.jpeg',
    width: 1460,
    height: 546,
  },
  {
    id: 'testimonial-8',
    nameEn: 'Alina C.',
    nameRo: 'Alina C.',
    occupationEn: 'HR Consultant',
    occupationRo: 'Consultant HR',
    src: '/testimonials/testimonial8.jpeg',
    width: 1396,
    height: 438,
  },
];

interface TestimonialsSectionProps {
  locale?: Locale;
}

export default function TestimonialsSection({
  locale = defaultLocale,
}: TestimonialsSectionProps) {
  const isRo = locale === 'ro';

  const strings = {
    eyebrow: isRo ? 'Feedback Verificat' : 'Verified Feedback',
    title: isRo ? 'Ce Spun Clienții' : 'What Clients Say',
    subtitle: isRo
      ? 'Mesaje reale și păreri nefiltrate de la persoane care au ales să lucreze cu Diana pentru putere, compoziție corporală și autonomie.'
      : 'Unfiltered messages and honest reviews from coaching clients on their journey to strength, body composition, and autonomy.',
  };

  const renderCard = (item: TestimonialItem) => {
    const name = isRo ? item.nameRo : item.nameEn;
    const occupation = isRo ? item.occupationRo : item.occupationEn;

    return (
      <div
        key={item.id}
        className={styles.testimonialCard}
        aria-label={`${name} - ${occupation}`}
      >
        {/* Card Header: Person Name (title) & Occupation */}
        <div className={styles.cardHeader}>
          <div className={styles.clientMeta}>
            <div className={styles.avatarRing} aria-hidden="true">
              <User className="w-4 h-4 text-primary" />
            </div>
            <div className={styles.clientInfo}>
              <h3 className={styles.clientName}>{name}</h3>
              <p className={styles.clientOccupation}>{occupation}</p>
            </div>
          </div>
          <div className={styles.quoteBadge} aria-hidden="true">
            <MessageSquareQuote className="w-5 h-5" />
          </div>
        </div>

        {/* Card Body: Lazy-loaded review screenshot */}
        <div className={styles.cardBody}>
          <div className={styles.imageWrapper}>
            <Image
              src={encodeURI(item.src)}
              alt={`Review message from ${name}`}
              width={item.width}
              height={item.height}
              sizes="(max-width: 640px) 85vw, (max-width: 1024px) 360px, 420px"
              className={styles.testimonialImage}
              loading="lazy"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className={styles.testimonialsSection} aria-label={strings.title}>
      {/* Ambient Glow */}
      <div className={styles.ambientGlow} aria-hidden="true" />

      <div className={styles.container}>
        {/* Section Header */}
        <header className={styles.header}>
          <span className={`${styles.eyebrow} primary-text-gradient`}>
            <Sparkles className="w-3.5 h-3.5 text-primary inline" aria-hidden="true" />
            {strings.eyebrow}
          </span>
          <h2 className={styles.title}>{strings.title}</h2>
          <p className={styles.subtitle}>{strings.subtitle}</p>
        </header>

        {/* Always a horizontal scroll across both desktop and mobile */}
        <div className={styles.scrollerWrapper}>
          <MobileCardsScroller
            speed={0.8}
            itemClassName={styles.scrollerItem}
          >
            {TESTIMONIALS_DATA.map((item) => renderCard(item))}
          </MobileCardsScroller>
        </div>
      </div>
    </section>
  );
}
