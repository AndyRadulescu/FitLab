import { useMemo } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { userStore } from '../../../store/user.store';
import { checkinStore } from '../../../store/checkin.store';
import { Card } from '../../../components/design/card';
import { Trans } from 'react-i18next';
import { ChartBar } from 'lucide-react';

export function WeightChart() {
  const weights = userStore((state) => state.weights);
  const checkins = checkinStore((state) => state.checkins);

  const chartData = useMemo(() => {
    const data: { date: string; weight: number; timestamp: number }[] = [];

    weights.forEach((weight) => {
      data.push({
        date: new Date(weight.createdAt).toLocaleDateString(),
        weight: weight.weight,
        timestamp: new Date(weight.createdAt).getTime()
      });
    });

    checkins.forEach((checkin) => {
      if (checkin.kg) {
        data.push({
          date: new Date(checkin.createdAt).toLocaleDateString(),
          weight: checkin.kg,
          timestamp: new Date(checkin.createdAt).getTime()
        });
      }
    });

    data.sort((a, b) => a.timestamp - b.timestamp);

    const uniqueData: typeof data = [];
    const seenDates = new Set<string>();

    for (let i = data.length - 1; i >= 0; i--) {
      if (!seenDates.has(data[i].date)) {
        uniqueData.unshift(data[i]);
        seenDates.add(data[i].date);
      }
    }

    return uniqueData.slice(-10);
  }, [weights, checkins]);

  return (
    <Card className="p-4 mb-4 w-full bg-white dark:bg-gray-900 overflow-hidden">
      {chartData.length > 0 ?
        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#9ca3af' }}
                minTickGap={30}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#9ca3af' }}
                domain={['auto', 'auto']}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
                labelStyle={{ fontWeight: 'bold', color: '#374151' }}
              />
              <Area
                type="monotone"
                dataKey="weight"
                stroke="#3b82f6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorWeight)"
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        :
        <div className="flex">
          <p className="mr-2"><Trans i18nKey="dashboard.nothingYet" /></p>
          <ChartBar />
        </div>
      }
    </Card>
  );
}
