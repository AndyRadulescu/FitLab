import { CheckInFormDataDto } from '../../store/checkin.store';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { calculateCm } from './calculate-cm';
import { Bed, Footprints, Ruler, Trash, Weight, Zap } from 'lucide-react';
import { CheckInStrategyFactory } from '../../core/checkin-strategy/checkin-strategy';
import { ImagesDisplay } from '../image/images-display';

export function CheckinItem({ checkin }: { checkin: CheckInFormDataDto }) {
  const { i18n, t } = useTranslation();
  if (!checkin.userId) return null;

  const deleteItem = () => {
    // eslint-disable-next-line no-restricted-globals
    const isDelete = confirm(t('checkin.delete'));
    if (!isDelete) return;
    void CheckInStrategyFactory.getStrategy('delete').checkIn({ data: checkin, userId: checkin.userId! });
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
      <div className="w-1/3">
        <ImagesDisplay checkinId={checkin.id} userId={checkin.userId}/>
      </div>

      <div className="absolute p-2 right-[-25px] top-[-25px] rounded-full bg-gray-200 dark:bg-gray-700 text-red-700" onClick={deleteItem}>
        <Trash size="14" />
      </div>
    </div>
  );
}
