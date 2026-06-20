import { useParams, useNavigate } from 'react-router-dom';
import { userStore } from '../../store/user.store';
import { CheckinList } from '../../components/checkin-list';
import { Button } from '@my-org/shared-ui';
import { CheckinDetailModal } from '../../components/checkin-detail-modal';
import { WeightChart } from '../../components/weight-chart';
import { UserDashboardHeader } from './user-dashboard-header';
import './user-dashboard.scss';

export const UserDashboard = () => {
  const { userId, checkinId } = useParams<{ userId: string; checkinId?: string }>();
  const navigate = useNavigate();
  const { userList } = userStore();

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

      <div className="user-dashboard__section">
        <h3 className="user-dashboard__section-title">Weight Fluctuation</h3>
        <WeightChart weights={weights} />
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
