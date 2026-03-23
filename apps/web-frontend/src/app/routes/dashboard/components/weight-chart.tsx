import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { Card } from '@my-org/shared-ui';
import { useTranslation } from 'react-i18next';
import { useWeightChartData } from '../hooks/use-weight-chart-data';

export function WeightChart() {
  const { t } = useTranslation();
  const chartData = useWeightChartData();

  if (chartData.length === 0) {
    return null;
  }

  return (
    <Card className="p-4 mb-4 h-[300px] w-full bg-white dark:bg-gray-900 overflow-hidden [--chart-stroke:#6b7280] dark:[--chart-stroke:#E3CDA1] [--chart-tick:#9ca3af] dark:[--chart-tick:#E3CDA1] [--chart-stop-color:#9ca3af] dark:[--chart-stop-color:#E3CDA1] [--chart-grid:#e5e7eb] dark:[--chart-grid:#374151]">
      <h3 className="text-lg font-bold mb-4 text-gray-700 dark:text-gray-100">
        {t('dashboard.journey')}
      </h3>
      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--chart-stop-color)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--chart-stop-color)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: 'var(--chart-tick)' }}
              minTickGap={30}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: 'var(--chart-tick)' }}
              domain={['auto', 'auto']}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '8px',
                border: 'none',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
              labelStyle={{ fontWeight: 'bold', color: 'var(--chart-stroke)' }}
            />
            <Area
              type="monotone"
              dataKey="weight"
              stroke="var(--chart-stroke)"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorWeight)"
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
