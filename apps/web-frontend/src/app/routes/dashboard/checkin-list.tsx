import { Card, TimeToCheckin } from '@my-org/shared-ui';
import { CheckinItem } from '../../components/checkin-item/checkin-item';
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
      <h2 className="flex justify-between text-xl font-bold mb-4 text-gray-700 dark:text-white">
        <Trans i18nKey="checkin.checkins">Check-ins</Trans>
        <p className="flex justify-center items-center ml-2"><TimeToCheckin checkins={checkins} /> <span
          className="ml-2 font-light text-sm"> - <Trans i18nKey="checkin.nextCheckin">next checkin</Trans></span></p>
      </h2>
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
