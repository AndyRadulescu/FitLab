import React from 'react';
import Image from 'next/image';
import { Award } from 'lucide-react';
import { Locale, defaultLocale } from '../i18n/utils';
import styles from './diplomas-grid.module.scss';

interface DiplomaItem {
  id: string;
  src: string;
  width: number;
  height: number;
  titleEn: string;
  titleRo: string;
  issuerEn: string;
  issuerRo: string;
}

const DIPLOMAS: DiplomaItem[] = [
  {
    id: 'henselmans-pt',
    src: '/diplomas/henselmans.jpg',
    width: 883,
    height: 637,
    titleEn: 'Henselmans PT Course Certification',
    titleRo: 'Certificare Henselmans PT Course',
    issuerEn: 'Henselmans Evidence-Based Fitness',
    issuerRo: 'Henselmans Evidence-Based Fitness',
  },
  {
    id: 'absolvire',
    src: '/diplomas/absolvire.jpg',
    width: 2268,
    height: 3166,
    titleEn: 'Certificate of Graduation - Fitness Instructor',
    titleRo: 'Certificat de Absolvire - Instructor Fitness',
    issuerEn: 'Ministry of Labour & Ministry of Education',
    issuerRo: 'Ministerul Muncii & Ministerul Educației',
  },
  {
    id: 'issa-cpt',
    src: '/diplomas/ISSA-Certified.jpg',
    width: 792,
    height: 612,
    titleEn: 'Certified Personal Trainer (CPT)',
    titleRo: 'Antrenor Personal Certificat (CPT)',
    issuerEn: 'ISSA - International Sports Sciences Association',
    issuerRo: 'ISSA - International Sports Sciences Association',
  },
  {
    id: 'pn-level-1',
    src: '/diplomas/precision-nutrition.jpg',
    width: 792,
    height: 612,
    titleEn: 'Level 1 Nutrition Coaching Certification',
    titleRo: 'Certificare Nutriție Nivelul 1',
    issuerEn: 'Precision Nutrition (Pn1)',
    issuerRo: 'Precision Nutrition (Pn1)',
  },
  {
    id: 'certificate',
    src: '/diplomas/certificate.jpg',
    width: 2268,
    height: 2319,
    titleEn: 'Fitness & Nutrition Specialist Certificate',
    titleRo: 'Certificat Specialist Fitness & Nutriție',
    issuerEn: 'Fitness Education Academy',
    issuerRo: 'Fitness Education Academy',
  },
  {
    id: 'issa-bodybuilding',
    src: '/diplomas/ISSA-Bodybuilding.jpg',
    width: 792,
    height: 612,
    titleEn: 'Bodybuilding Specialist Certification',
    titleRo: 'Specialist Culturism & Hipertrofie',
    issuerEn: 'ISSA - International Sports Sciences Association',
    issuerRo: 'ISSA - International Sports Sciences Association',
  },
  {
    id: 'finishing-diploma',
    src: '/diplomas/finishing-diploma.jpg',
    width: 2268,
    height: 3184,
    titleEn: 'Professional Qualification Diploma',
    titleRo: 'Diplomă de Calificare Profesională',
    issuerEn: 'National & International Certification',
    issuerRo: 'Certificare Națională & Internațională',
  },
  {
    id: 'issa-strength',
    src: '/diplomas/ISSA-Strength.jpg',
    width: 792,
    height: 612,
    titleEn: 'Strength & Conditioning Specialist',
    titleRo: 'Specialist Forță & Condiționare',
    issuerEn: 'ISSA - International Sports Sciences Association',
    issuerRo: 'ISSA - International Sports Sciences Association',
  },
  {
    id: 'pn-cec',
    src: '/diplomas/precision-nutrition-coach.jpg',
    width: 792,
    height: 612,
    titleEn: 'Continuing Education (CEC) Certification',
    titleRo: 'Educație Continuă în Nutriție (CEC)',
    issuerEn: 'Precision Nutrition (Pn1)',
    issuerRo: 'Precision Nutrition (Pn1)',
  },
];

interface DiplomasGridProps {
  locale?: Locale;
}

export default function DiplomasGrid({ locale = defaultLocale }: DiplomasGridProps) {
  const isRo = locale === 'ro';

  const strings = {
    eyebrow: isRo ? 'Calificări & Acreditări' : 'Credentials & Accreditations',
    title: isRo ? 'Diplome & Certificări' : 'Diplomas & Certifications',
    subtitle: isRo
      ? 'Ani de studiu continuu în nutriție, fiziologia efortului și interpretarea cercetărilor științifice.'
      : 'Years of continuous study in nutrition, exercise physiology, and clinical research interpretation.',
  };

  return (
    <section className={styles.diplomasSection} aria-label={strings.title}>
      {/* Subtle top ambient glow */}
      <div className={styles.ambientGlow} aria-hidden="true" />

      <div className={styles.container}>
        {/* Section Header */}
        <header className={styles.header}>
          <span className={`${styles.eyebrow} primary-text-gradient flex items-center justify-center gap-1.5 inline`}>
            <Award className="w-3.5 h-3.5 text-primary inline" aria-hidden="true" />
            {strings.eyebrow}
          </span>
          <h2 className={styles.title}>{strings.title}</h2>
          <p className={styles.subtitle}>{strings.subtitle}</p>
        </header>

        {/* Dynamic Masonry Columns */}
        <div className={styles.masonryGrid}>
          {DIPLOMAS.map((item) => {
            const title = isRo ? item.titleRo : item.titleEn;
            const issuer = isRo ? item.issuerRo : item.issuerEn;

            return (
              <div
                key={item.id}
                className={styles.diplomaCard}
                aria-label={`${title} - ${issuer}`}
              >
                {/* Image preserving natural aspect ratio */}
                <div className={styles.imageWrapper}>
                  <Image
                    src={encodeURI(item.src)}
                    alt={title}
                    width={item.width}
                    height={item.height}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className={styles.cardImage}
                    loading="lazy"
                  />

                  {/* Hover Sheen */}
                  <div className={styles.hoverOverlay} aria-hidden="true" />
                </div>

                {/* Footer Info */}
                <div className={styles.cardFooter}>
                  <h3 className={styles.cardTitle}>{title}</h3>
                  <p className={styles.cardIssuer}>
                    <span className={styles.issuerDot} aria-hidden="true" />
                    {issuer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
