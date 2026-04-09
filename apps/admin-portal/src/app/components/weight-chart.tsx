import { useMemo } from 'react';
import { WeightChart as SharedWeightChart } from '@my-org/shared-ui';

interface WeightChartProps {
  weights: any[];
}

export const WeightChart = ({ weights }: WeightChartProps) => {
  const data = useMemo(() => {
    return weights.map((w) => ({
      date: w.createdAt?.toDate
        ? w.createdAt.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        : 'N/A',
      weight: w.weight,
      fullDate: w.createdAt?.toDate ? w.createdAt.toDate().toLocaleDateString() : 'N/A',
    }));
  }, [weights]);

  return (
    <SharedWeightChart
      data={data}
      emptyMessage="No weight data available to display chart."
      stopOpacity={0.1}
      showDot={true}
      xAxisDy={10}
      yAxisDomain={['dataMin - 5', 'dataMax + 5']}
      tooltipFormatter={(value: any) => [`${value} kg`, 'Weight']}
    />
  );
};
