import { checkinStore } from '../../store/checkin.store';
import { CheckinList } from './checkin-list';
import { WeightInput } from '../../components/weight-input/weight-input';
import { WeightChart } from './components/weight-chart';
import { SectionHeader } from '../../components/section-header';
import { Trans } from 'react-i18next';

export function Dashboard() {
  const checkins = checkinStore((state) => state.checkins);

  return (
    <div>
      <SectionHeader><Trans i18nKey="dashboard.weight.title"/></SectionHeader>
      <div className="mb-2">
        <WeightInput />
      </div>
      <WeightChart />
      <CheckinList checkins={checkins} />
    </div>
  );
}
