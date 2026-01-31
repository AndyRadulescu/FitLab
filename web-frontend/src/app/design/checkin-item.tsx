import { CheckInFormDataDto } from '../store/checkin.store';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export function CheckinItem({ checkin }: { checkin: CheckInFormDataDto }) {
  const { i18n } = useTranslation();
  return (
    <Link to={`/check-in?checkinId=${checkin.id}`}>
      <div className="flex">
        <div className="w-1/2">
          <h1 className="font-bold">{checkin.createdAt.toLocaleDateString(i18n.language, {
            month: 'short',
            day: 'numeric'
          })}</h1>
          <p className="text-gray-500 dark:text-gray-300">{checkin.kg} kg 200 cm</p>
        </div>

        <div className="w-1/2"></div>
      </div>
    </Link>
  );
}
