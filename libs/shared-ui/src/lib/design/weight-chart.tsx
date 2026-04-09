import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import clsx from 'clsx';

export interface WeightChartDataPoint {
  date: string;
  weight: number;
  [key: string]: any;
}

export interface WeightChartProps {
  data: WeightChartDataPoint[];
  height?: number | string;
  className?: string;
  emptyMessage?: string;
  margin?: { top: number; right: number; left: number; bottom: number };
  animationDuration?: number;
  showDot?: boolean;
  strokeColor?: string;
  stopColor?: string;
  stopOpacity?: number;
  gridColor?: string;
  tickColor?: string;
  yAxisDomain?: [string | number, string | number];
  xAxisMinTickGap?: number;
  xAxisDy?: number;
  tooltipFormatter?: (value: any) => [string, string];
}

export function WeightChart({
  data,
  height = 300,
  className = '',
  emptyMessage,
  margin = { top: 10, right: 10, left: -20, bottom: 0 },
  animationDuration = 1500,
  showDot = false,
  strokeColor = 'var(--chart-stroke, #4f46e5)',
  stopColor = 'var(--chart-stop-color, #4f46e5)',
  stopOpacity = 0.3,
  gridColor = 'var(--chart-grid, #f3f4f6)',
  tickColor = 'var(--chart-tick, #9ca3af)',
  yAxisDomain = ['auto', 'auto'],
  xAxisMinTickGap = 30,
  xAxisDy = 0,
  tooltipFormatter,
}: WeightChartProps) {
  if (data.length === 0) {
    if (emptyMessage) {
      return (
        <div
          className={clsx(
            'flex items-center justify-center text-gray-400 italic bg-gray-50 rounded-xl border border-gray-100',
            className
          )}
          style={{ height }}
        >
          {emptyMessage}
        </div>
      );
    }
    return null;
  }

  return (
    <div className={clsx('w-full', className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={margin}>
          <defs>
            <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={stopColor} stopOpacity={stopOpacity} />
              <stop offset="95%" stopColor={stopColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: tickColor }}
            minTickGap={xAxisMinTickGap}
            dy={xAxisDy}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: tickColor }}
            domain={yAxisDomain}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '8px',
              border: 'none',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            }}
            labelStyle={{ fontWeight: 'bold', color: strokeColor }}
            formatter={tooltipFormatter}
          />
          <Area
            type="monotone"
            dataKey="weight"
            stroke={strokeColor}
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorWeight)"
            animationDuration={animationDuration}
            dot={
              showDot
                ? {
                    r: 4,
                    fill: strokeColor,
                    strokeWidth: 2,
                    stroke: '#fff',
                  }
                : false
            }
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
