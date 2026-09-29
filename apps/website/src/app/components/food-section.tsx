import React from 'react';
import Image from 'next/image';
import { UtensilsCrossed } from 'lucide-react';
import clsx from 'clsx';
import MobileCardsScroller from './mobile-cards-scroller';
import { Locale, defaultLocale } from '../i18n/utils';
import styles from './food-section.module.scss';

export interface FoodItem {
  id: string;
  src: string;
  width: number;
  height: number;
  altEn: string;
  altRo: string;
}

export const FOOD_ITEMS: FoodItem[] = [
  {
    id: 'food-1',
    src: '/food/fcccf7c2-22cf-4c5a-988b-81274eec25b8.JPG',
    width: 1500,
    height: 2000,
    altEn: 'Sustainable nutrition made simple and enjoyable',
    altRo: 'Nutriție sustenabilă, simplă și plăcută',
  },
  {
    id: 'food-2',
    src: '/food/12c29173-4fd9-4dae-9a30-a6c3e8b34cab.JPG',
    width: 1152,
    height: 2048,
    altEn: 'Nutritious breakfast bowl with fruits and protein',
    altRo: 'Mic dejun nutritiv cu fructe și proteine',
  },
  {
    id: 'food-3',
    src: '/food/14f3fd5c-deb8-459d-96ed-6575c2f10fd4.JPG',
    width: 1500,
    height: 2000,
    altEn: 'Macro-friendly satisfying dinner',
    altRo: 'Cină sățioasă adaptată macronutrienților',
  },
  {
    id: 'food-4',
    src: '/food/1ba9af2b-f43f-43cd-a741-f60fcca37c57.JPG',
    width: 1152,
    height: 2048,
    altEn: 'Delicious healthy meal prep dish',
    altRo: 'Preparat delicios și sănătos pentru meal prep',
  },
  {
    id: 'food-5',
    src: '/food/21554fb0-4824-494f-a21f-866f715b9aff.JPG',
    width: 1152,
    height: 2048,
    altEn: 'Vibrant wholesome lunch plate',
    altRo: 'Prânz complet și plin de nutrienți',
  },
  {
    id: 'food-6',
    src: '/food/237c5451-fbea-49a9-a901-ac4cf149a32a.JPG',
    width: 1500,
    height: 2000,
    altEn: 'Lean protein meal with fresh sides',
    altRo: 'Masă cu proteine slabe și garnituri proaspete',
  },
  {
    id: 'food-7',
    src: '/food/2dec0197-9c48-4e3a-84e0-3a8a0cf5d0cd.JPG',
    width: 900,
    height: 1600,
    altEn: 'Calorie-conscious satisfying treat',
    altRo: 'Desert sănătos adaptat bugetului caloric',
  },
  {
    id: 'food-8',
    src: '/food/3a01308f-67e3-47a7-b267-26a9a30fa570.JPG',
    width: 1152,
    height: 2048,
    altEn: 'Balanced protein-packed meal option',
    altRo: 'Opțiune de masă echilibrată plină de proteine',
  },
  {
    id: 'food-9',
    src: '/food/495e6dbf-8e7e-497c-ad26-9d21d573b737.JPG',
    width: 1500,
    height: 2000,
    altEn: 'Nutrient-dense home cooked recipe',
    altRo: 'Rețetă gătită în casă densă în nutrienți',
  },
  {
    id: 'food-10',
    src: '/food/59c91341-36b3-4fa4-9b0e-f4c29180426f.JPG',
    width: 1152,
    height: 2048,
    altEn: 'Fuel for performance and recovery',
    altRo: 'Nutriție pentru performanță și refacere',
  },
  {
    id: 'food-11',
    src: '/food/6f84bcd3-15fe-4d16-9eea-a41d29e9749d.JPG',
    width: 1152,
    height: 2048,
    altEn: 'Delicious healthy high-protein bowl',
    altRo: 'Bol delicios sănătos bogat în proteine',
  },
  {
    id: 'food-12',
    src: '/food/74b975b7-7034-4365-8cbc-b18dca7e6ea8.JPG',
    width: 1152,
    height: 2048,
    altEn: 'Colorfully arranged nutritious plate',
    altRo: 'Farfurie colorată și plină de savoare',
  },
  {
    id: 'food-13',
    src: '/food/849f5352-025c-4977-b43d-c988efa71453.JPG',
    width: 1152,
    height: 2048,
    altEn: 'Wholesome balanced nutrition choice',
    altRo: 'Alegere nutrițională sănătoasă și echilibrată',
  },
  {
    id: 'food-14',
    src: '/food/IMG_0359.jpg',
    width: 1206,
    height: 2086,
    altEn: 'Simple and fast guilt-free meal',
    altRo: 'Masă simplă și rapidă fără compromisuri',
  },
  {
    id: 'food-15',
    src: '/food/IMG_8459.jpg',
    width: 1206,
    height: 2126,
    altEn: 'Creative healthy plate crafted by client',
    altRo: 'Farfurie sănătoasă pregătită de client',
  },
  {
    id: 'food-16',
    src: '/food/IMG_9130.jpg',
    width: 1196,
    height: 2075,
    altEn: 'Macro-balanced meal with quality ingredients',
    altRo: 'Masă echilibrată pe macro cu ingrediente de calitate',
  },
  {
    id: 'food-17',
    src: '/food/IMG_9131.jpg',
    width: 1206,
    height: 1941,
    altEn: 'Appetizing wholesome fitness dinner',
    altRo: 'Cină apetisantă și nutritivă pentru fitness',
  },
  {
    id: 'food-18',
    src: '/food/IMG_9133.jpg',
    width: 1206,
    height: 2106,
    altEn: 'Quick protein meal for active lifestyle',
    altRo: 'Masă proteică rapidă pentru un stil de viață activ',
  },
  {
    id: 'food-19',
    src: '/food/IMG_9985.jpg',
    width: 1206,
    height: 2081,
    altEn: 'Nutritious comforting plate without restriction',
    altRo: 'Preparat gustos și reconfortant fără restricții',
  },
  {
    id: 'food-20',
    src: '/food/a61a6437-1474-4a8c-ac70-261a09e7de13.JPG',
    width: 1152,
    height: 2048,
    altEn: 'Protein-packed savory breakfast dish',
    altRo: 'Mic dejun sărat bogat în proteine',
  },
  {
    id: 'food-21',
    src: '/food/dc094071-4ad0-4c45-b71f-030cea156aa3.JPG',
    width: 900,
    height: 1600,
    altEn: 'Satisfying lunch supporting body recomp',
    altRo: 'Prânz sățios pentru susținerea recompoziției',
  },
  {
    id: 'food-22',
    src: '/food/e9afb947-c14f-4c34-a003-dce4870a7885.JPG',
    width: 1500,
    height: 2000,
    altEn: 'Healthy delicious food enjoyed on plan',
    altRo: 'Mâncare gustoasă și sănătoasă din plan',
  },
  {
    id: 'food-23',
    src: '/food/ecbce660-b583-4992-8c15-1c48db3dbe83.JPG',
    width: 1152,
    height: 2048,
    altEn: 'Balanced fresh ingredients for optimal health',
    altRo: 'Ingrediente proaspete pentru sănătate optimă',
  },
  {
    id: 'food-24',
    src: '/food/ed86cacf-2f2b-40a7-9328-d43c5426d6ee.JPG',
    width: 1152,
    height: 2048,
    altEn: 'Convenient meal prep satisfying daily goals',
    altRo: 'Meal prep comod care atinge obiectivele zilnice',
  },
  {
    id: 'food-25',
    src: '/food/f1084ca5-39c5-4d72-ad7e-3dd4aa825ee6.JPG',
    width: 1500,
    height: 2000,
    altEn: 'Energy-rich nourishing dish',
    altRo: 'Preparat hrănitor și plin de energie',
  },
  {
    id: 'food-26',
    src: '/food/fb005663-7e23-4235-bed4-d6270c78111e.JPG',
    width: 1512,
    height: 2016,
    altEn: 'Flavorful balanced plate with high satiety',
    altRo: 'Farfurie savuroasă și sățioasă',
  },
  {
    id: 'food-1',
    src: '/food/11c052c3-8232-4f05-bec2-826a5f210760.JPG',
    width: 900,
    height: 1600,
    altEn: 'High-protein balanced meal bowl',
    altRo: 'Bol cu masă echilibrată bogată în proteine',
  },
];

interface FoodSectionProps {
  locale?: Locale;
}

export default function FoodSection({ locale = defaultLocale }: FoodSectionProps) {
  const isRo = locale === 'ro';

  const strings = {
    eyebrow: isRo ? 'Nutriție Sustenabilă' : 'Sustainable Nutrition',
    title: isRo ? 'Alimentație Fără Restricții Absurde' : 'Fueling Progress Without Restriction',
    intro: isRo
      ? 'Fiecare strategie este personalizată, fundamentată pe cele mai bune dovezi disponibile și explicată clar, astfel încât să înțelegi nu doar ce ai de făcut, ci și de ce. Pun accent pe rezultate sustenabile, educație și autonomie, pentru ca obiectivul final nu este să depinzi permanent de un coach, ci să capeți încrederea și cunoștințele necesare pentru a lua singur decizii bune pe termen lung.'
      : 'Every strategy is customized, grounded in the best available evidence, and clearly explained so that you understand not just what to do, but why. I emphasize sustainable results, education, and autonomy—because the ultimate goal is not to keep you dependent on a coach, but to empower you with the confidence and knowledge needed to make sound decisions independently over the long term.',
  };

  const renderCard = (item: FoodItem, isScroller = false) => {
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
            sizes="(max-width: 640px) 100vw, (max-width: 860px) 50vw, (max-width: 1100px) 25vw, 20vw"
            className={clsx(styles.cardImage, isScroller && styles.scrollerCardImage)}
            loading="lazy"
          />
          <div className={styles.hoverOverlay} aria-hidden="true" />
        </div>
      </div>
    );
  };

  return (
    <section className={styles.foodSection} aria-label={strings.title}>
      {/* Ambient Glow */}
      <div className={styles.ambientGlow} aria-hidden="true" />

      <div className="mx-auto px-4 max-w-450">
        {/* Section Header with Eyebrow, Title and p4 Intro */}
        <header className={styles.header}>
          <span className={`${styles.eyebrow} primary-text-gradient`}>
            <UtensilsCrossed className="w-3.5 h-3.5 text-primary inline" aria-hidden="true" />
            {strings.eyebrow}
          </span>
          <h2 className={styles.title}>{strings.title}</h2>
          <p className={styles.intro}>{strings.intro}</p>
        </header>

        {/* Desktop Dynamic Masonry Columns (>= 769px) */}
        <div className={styles.masonryGrid}>
          {FOOD_ITEMS.map((item) => renderCard(item, false))}
        </div>

        {/* Mobile Horizontal Scroller (< 769px) */}
        <div className={clsx('mobileScrollerWrapper', styles.scrollerWrapper)}>
          <MobileCardsScroller speed={0.9}>
            {FOOD_ITEMS.map((item) => renderCard(item, true))}
          </MobileCardsScroller>
        </div>
      </div>
    </section>
  );
}
