import { CheckInFormDataDto } from '../../store/checkin.store';
import { Card } from '../../components/design/card';
import { CheckinItem } from '../../components/checkin-item';

export function CheckinList({ checkins }: { checkins: CheckInFormDataDto[] }) {
  return (
    <div>
      <h1 className="text-2xl mb-4 dark:text-gray-300">Check-ins</h1>
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
