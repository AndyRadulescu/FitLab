import React, { useState } from 'react';
import { AllUserData } from '@my-org/core';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { Button } from '@my-org/shared-ui';
import { useNavigate } from 'react-router-dom';
import { EditableName } from '../../components/editable-name';
import { UnlinkUserButton } from '../../components/unlink-user-button';
import { DeleteUserModal } from '../../components/delete-user-modal';
import { userStore } from '../../store/user.store';
import './user-dashboard.scss';

interface UserDashboardHeaderProps {
  user?: AllUserData;
  onBack: () => void;
}

export const UserDashboardHeader = ({ user, onBack }: UserDashboardHeaderProps) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const navigate = useNavigate();
  const currentUserProfile = userStore((state) => state.userProfile);
  const removeUserFromList = userStore((state) => state.removeUserFromList);
  const isUnlinked = user?.connectionStatus === 'unlinked';
  const isPending = user?.connectionStatus === 'pending';

  const handleDeleteSuccess = () => {
    const targetId = user?.userId || user?.id;
    if (targetId) {
      removeUserFromList(targetId);
    }
    navigate('/dashboard');
  };

  return (
    <div className="user-dashboard__header">
      <div className="user-dashboard__user-info flex-1">
        <button
          onClick={onBack}
          className="user-dashboard__back-button"
          aria-label="Go back"
        >
          <ArrowLeft className="h-6 w-6 text-gray-600" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-2xl font-extrabold text-gray-900 tracking-tight">Dashboard of</span>
            <EditableName
              userId={user?.userId || user?.id || ''}
              initialName={user?.displayName || user?.email || 'User'}
              className="user-dashboard__title"
              inputClassName="text-2xl font-extrabold"
            />
            {user && (
              isUnlinked ? (
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200 uppercase tracking-tight">
                  Unlinked
                </span>
              ) : isPending ? (
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-tight">
                  Pending
                </span>
              ) : (
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-tight">
                  Linked
                </span>
              )
            )}
          </div>
          <div className="user-dashboard__metadata">
            {user?.email && (
              <div className="flex items-center text-sm text-gray-500">
                <span className="user-dashboard__label">Email:</span>
                <span className="user-dashboard__value">{user.email}</span>
              </div>
            )}
            {(user?.userId || user?.id) && (
              <div className="flex items-center text-sm text-gray-500">
                <span className="user-dashboard__label">User ID:</span>
                <code className="user-dashboard__id-badge">{user.userId || user.id}</code>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <UnlinkUserButton
          userId={user?.userId || user?.id || ''}
          displayName={user?.displayName || user?.email}
          connectionStatus={user?.connectionStatus}
        />
        {currentUserProfile?.isAdmin && (
          <Button
            type="secondary"
            buttonType="button"
            onClick={() => setIsDeleteModalOpen(true)}
            className="!w-auto flex items-center gap-2 text-sm py-2 px-4 !bg-red-50 hover:!bg-red-100 !text-red-700 !border-red-200"
          >
            <Trash2 className="h-4 w-4 text-red-600" />
            <span>Delete User</span>
          </Button>
        )}
      </div>

      {user && (
        <DeleteUserModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          userId={user.userId || user.id || ''}
          displayName={user.displayName || user.email}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  );
};
