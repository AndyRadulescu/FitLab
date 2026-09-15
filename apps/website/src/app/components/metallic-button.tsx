import React from 'react';
import clsx from 'clsx';
import styles from './metallic-button.module.scss';

export interface MetallicButtonProps {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  'aria-label'?: string;
}

export default function MetallicButton({
  href,
  onClick,
  children,
  className,
  target,
  rel,
  size = 'md',
  icon,
  type = 'button',
  'aria-label': ariaLabel,
}: MetallicButtonProps) {
  const content = (
    <>
      <span className={styles.label}>{children}</span>
      {icon && <span className={styles.icon}>{icon}</span>}
    </>
  );

  const combinedClasses = clsx(styles.metallicBtn, styles[size], className);

  if (href) {
    return (
      <a
        href={href}
        className={combinedClasses}
        target={target}
        rel={rel}
        aria-label={ariaLabel}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={combinedClasses}
      aria-label={ariaLabel}
    >
      {content}
    </button>
  );
}

export { MetallicButton };
