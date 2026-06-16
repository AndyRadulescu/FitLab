import { auth } from '../../init-firebase-auth';
import { Button, LoadingScreen } from '@my-org/shared-ui';
import { signOut } from 'firebase/auth';
import { Trans } from 'react-i18next';
import { Outlet, useNavigate } from 'react-router-dom';
import { userStore } from '../store/user.store';
import { useFetchClients } from '../hooks/useFetchClients';

export const Layout = () => {
  const navigate = useNavigate();
  const currentUser = userStore((state) => state.user);
  const { loading, error } = useFetchClients(currentUser?.uid);

  const onLogout = async () => {
    console.log('Logging out...');
    try {
      await signOut(auth);
      navigate('/auth/login', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return <LoadingScreen fullScreen={true} />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-6 shadow-md rounded-r-md max-w-2xl">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-bold text-red-800 uppercase tracking-wide">Initialization Error</h3>
              <p className="text-sm text-red-700 mt-2">{error}</p>
              <Button
                type="primary"
                buttonType="button"
                onClick={() => window.location.reload()}
                className="mt-4 !w-auto"
              >
                Retry
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm h-16 flex items-center justify-between px-8 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <img src="/logo.svg" alt="FitLab Admin" className="h-8 w-auto" />
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Admin Portal</h1>
        </div>

        <div className="flex items-center gap-4">
          <Button
            type="secondary"
            buttonType="button"
            onClick={() => void onLogout()}
            className="text-sm font-medium py-2 px-4 !w-auto"
          >
            <Trans i18nKey="auth.logout">Logout</Trans>
          </Button>
        </div>
      </header>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
