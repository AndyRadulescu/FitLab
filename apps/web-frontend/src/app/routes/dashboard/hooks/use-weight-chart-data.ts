import { useMemo } from 'react';
import { userStore } from '../../../store/user.store';
import { TimeRange } from '@my-org/shared-ui';

export interface ChartDataPoint {
  date: string;
  weight: number;
  timestamp: number;
}

export function useWeightChartData(timeRange?: TimeRange) {
  const weights = userStore((state) => state.weights);

  return useMemo(() => {
    const data: ChartDataPoint[] = [];

    weights.forEach((weight) => {
      data.push({
        date: new Date(weight.createdAt).toLocaleDateString(),
        weight: weight.weight,
        timestamp: new Date(weight.createdAt).getTime()
      });
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

    let filteredData = uniqueData;

    if (!timeRange) {
      filteredData = uniqueData.slice(-10);
    } else if (timeRange !== 'all') {
      const now = new Date().getTime();
      const days = timeRange === '1w' ? 7 : timeRange === '4w' ? 28 : 180;
      const ms = days * 24 * 60 * 60 * 1000;
      filteredData = uniqueData.filter(d => (now - d.timestamp) <= ms);
    }

    let diff = 0;
    if (filteredData.length >= 2) {
      diff = filteredData[filteredData.length - 1].weight - filteredData[0].weight;
    }

    return {
      chartData: filteredData,
      weightDiff: diff
    };
  }, [weights, timeRange]);
}
