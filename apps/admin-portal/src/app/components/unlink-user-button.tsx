import { UserMinus, UserPlus } from 'lucide-react';
import { userStore } from '../store/user.store';
import { unlinkClient, linkClient } from '../firestore/queries';
import { useNavigate } from 'react-router-dom';
import { ConnectionStatus } from '@my-org/core';

interface UnlinkUserButtonProps {
  userId: string;
  displayName?: string;
  className?: string;
  connectionStatus?: ConnectionStatus;
}

export const UnlinkUserButton = ({
  userId,
  displayName,
  className = '',
  connectionStatus = 'active'
}: UnlinkUserButtonProps) => {
  const navigate = useNavigate();
  const currentUser = userStore((state) => state.user);
  const updateUserInList = userStore((state) => state.updateUserInList);

  const isUnlinked = connectionStatus === 'unlinked';

  const handleAction = async () => {
    if (!userId || !currentUser) return;

    if (isUnlinked) {
      const confirmed = window.confirm(
        `Are you sure you want to link ${displayName || 'this user'}? This will add them to your active client list.`
      );

      if (confirmed) {
        try {
          await linkClient(currentUser.uid, userId);
          updateUserInList(userId, { connectionStatus: 'active' });
        } catch (error) {
          console.error('Failed to link client:', error);
          alert('Failed to link client. Please try again.');
        }
      }
    } else {
      const confirmed = window.confirm(
        `Are you sure you want to unlink ${displayName || 'this user'}? This will remove them from your active client list.`
      );

      if (confirmed) {
        try {
          await unlinkClient(currentUser.uid, userId);
          updateUserInList(userId, { connectionStatus: 'unlinked' });
          navigate('/dashboard');
        } catch (error) {
          console.error('Failed to unlink client:', error);
          alert('Failed to unlink client. Please try again.');
        }
      }
    }
  };

  if (isUnlinked) {
    return (
      <button
        onClick={handleAction}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-bold text-emerald-600 hover:bg-emerald-50 rounded-lg border border-emerald-200 transition-all uppercase tracking-wider ${className}`}
        title="Link User"
      >
        <UserPlus className="h-4 w-4" />
        Link User
      </button>
    );
  }

  return (
    <button
      onClick={handleAction}
      className={`flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg border border-red-100 transition-all uppercase tracking-wider ${className}`}
      title="Unlink User"
    >
      <UserMinus className="h-4 w-4" />
      Unlink User
    </button>
  );
};

