import { useState } from 'react';
import { Card, WeightChart as SharedWeightChart, TimeRangeSelector, TimeRange } from '@my-org/shared-ui';
import { useTranslation } from 'react-i18next';
import { useWeightChartData } from '../hooks/use-weight-chart-data';

export function WeightChart() {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState<TimeRange>('1w');
  const { chartData, weightDiff } = useWeightChartData(timeRange);

  if (chartData.length === 0 && timeRange === 'all') {
    return null;
  }

  return (
    <Card className="p-4 mb-4 h-[300px] w-full bg-white dark:bg-gray-900 overflow-hidden [--chart-stroke:#6b7280] dark:[--chart-stroke:#E3CDA1] [--chart-tick:#9ca3af] dark:[--chart-tick:#E3CDA1] [--chart-stop-color:#9ca3af] dark:[--chart-stop-color:#E3CDA1] [--chart-grid:#e5e7eb] dark:[--chart-grid:#374151]">
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col">
          <h3 className="text-lg font-bold text-gray-700 dark:text-gray-100 leading-tight">
            {t('dashboard.journey')}
          </h3>
          {chartData.length >= 2 && (
            <span className="text-sm font-semibold primary-text-gradient">
              {weightDiff > 0 ? `+${weightDiff.toFixed(1)}` : weightDiff.toFixed(1)} kg
            </span>
          )}
        </div>
        <TimeRangeSelector
          value={timeRange}
          onChange={setTimeRange}
          triggerClassName="border border-gray-200 dark:border-amber-300/15 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-zinc-700 focus:ring-amber-300"
          activeOptionClassName="bg-amber-100 dark:bg-amber-300/20 text-amber-900 dark:text-amber-300 font-bold"
        />
      </div>
      <div className="h-[200px] w-full">
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
