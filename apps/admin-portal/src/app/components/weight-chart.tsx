import { useMemo } from 'react';
import { TimeRange, WeightChart as SharedWeightChart } from '@my-org/shared-ui';
import clsx from 'clsx';
import { WeightString } from '@my-org/core';

interface WeightChartProps {
  weights: WeightString[];
  timeRange: TimeRange;
}

export const WeightChart = ({ weights, timeRange }: WeightChartProps) => {
  const { chartData, weightDiff, averageWeight } = useMemo(() => {
    const now = new Date();

    const filteredWeights = weights
      .filter((w) => {
        if (!w.createdAt) return false;
        const weightDate = new Date(w.createdAt);
        if (typeof timeRange === 'object') {
          const weightTime = weightDate.getTime();
          return weightTime >= timeRange.start.getTime() && weightTime <= timeRange.end.getTime();
        }

        const diffTime = Math.abs(now.getTime() - weightDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (timeRange === '1w') {
          return diffDays <= 7;
        } else if (timeRange === '4w') {
          return diffDays <= 28;
        } else if (timeRange === '6m') {
          return diffDays <= 180;
        }
        return true;
      })
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    let diff = 0;
    let avg = 0;
    if (filteredWeights.length >= 1) {
      const sum = filteredWeights.reduce((acc, curr) => acc + curr.weight, 0);
      console.log(sum);
      console.log(filteredWeights.length);
      console.log(sum / filteredWeights.length);
      avg = sum / filteredWeights.length;

      if (filteredWeights.length >= 2) {
        const firstWeight = filteredWeights[0].weight;
        const lastWeight = filteredWeights[filteredWeights.length - 1].weight;
        diff = lastWeight - firstWeight;
      }
    }

    const data = filteredWeights.map((w) => ({
      date: new Date(w.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      weight: w.weight,
      fullDate: new Date(w.createdAt).toLocaleDateString()
    }));

    return { chartData: data, weightDiff: diff, averageWeight: avg };
  }, [weights, timeRange]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-end">
        <div className="flex gap-8">
          {chartData.length >= 1 && (
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Average</span>
              <span className="text-2xl font-bold text-gray-700 dark:text-gray-200">
                {averageWeight.toFixed(1)} kg
              </span>
            </div>
          )}
          {chartData.length >= 2 && (
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Weight Change</span>
              <span className={clsx(
                'text-2xl font-bold',
                weightDiff > 0 ? 'text-red-500' : weightDiff < 0 ? 'text-green-500' : 'text-gray-700 dark:text-gray-200'
              )}>
                {weightDiff > 0 ? `+${weightDiff.toFixed(1)}` : weightDiff.toFixed(1)} kg
              </span>
            </div>
          )}
        </div>
      </div>
      <SharedWeightChart
        data={chartData}
        emptyMessage="No weight data available to display chart."
        stopOpacity={0.1}
        showDot={true}
        xAxisDy={10}
        yAxisDomain={['dataMin - 5', 'dataMax + 5']}
        tooltipFormatter={(value: number) => [`${value} kg`, 'Weight']}
      />
    </div>
  );
};
