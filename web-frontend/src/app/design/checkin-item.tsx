import { CheckInFormDataDto } from '../store/checkin.store';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { calculateCm } from '../routes/checkIn/calculate-cm';
import { Footprints, Weight, Bed, Zap, Ruler } from 'lucide-react';

export function CheckinItem({ checkin }: { checkin: CheckInFormDataDto }) {
  const { i18n } = useTranslation();
  return (
    <Link to={`/check-in?checkinId=${checkin.id}`}>
      <div className="flex">
        <div className="w-2/3">
          <h1 className="font-bold">{checkin.createdAt.toLocaleDateString(i18n.language, {
            month: 'short',
            day: 'numeric'
          })}</h1>
          <p
            className="text-gray-500 dark:text-gray-300 flex">
            <span className="mr-1 text-xs"><Weight className="inline" strokeWidth="1" size="14"/> {checkin.kg}</span>
            <span className="mr-1 text-xs"><Ruler className="inline" strokeWidth="1" size="14"/> {calculateCm(checkin)}</span>
            <span className="mr-1 text-xs"><Bed className="inline" strokeWidth="1" size="14" /> {checkin.hoursSlept}</span>
            <span className="mr-1 text-xs"><Footprints className="inline" strokeWidth="1" size="14" /> {checkin.dailySteps}</span>
            <span className="mr-1 text-xs"><Zap className="inline" strokeWidth="1" size="14"/> {checkin.energyLevel}</span>
          </p>
        </div>

        <div className="w-1/3"></div>
      </div>
    </Link>
  );
}
