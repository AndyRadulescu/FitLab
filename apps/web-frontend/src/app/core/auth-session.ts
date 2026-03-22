import { getAuth } from 'firebase/auth';
import { TFunction } from 'i18next';
import { NavigateFunction } from 'react-router-dom';

/**
 * Checks if the current Firebase auth session is stale (older than 5 minutes).
 * If stale, prompts the user to log out and re-authenticate for sensitive operations.
 * 
 * @returns true if session is stale and user was prompted (action should be aborted), false otherwise.
 */
export const isAuthSessionStale = async (
  t: TFunction,
  navigate: NavigateFunction,
  onLogout: () => void
): Promise<boolean> => {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  if (!currentUser) return false;

  // Firebase requires a recent login (within 5 minutes) for sensitive operations
  const lastSignInTime = new Date(currentUser.metadata.lastSignInTime || '').getTime();
  const isStale = (Date.now() - lastSignInTime) > 5 * 60 * 1000;

  if (isStale) {
    const message = t('auth.session_stale', 'For security, please re-login to perform this action. Log out now?');
    if (window.confirm(message)) {
      await auth.signOut();
      onLogout();
      navigate('/auth/login', { replace: true });
    }
    return true;
  }

  return false;
};
