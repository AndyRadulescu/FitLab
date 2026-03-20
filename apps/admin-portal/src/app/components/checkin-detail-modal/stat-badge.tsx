import './checkin-detail-modal.scss';

interface StatBadgeProps {
  label: string;
  value: number;
  max?: number;
}

export const StatBadge = ({ label, value, max = 10 }: StatBadgeProps) => (
  <div className="stat-badge">
    <span className="stat-badge__label">{label}</span>
    <div className="stat-badge__content">
      <span className="stat-badge__value">{value}</span>
      <span className="stat-badge__max">/ {max}</span>
    </div>
    <div className="stat-badge__progress-bg">
      <div 
        className="stat-badge__progress-bar" 
        style={{ width: `${(value / max) * 100}%` }}
      ></div>
    </div>
  </div>
);
