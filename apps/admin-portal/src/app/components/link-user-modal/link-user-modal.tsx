import React, { useState } from 'react';
import { Button, Input, Modal } from '@my-org/shared-ui';
import { UserPlus } from 'lucide-react';
import { fetchCheckins, fetchUserInfo, fetchWeights, linkClient } from '../../firestore/queries';
import { userStore } from '../../store/user.store';
import { AllUserData } from '@my-org/core';
import './link-user-modal.scss';

export interface LinkUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  coachId?: string;
}

export const LinkUserModal = ({ isOpen, onClose, coachId }: LinkUserModalProps) => {
  const [userIdInput, setUserIdInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const addUserToList = userStore((state) => state.addUserToList);

  const handleClose = () => {
    setUserIdInput('');
    setError(null);
    setLoading(false);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedId = userIdInput.trim();

    if (!trimmedId) {
      setError('Please enter a User ID');
      return;
    }

    if (!coachId) {
      setError('Coach session not found. Please log in again.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const user = await fetchUserInfo(trimmedId);
      if (!user) {
        setError('User not found with this ID. Please verify the ID and try again.');
        setLoading(false);
        return;
      }

      await linkClient(coachId, user.id);
      const [checkins, weights] = await Promise.all([
        fetchCheckins(user.id),
        fetchWeights(user.id),
      ]);

      const enrichedUser: AllUserData = {
        ...user,
        connectionStatus: 'active',
        checkins,
        weights,
      };

      addUserToList(enrichedUser);
      handleClose();
    } catch (err: unknown) {
      console.error('Error linking user:', err);
      const errorObj = err as { message?: string };
      setError(`Failed to link user: ${errorObj.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="!max-w-lg">
      <div className="link-user-modal__container">
        <header className="link-user-modal__header">
          <div className="link-user-modal__icon">
            <UserPlus className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="link-user-modal__title">Link New Client</h2>
            <p className="link-user-modal__subtitle">
              Enter a registered participant's User ID to add them to your client dashboard.
            </p>
          </div>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="link-user-modal__body">
            <Input
              id="userId"
              label="User ID"
              placeholder="e.g. u8N2xK9mP1qR..."
              value={userIdInput}
              onChange={(e) => {
                setUserIdInput(e.target.value);
                if (error) setError(null);
              }}
              error={error || undefined}
              autoFocus
              disabled={loading}
              infoText="The unique identification string assigned to the user's account."
            />
          </div>


          <footer className="link-user-modal__footer">
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
              buttonType="submit"
              disabled={loading || !userIdInput.trim()}
              className="!w-auto flex items-center gap-2 text-sm py-2 px-5"
            >
              {loading ? (
                <span>Linking...</span>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  <span>Link Client</span>
                </>
              )}
            </Button>
          </footer>
        </form>
      </div>
    </Modal>
  );
};
