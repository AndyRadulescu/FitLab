import { Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './last-used-badge.scss';

export interface LastUsedBadgeProps {
  label?: string;
  className?: string;
  variant?: 'floating' | 'inline';
}

export function LastUsedBadge({ label, className = '', variant = 'floating' }: LastUsedBadgeProps) {
  const { t } = useTranslation();
  const displayLabel = label || t('auth.last_used', 'Last used');

  return (
    <div
      className={`last-used-badge last-used-badge--${variant} ${className}`}
      data-testid="last-used-badge"
    >
      <span className="last-used-badge__icon">
        <Clock size={11} />
      </span>
      <span className="last-used-badge__text">{displayLabel}</span>
    </div>
  );
}
