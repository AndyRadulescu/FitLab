import { checkinStore } from '../../store/checkin.store';
import { CheckinList } from './checkin-list';
import { WeightInput } from '../../components/weight-input';

export function Dashboard() {
  const checkins = checkinStore((state) => state.checkins);

  return (
    <div>
      <div className="mb-4">
        <WeightInput />
      </div>
      <CheckinList checkins={checkins} />
    </div>
  );

}
