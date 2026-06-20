import { MenstrualCycle } from '@my-org/core';
import { DataItem } from './data-item';

interface MenstrualCycleItemProps {
  value?: string | null;
  gender?: string;
}

export const MenstrualCycleItem = ({ value, gender }: MenstrualCycleItemProps) => {
  // Show only if gender is female or missing completely (undefined/null/empty string)
  const isFemaleOrMissing = !gender || gender.toLowerCase() === 'female';

  if (!isFemaleOrMissing) {
    return null;
  }

  const getLabel = (val?: string | null) => {
    switch (val) {
      case MenstrualCycle.ON:
        return 'On';
      case MenstrualCycle.OFF:
        return 'Off';
      case MenstrualCycle.PRE:
        return 'Pre-Cycle';
      default:
        return val || 'N/A';
    }
  };

  return <DataItem label="Menstrual Cycle" value={getLabel(value)} />;
};
