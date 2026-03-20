import { ArrowLeft } from 'lucide-react';
import './user-dashboard.scss';

interface UserDashboardHeaderProps {
  user: any;
  onBack: () => void;
}

export const UserDashboardHeader = ({ user, onBack }: UserDashboardHeaderProps) => {
  return (
    <div className="user-dashboard__header">
      <div className="user-dashboard__user-info">
        <button
          onClick={onBack}
          className="user-dashboard__back-button"
          aria-label="Go back"
        >
          <ArrowLeft className="h-6 w-6 text-gray-600" />
        </button>
        <div>
          <h2 className="user-dashboard__title">
            {user?.displayName || user?.email || 'User'}'s Dashboard
          </h2>
          <div className="user-dashboard__metadata">
            {user?.email && (
              <div className="flex items-center text-sm text-gray-500">
                <span className="user-dashboard__label">Email:</span>
                <span className="user-dashboard__value">{user.email}</span>
              </div>
            )}
            {user?.id && (
              <div className="flex items-center text-sm text-gray-500">
                <span className="user-dashboard__label">User ID:</span>
                <code className="user-dashboard__id-badge">{user.id}</code>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
