import { Trans } from 'react-i18next';
import { checkinStore } from '../../store/checkin.store';
import { CheckinList } from './checkin-list';

export function Dashboard() {
  const checkins = checkinStore((state) => state.checkins);

  console.log(checkins.length);

  return (
    <div>
      <h1 className="text-2xl text-center mb-4">Your journey</h1>
      {checkins.length === 0 ? <div className="h-svh flex justify-center items-center">
        <p><Trans i18nKey="dashboard.nothingYet">Noting to show yet</Trans></p>
      </div> : <CheckinList checkins={checkins}/>}
    </div>
  );

}
