import { CheckInFormDataDto } from '../store/checkin.store';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { calculateCm } from '../routes/checkIn/calculate-cm';
import { Bed, Footprints, Ruler, Trash, Weight, Zap } from 'lucide-react';
import { CheckInStrategyFactory } from '../routes/checkIn/checkin-strategy';
import { MouseEventHandler } from 'react';

export function CheckinItem({ checkin }: { checkin: CheckInFormDataDto }) {
  const { i18n } = useTranslation();

  const deleteItem = (e: MouseEventHandler<HTMLDivElement>) => {
    console.log('entered');
    CheckInStrategyFactory.getStrategy('delete');
    e.stopPropagation();
  };

  return (

    <div className="flex relative">
      <div className="w-2/3">
        <Link to={`/check-in?checkinId=${checkin.id}`}>
          <h1 className="font-bold">{checkin.createdAt.toLocaleDateString(i18n.language, {
            month: 'short',
            day: 'numeric'
          })}</h1>
          <p
            className="text-gray-500 dark:text-gray-300 flex">
            <span className="mr-1 text-xs"><Weight className="inline" strokeWidth="1" size="14" /> {checkin.kg}</span>
            <span className="mr-1 text-xs"><Ruler className="inline" strokeWidth="1" size="14" /> {calculateCm(checkin)}</span>
            <span className="mr-1 text-xs"><Bed className="inline" strokeWidth="1"
                                                size="14" /> {checkin.hoursSlept}</span>
            <span className="mr-1 text-xs"><Footprints className="inline" strokeWidth="1"
                                                       size="14" /> {checkin.dailySteps}</span>
            <span className="mr-1 text-xs"><Zap className="inline" strokeWidth="1"
                                                size="14" /> {checkin.energyLevel}</span>
          </p>
        </Link>
      </div>
      <div className="w-1/3"></div>

      <div className="absolute right-[-10px] top-[-10px]" onClick={deleteItem}>
        <Trash size="14" />
      </div>
    </div>
  );
}
