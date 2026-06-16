import { UserMinus } from 'lucide-react';
import { userStore } from '../store/user.store';
import { unlinkClient } from '../firestore/queries';
import { useNavigate } from 'react-router-dom';

interface UnlinkUserButtonProps {
  userId: string;
  displayName?: string;
  className?: string;
}

export const UnlinkUserButton = ({ userId, displayName, className = '' }: UnlinkUserButtonProps) => {
  const navigate = useNavigate();
  const currentUser = userStore((state) => state.user);
  const removeUserFromList = userStore((state) => state.removeUserFromList);

  const handleUnlink = async () => {
    if (!userId || !currentUser) return;
    
    const confirmed = window.confirm(
      `Are you sure you want to unlink ${displayName || 'this user'}? This will remove them from your active client list.`
    );
    
    if (confirmed) {
      try {
        await unlinkClient(currentUser.uid, userId);
        removeUserFromList(userId);
        navigate('/dashboard');
      } catch (error) {
        console.error('Failed to unlink client:', error);
        alert('Failed to unlink client. Please try again.');
      }
    }
  };

  return (
    <button
      onClick={handleUnlink}
      className={`flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg border border-red-100 transition-all uppercase tracking-wider ${className}`}
      title="Unlink User"
    >
      <UserMinus className="h-4 w-4" />
      Unlink User
    </button>
  );
};
