import { useMemo } from 'react';
import { CheckInFormDataDto } from '@my-org/core';
import { TimeRange, MetricChart } from '@my-org/shared-ui';

interface CheckinMetricsChartsProps {
  checkins: CheckInFormDataDto[];
  timeRange: TimeRange;
}

interface MetricConfig {
  key: keyof CheckInFormDataDto;
  label: string;
  unit: string;
  gradientId: string;
  strokeColor?: string;
  stopColor?: string;
}

const metrics: MetricConfig[] = [
  { key: 'breastSize', label: 'Bust', unit: 'cm', gradientId: 'gradBust', strokeColor: '#3b82f6', stopColor: '#3b82f6' },
  { key: 'waistSize', label: 'Waist', unit: 'cm', gradientId: 'gradWaist', strokeColor: '#f59e0b', stopColor: '#f59e0b' },
  { key: 'hipSize', label: 'Hips', unit: 'cm', gradientId: 'gradHips', strokeColor: '#10b981', stopColor: '#10b981' },
  { key: 'buttSize', label: 'Glutes', unit: 'cm', gradientId: 'gradGlutes', strokeColor: '#8b5cf6', stopColor: '#8b5cf6' },
  { key: 'leftThigh', label: 'Left Thigh', unit: 'cm', gradientId: 'gradLeftThigh', strokeColor: '#ec4899', stopColor: '#ec4899' },
  { key: 'rightThigh', label: 'Right Thigh', unit: 'cm', gradientId: 'gradRightThigh', strokeColor: '#f43f5e', stopColor: '#f43f5e' },
  { key: 'leftArm', label: 'Left Arm', unit: 'cm', gradientId: 'gradLeftArm', strokeColor: '#06b6d4', stopColor: '#06b6d4' },
  { key: 'rightArm', label: 'Right Arm', unit: 'cm', gradientId: 'gradRightArm', strokeColor: '#14b8a6', stopColor: '#14b8a6' },
  { key: 'hoursSlept', label: 'Sleep Hours', unit: 'hrs', gradientId: 'gradSleep', strokeColor: '#6366f1', stopColor: '#6366f1' },
  { key: 'planAccuracy', label: 'Plan Accuracy', unit: '/10', gradientId: 'gradPlan', strokeColor: '#84cc16', stopColor: '#84cc16' },
  { key: 'energyLevel', label: 'Energy Level', unit: '/10', gradientId: 'gradEnergy', strokeColor: '#eab308', stopColor: '#eab308' },
  { key: 'moodCheck', label: 'Mood Check', unit: '/10', gradientId: 'gradMood', strokeColor: '#a855f7', stopColor: '#a855f7' },
  { key: 'dailySteps', label: 'Daily Steps', unit: 'steps', gradientId: 'gradSteps', strokeColor: '#6b7280', stopColor: '#6b7280' },
  { key: 'workouts', label: 'Workouts', unit: 'sessions', gradientId: 'gradWorkouts', strokeColor: '#4f46e5', stopColor: '#4f46e5' }
];

export const CheckinMetricsCharts = ({ checkins, timeRange }: CheckinMetricsChartsProps) => {
  const filteredCheckins = useMemo(() => {
    const now = new Date();
    return checkins
      .filter((c) => {
        if (!c.createdAt) return false;
        const checkinDate = new Date(c.createdAt);
        if (typeof timeRange === 'object') {
          const checkinTime = checkinDate.getTime();
          return checkinTime >= timeRange.start.getTime() && checkinTime <= timeRange.end.getTime();
        }

        const diffTime = Math.abs(now.getTime() - checkinDate.getTime());
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
  }, [checkins, timeRange]);

  if (filteredCheckins.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 italic">
        No check-in metrics available for the selected timeframe.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {metrics.map((metric) => {
        const dataForMetric = filteredCheckins
          .map((c) => ({
            date: new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            value: c[metric.key] as number
          }))
          .filter((point) => point.value !== undefined && point.value !== null);

        return (
          <div
            key={metric.key}
            className="bg-white dark:bg-zinc-800 p-4 rounded-xl border border-gray-100 dark:border-zinc-700/50 shadow-sm flex flex-col gap-2 animate-in fade-in duration-300"
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{metric.label}</span>
              {dataForMetric.length > 0 && (
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-zinc-700/50 px-2 py-0.5 rounded-full">
                  Latest: {dataForMetric[dataForMetric.length - 1].value.toLocaleString()} {metric.unit}
                </span>
              )}
            </div>
            <MetricChart
              data={dataForMetric}
              metricLabel={metric.label}
              unit={metric.unit}
              gradientId={metric.gradientId}
              strokeColor={metric.strokeColor}
              stopColor={metric.stopColor}
              height={160}
              emptyMessage={`No ${metric.label.toLowerCase()} data available.`}
            />
          </div>
        );
      })}
    </div>
  );
};
