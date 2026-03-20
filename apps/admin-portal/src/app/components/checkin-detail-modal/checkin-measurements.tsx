import { Ruler } from 'lucide-react';
import { DataItem } from './data-item';
import './checkin-detail-modal.scss';

interface CheckinMeasurementsProps {
  checkin: any;
}

export const CheckinMeasurements = ({ checkin }: CheckinMeasurementsProps) => {
  return (
    <section>
      <h3 className="checkin-modal__section-title">
        <Ruler className="checkin-modal__section-icon" />
        Body Measurements
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-3">
        <DataItem label="Weight" value={checkin.kg} unit="kg" />
        <DataItem label="Bust" value={checkin.breastSize} unit="cm" />
        <DataItem label="Waist" value={checkin.waistSize} unit="cm" />
        <DataItem label="Hips" value={checkin.hipSize} unit="cm" />
        <DataItem label="Glutes" value={checkin.buttSize} unit="cm" />
        <DataItem label="Left Thigh" value={checkin.leftThigh} unit="cm" />
        <DataItem label="Right Thigh" value={checkin.rightThigh} unit="cm" />
        <DataItem label="Left Arm" value={checkin.leftArm} unit="cm" />
        <DataItem label="Right Arm" value={checkin.rightArm} unit="cm" />
      </div>
    </section>
  );
};
