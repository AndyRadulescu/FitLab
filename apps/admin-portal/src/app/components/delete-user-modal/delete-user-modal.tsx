import React, { useState } from 'react';
import { Button, Modal } from '@my-org/shared-ui';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { deleteUserByAdmin } from '../../firestore/queries';
import './delete-user-modal.scss';

export interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  displayName?: string;
  onSuccess?: () => void;
}

export const DeleteUserModal = ({
  isOpen,
  onClose,
  userId,
  displayName,
  onSuccess,
}: DeleteUserModalProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    if (loading) return;
    setError(null);
    onClose();
  };

  const handleDelete = async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      await deleteUserByAdmin(userId);
      onSuccess?.();
      handleClose();
    } catch (err: unknown) {
      console.error('Error deleting user account:', err);
      const errObj = err as { message?: string };
      setError(`Failed to delete user: ${errObj.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="!max-w-lg">
      <div className="delete-user-modal__container" data-testid="delete-user-modal">
        <header className="delete-user-modal__header">
          <div className="delete-user-modal__icon">
            <Trash2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="delete-user-modal__title">Delete User Account</h2>
            <p className="delete-user-modal__subtitle">
              Permanently delete participant records, metrics, and photos.
            </p>
          </div>
        </header>

        <div className="delete-user-modal__body">
          <p>
            Are you sure you want to permanently delete{' '}
            <strong className="text-gray-900 dark:text-gray-100 font-bold">
              {displayName || userId}
            </strong>
            ?
          </p>

          <div className="delete-user-modal__warning-box">
            <div className="flex items-center gap-1.5 font-bold text-red-900 dark:text-red-200">
              <AlertTriangle className="h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
              <span>This action cannot be undone</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-[11px] opacity-90 pl-1">
              <li>All check-in history and metric comparisons</li>
              <li>All uploaded progress photos and profile images in Storage</li>
              <li>All recorded weight entries and coach connections</li>
              <li>User profile and account document in Firestore</li>
            </ul>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 text-xs p-3 rounded-lg border border-red-200 font-medium">
              {error}
            </div>
          )}
        </div>

        <footer className="delete-user-modal__footer">
          <Button
            type="secondary"
            buttonType="button"
            onClick={handleClose}
            disabled={loading}
            className="!w-auto text-sm py-2 px-4"
          >
            Cancel
          </Button>
          <Button
            type="primary"
            buttonType="button"
            onClick={handleDelete}
            disabled={loading}
            className="!w-auto flex items-center gap-2 text-sm py-2 px-5 !bg-red-600 hover:!bg-red-700 !border-red-600"
          >
            {loading ? (
              <span>Deleting...</span>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                <span>Delete User</span>
              </>
            )}
          </Button>
        </footer>
      </div>
    </Modal>
  );
};
