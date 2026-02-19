import { CheckInFormDataDto } from '../../store/checkin.store';
import { Card } from '../../components/design/card';
import { CheckinItem } from '../../components/checkin-item';
import { SectionHeader } from '../../components/section-header';
import { Trans } from 'react-i18next';

export function CheckinList({ checkins }: { checkins: CheckInFormDataDto[] }) {
  if (checkins.length === 0) {
    return (
      <div className="flex justify-center items-center">
        <p><Trans i18nKey="dashboard.nothingYet">Noting to show yet</Trans></p>
      </div>
    );
  }

  return (
    <div>
      <SectionHeader><Trans i18nKey="dashboard.journey">My journey</Trans></SectionHeader>
      <Card className="mb-2">
        {checkins.map((checkin, index) => (
          <div key={checkin.id}>
            <CheckinItem checkin={checkin} key={checkin.id}></CheckinItem>
            {index < checkins.length - 1 && (
              <hr className="border-t my-4 mx-[-16px] border-gray-300 dark:border-gray-600" />
            )}
          </div>
        ))}
      </Card>
    </div>
  );
}
