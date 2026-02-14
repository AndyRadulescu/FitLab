import { CheckInFormDataDto } from '../../store/checkin.store';
import { Card } from '../../components/design/card';
import { CheckinItem } from '../../components/checkin-item';
import { SectionHeader } from '../../components/section-header';
import { Trans } from 'react-i18next';

export function CheckinList({ checkins }: { checkins: CheckInFormDataDto[] }) {
  return (
    <div>
      <SectionHeader><Trans i18nKey="dashboard.journey">My journey</Trans></SectionHeader>
      <Card className="mb-2">
        {checkins.map((checkin, index) => (
          <div key={checkin.id}>
            <CheckinItem checkin={checkin} key={checkin.id}></CheckinItem>
            {index < checkins.length - 1 && (
              <hr className="border-t my-4 border-gray-300 dark:border-gray-600" />
            )}
          </div>
        ))}
      </Card>
    </div>
  );
}
