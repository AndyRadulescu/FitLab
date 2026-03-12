import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';

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

  if (weights.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-gray-400 italic bg-gray-50 rounded-xl border border-gray-100">
        No weight data available to display chart.
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9ca3af', fontSize: 12 }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9ca3af', fontSize: 12 }}
            domain={['dataMin - 5', 'dataMax + 5']}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            }}
            labelStyle={{ fontWeight: 'bold', marginBottom: '4px', color: '#111827' }}
            formatter={(value: any) => [`${value} kg`, 'Weight']}
          />
          <Area
            type="monotone"
            dataKey="weight"
            stroke="#4f46e5"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorWeight)"
            dot={{ r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
