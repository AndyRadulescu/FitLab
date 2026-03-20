import { Zap } from 'lucide-react';
import { StatBadge } from './stat-badge';
import { DataItem } from './data-item';
import './checkin-detail-modal.scss';

interface CheckinLifestyleProps {
  checkin: any;
}

export const CheckinLifestyle = ({ checkin }: CheckinLifestyleProps) => {
  return (
    <section>
      <h3 className="checkin-modal__section-title">
        <Zap className="checkin-modal__section-icon" />
        Lifestyle Stats
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatBadge label="Plan Accuracy" value={checkin.planAccuracy} />
        <StatBadge label="Energy Level" value={checkin.energyLevel} />
        <StatBadge label="Mood Check" value={checkin.moodCheck} />
        <DataItem label="Sleep" value={checkin.hoursSlept} unit="hrs" />
      </div>
      <div className="mt-4">
        <DataItem label="Daily Steps" value={checkin.dailySteps?.toLocaleString()} unit="steps" />
      </div>
    </section>
  );
};
