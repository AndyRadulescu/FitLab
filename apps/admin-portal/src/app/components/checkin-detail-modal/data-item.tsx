import './checkin-detail-modal.scss';

interface DataItemProps {
  label: string;
  value: any;
  unit?: string;
}

export const DataItem = ({ label, value, unit = '' }: DataItemProps) => (
  <div className="data-item">
    <span className="data-item__label">{label}</span>
    <span className="data-item__value">
      {value !== undefined && value !== null ? `${value} ${unit}` : 'N/A'}
    </span>
  </div>
);
