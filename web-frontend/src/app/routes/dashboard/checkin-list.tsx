import { CheckInFormDataDto } from '../../store/checkin.store';
import { Card } from '../../design/Card';
import { Trans, useTranslation } from 'react-i18next';

export function CheckinList({ checkins }: { checkins: CheckInFormDataDto[] }) {
  const { i18n } = useTranslation();
  return (
    <div>
      {checkins.map(checkin => (
        <Card className="mb-2" key={checkin.id}>
          <h1 className="text-lg font-bold text-center mb-2">Checkin
            date: {checkin.createdAt.toLocaleDateString(i18n.language, {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</h1>
          <div className="flex flex-wrap gap-2 justify-evenly">
            <span><Trans i18nKey="checkin.measures.kg" /> {checkin.kg}</span>
            <span><Trans i18nKey="checkin.measures.breast" /> {checkin.breastSize}</span>
            <span><Trans i18nKey="checkin.measures.waist" /> {checkin.waistSize}</span>
            <span><Trans i18nKey="checkin.measures.hips" /> {checkin.hipSize}</span>
            <span><Trans i18nKey="checkin.measures.butt" /> {checkin.buttSize}</span>
            <span><Trans i18nKey="checkin.measures.leftThigh" /> {checkin.leftThigh}</span>
            <span><Trans i18nKey="checkin.measures.rightThigh" /> {checkin.rightThigh}</span>
            <span><Trans i18nKey="checkin.measures.leftArm" /> {checkin.leftArm}</span>
            <span><Trans i18nKey="checkin.measures.rightArm" /> {checkin.rightArm}</span>
          </div>
        </Card>
      ))}
    </div>
  );
}
