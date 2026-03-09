import { auth } from '../../init-firebase-auth';
import { Button } from '@my-org/shared-ui';
import { signOut } from 'firebase/auth';
import { Trans } from 'react-i18next';
import { Outlet, useNavigate } from 'react-router-dom';

export const Layout = () => {
  const navigate = useNavigate();
  const onLogout = async () => {
    console.log('Logging out...');
    try {
      await signOut(auth);
      navigate('/auth/login', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

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
