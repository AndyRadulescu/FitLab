import { Trans } from 'react-i18next';
import { checkinStore } from '../../store/checkin.store';
import { CheckinList } from './checkin-list';

export function Dashboard() {
  const checkins = checkinStore((state) => state.checkins);

  return (
    <div>
      {checkins.length === 0 ? <div className="h-svh flex justify-center items-center">
        <p><Trans i18nKey="dashboard.nothingYet">Noting to show yet</Trans></p>
      </div> : <CheckinList checkins={checkins}/>}
    </div>
  );

}
