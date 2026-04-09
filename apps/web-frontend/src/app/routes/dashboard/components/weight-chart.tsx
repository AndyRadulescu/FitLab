import { useState } from 'react';
import { Card, WeightChart as SharedWeightChart, TimeRangeSelector, TimeRange } from '@my-org/shared-ui';
import { useTranslation } from 'react-i18next';
import { useWeightChartData } from '../hooks/use-weight-chart-data';

export function WeightChart() {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState<TimeRange>('1w');
  const chartData = useWeightChartData(timeRange);

  if (chartData.length === 0 && timeRange === 'all') {
    return null;
  }

  return (
    <Card className="p-4 mb-4 h-[300px] w-full bg-white dark:bg-gray-900 overflow-hidden [--chart-stroke:#6b7280] dark:[--chart-stroke:#E3CDA1] [--chart-tick:#9ca3af] dark:[--chart-tick:#E3CDA1] [--chart-stop-color:#9ca3af] dark:[--chart-stop-color:#E3CDA1] [--chart-grid:#e5e7eb] dark:[--chart-grid:#374151]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-700 dark:text-gray-100">
          {t('dashboard.journey')}
        </h3>
        <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
      </div>
      <div className="h-[220px] w-full">
        <SharedWeightChart
          data={chartData}
          height="100%"
          margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
          emptyMessage={chartData.length === 0 ? "No weight data available to display chart." : undefined}
        />
      </div>
    </Card>
  );
}
