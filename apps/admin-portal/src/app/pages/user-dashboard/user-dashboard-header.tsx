import { AllUserData } from '@my-org/core';
import { ArrowLeft } from 'lucide-react';
import { EditableName } from '../../components/editable-name';
import './user-dashboard.scss';

interface UserDashboardHeaderProps {
  user?: AllUserData;
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
        <div className="flex-1">
          <div className="flex items-center gap-1">
            <span className="text-2xl font-extrabold text-gray-900 tracking-tight">Dashboard of</span>
            <EditableName
              userId={user?.userId || ''}
              initialName={user?.displayName || user?.email || 'User'}
              className="user-dashboard__title"
              inputClassName="text-2xl font-extrabold"
            />
          </div>
          <div className="user-dashboard__metadata">
            {user?.email && (
              <div className="flex items-center text-sm text-gray-500">
                <span className="user-dashboard__label">Email:</span>
                <span className="user-dashboard__value">{user.email}</span>
              </div>
            )}
            {user?.userId && (
              <div className="flex items-center text-sm text-gray-500">
                <span className="user-dashboard__label">User ID:</span>
                <code className="user-dashboard__id-badge">{user.userId}</code>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
