import { useMemo } from 'react';
import { userStore } from '../../../store/user.store';
import { checkinStore } from '../../../store/checkin.store';

export interface ChartDataPoint {
  date: string;
  weight: number;
  timestamp: number;
}

export function useWeightChartData() {
  const weights = userStore((state) => state.weights);
  const checkins = checkinStore((state) => state.checkins);

  return useMemo(() => {
    const data: ChartDataPoint[] = [];

    weights.forEach((weight) => {
      data.push({
        date: new Date(weight.createdAt).toLocaleDateString(),
        weight: weight.weight,
        timestamp: new Date(weight.createdAt).getTime()
      });
    });

    checkins.forEach((checkin) => {
      if (checkin.kg) {
        data.push({
          date: new Date(checkin.createdAt).toLocaleDateString(),
          weight: checkin.kg,
          timestamp: new Date(checkin.createdAt).getTime()
        });
      }
    });

    data.sort((a, b) => a.timestamp - b.timestamp);

    const uniqueData: ChartDataPoint[] = [];
    const seenDates = new Set<string>();

    for (let i = data.length - 1; i >= 0; i--) {
      if (!seenDates.has(data[i].date)) {
        uniqueData.unshift(data[i]);
        seenDates.add(data[i].date);
      }
    }

    return uniqueData.slice(-10);
  }, [weights, checkins]);
}
