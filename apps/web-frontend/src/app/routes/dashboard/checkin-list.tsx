import { Card } from '@my-org/shared-ui';
import { CheckinItem } from '../../components/checkin-item/checkin-item';
import { SectionHeader } from '../../components/section-header';
import { Trans } from 'react-i18next';
import { CheckInFormDataDto } from '@my-org/core';

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
      <SectionHeader><Trans i18nKey="checkin.checkins">Check-ins</Trans></SectionHeader>
      <Card className="mb-2">
        {checkins.map((checkin, index) => (
          <div key={checkin.id}>
            <CheckinItem checkin={checkin} key={checkin.id}></CheckinItem>
            {index < checkins.length - 1 && (
              <hr className="border-t my-4 mx-[-16px] border-gray-300 dark:border-amber-300/15" />
            )}
          </div>
        ))}
      </Card>
    </div>
  );
}
