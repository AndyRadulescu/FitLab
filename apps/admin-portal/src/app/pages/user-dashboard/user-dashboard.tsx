import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { userStore } from '../../store/user.store';
import { CheckinList } from '../../components/checkin-list';
import { Button, TimeRange, TimeRangeSelector } from '@my-org/shared-ui';
import { CheckinDetailModal } from '../../components/checkin-detail-modal';
import { WeightChart } from '../../components/weight-chart';
import { CheckinMetricsCharts } from '../../components/checkin-metrics-charts';
import { UserDashboardHeader } from './user-dashboard-header';
import './user-dashboard.scss';

export const UserDashboard = () => {
  const { userId, checkinId } = useParams<{ userId: string; checkinId?: string }>();
  const navigate = useNavigate();
  const { userList } = userStore();
  const [timeRange, setTimeRange] = useState<TimeRange>('4w');

  const user = userList?.find((u) => u.userId === userId);
  const checkins = user?.checkins || [];
  const weights = user?.weights || [];

  const handleGoBack = () => {
    navigate('/dashboard');
  };

  const selectedCheckin = checkins.find((c) => c.id === checkinId);

  const handleCloseModal = () => {
    navigate(`/dashboard/${userId}`);
  };

  const handleSelectCheckin = (cid: string) => {
    navigate(`/dashboard/${userId}/${cid}`);
  };

  if (!user) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-700">User not found.</p>
        <Button type="tertiary" onClick={handleGoBack} className="mt-4">Go Back</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <UserDashboardHeader user={user} onBack={handleGoBack} />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white dark:bg-zinc-800 p-4 rounded-xl shadow-md border border-gray-100 dark:border-zinc-700/50 gap-4 animate-in fade-in duration-300">
        <div>
          <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">Analysis Timeframe</h4>
          <p className="text-xs text-gray-500">Filter weight and check-in metrics charts</p>
        </div>
        <TimeRangeSelector
          value={timeRange}
          onChange={setTimeRange}
          triggerClassName="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-indigo-500"
          activeOptionClassName="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-bold"
        />
      </div>

      <div className="user-dashboard__section">
        <h3 className="user-dashboard__section-title">Weight Fluctuation</h3>
        <WeightChart weights={weights} timeRange={timeRange} />
      </div>

      <div className="user-dashboard__section">
        <h3 className="user-dashboard__section-title">Check-in Metrics</h3>
        <CheckinMetricsCharts checkins={checkins} timeRange={timeRange} />
      </div>

      <div className="user-dashboard__section">
        <h3 className="user-dashboard__section-title">Check-in History</h3>
        <CheckinList checkins={checkins} weights={weights} onSelectCheckin={handleSelectCheckin} />
      </div>

      {checkinId && (
        <CheckinDetailModal
          checkin={selectedCheckin}
          weights={weights}
          gender={user?.gender}
          isOpen={!!checkinId}
          onClose={handleCloseModal}
          loading={!selectedCheckin}
        />
      )}
    </div>
  );
};
