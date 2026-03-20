import { useUserDashboard } from '../hooks/use-user-dashboard';
import { CheckinList } from '../../components/checkin-list';
import { Button, LoadingScreen } from '@my-org/shared-ui';
import { CheckinDetailModal } from '../../components/checkin-detail-modal';
import { WeightChart } from '../../components/weight-chart';
import { UserDashboardHeader } from './user-dashboard-header';
import './user-dashboard.scss';

export const UserDashboard = () => {
  const {
    user,
    checkins,
    weights,
    loading,
    error,
    selectedCheckin,
    checkinId,
    handleCloseModal,
    handleSelectCheckin,
    handleGoBack
  } = useUserDashboard();

  if (loading) {
    return <LoadingScreen fullScreen={false} />;
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-700">{error}</p>
        <Button type="tertiary" onClick={handleGoBack} className="mt-4">Go Back</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <UserDashboardHeader user={user} onBack={handleGoBack} />

      <div className="user-dashboard__section">
        <h3 className="user-dashboard__section-title">Weight Fluctuation</h3>
        <WeightChart weights={weights} />
      </div>

      <div className="user-dashboard__section">
        <h3 className="user-dashboard__section-title">Check-in History</h3>
        <CheckinList checkins={checkins} onSelectCheckin={handleSelectCheckin} />
      </div>

      {checkinId && (
        <CheckinDetailModal
          checkin={selectedCheckin}
          isOpen={!!checkinId}
          onClose={handleCloseModal}
          loading={!selectedCheckin && loading}
        />
      )}
    </div>
  );
};
