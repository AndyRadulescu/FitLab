import React from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import styles from './phone-mockup.module.scss';

export interface PhoneMockupProps {
  imageSrc: string;
  alt: string;
  priority?: boolean;
  className?: string;
}

export default function PhoneMockup({
  imageSrc,
  alt,
  priority = false,
  className,
}: PhoneMockupProps) {
  return (
    <div className={clsx(styles.phoneWrapper, className)}>
      {/* Outer iPhone chassis */}
      <div className={styles.iphoneFrame}>
        {/* Physical side buttons */}
        <span className={styles.buttonAction} aria-hidden="true" />
        <span className={styles.buttonVolumeUp} aria-hidden="true" />
        <span className={styles.buttonVolumeDown} aria-hidden="true" />
        <span className={styles.buttonPower} aria-hidden="true" />

        {/* Screen bezel & display area */}
        <div className={styles.screenBezel}>
          {/* Top speaker slit */}
          <span className={styles.speakerSlit} aria-hidden="true" />

          {/* Cutout Notch / Dynamic Island */}
          <div className={styles.dynamicIsland} aria-hidden="true">
            <span className={styles.cameraLens} />
          </div>

          {/* Screenshot image */}
          <Image
            src={imageSrc}
            alt={alt}
            fill
            priority={priority}
            sizes="(max-width: 640px) 280px, (max-width: 768px) 320px, (max-width: 1024px) 340px, 360px"
            className="object-cover select-none pointer-events-none"
          />

          {/* Glass reflection sheen */}
          <div className={styles.glassSheen} aria-hidden="true" />

          {/* Bottom white line / menu indicator */}
          <div className={styles.homeIndicator} aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
