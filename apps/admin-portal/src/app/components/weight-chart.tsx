import { useMemo, useState } from 'react';
import { WeightChart as SharedWeightChart, TimeRangeSelector, TimeRange } from '@my-org/shared-ui';

interface WeightChartProps {
  weights: any[];
}

export const WeightChart = ({ weights }: WeightChartProps) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('1w');

  const data = useMemo(() => {
    const now = new Date();
    
    const filteredWeights = weights.filter((w) => {
      if (!w.createdAt?.toDate) return false;
      const weightDate = w.createdAt.toDate();
      const diffTime = Math.abs(now.getTime() - weightDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (timeRange === '1w') {
        return diffDays <= 7;
      } else if (timeRange === '4w') {
        return diffDays <= 28;
      } else if (timeRange === '6m') {
        return diffDays <= 180;
      }
      // 'all'
      return true;
    });

    return filteredWeights.map((w) => ({
      date: w.createdAt.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      weight: w.weight,
      fullDate: w.createdAt.toDate().toLocaleDateString(),
    }));
  }, [weights, timeRange]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
      </div>
      <SharedWeightChart
        data={data}
        emptyMessage="No weight data available to display chart."
        stopOpacity={0.1}
        showDot={true}
        xAxisDy={10}
        yAxisDomain={['dataMin - 5', 'dataMax + 5']}
        tooltipFormatter={(value: any) => [`${value} kg`, 'Weight']}
      />
    </div>
  );
};
