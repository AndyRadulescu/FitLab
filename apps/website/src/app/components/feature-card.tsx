import React from 'react';
import clsx from 'clsx';
import styles from './feature-card.module.scss';

export interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  tags?: string[];
  className?: string;
  children?: React.ReactNode;
}

export default function FeatureCard({
  icon,
  title,
  description,
  tags,
  className,
  children,
}: FeatureCardProps) {
  return (
    <div className={clsx(styles.card, className)}>
      <div className={styles.iconWrapper} aria-hidden="true">
        {icon}
      </div>
      <h4 className={styles.title}>{title}</h4>
      {description && <p className={styles.description}>{description}</p>}
      {children}
      {tags && tags.length > 0 && (
        <div className={styles.tagList}>
          {tags.map((tag, idx) => (
            <span key={idx} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
