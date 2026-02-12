import { useNavigate } from 'react-router-dom';
import { userStore } from '../../store/user.store';
import { analytics, auth } from '../../../init-firebase-auth';
import { Trans, useTranslation } from 'react-i18next';
import { Card } from '../../components/design/card';
import { LanguageToggle } from '../../components/language-toggle';
import { logEvent } from 'firebase/analytics';
import { DangerZone } from '../../components/danger-zone/danger-zone';
import { LogOutIcon } from 'lucide-react';

export function ProfilePage() {
  useTranslation(); // needed to automatically translate the page
  const setUser = userStore(state => state.setUser);
  const navigate = useNavigate();

  const logout = async () => {
    await auth.signOut();
    setUser(undefined);
    if (analytics) {
      logEvent(analytics, 'logout');
    }
    navigate('/auth/login', { replace: true });
  };

  return (
    <div>
      <h2 className="text-2xl mb-4 dark:text-gray-300"><Trans i18nKey="profile.title">Profile settings</Trans></h2>
      <Card className="mb-4">
        <div className="flex justify-center w-full mb-4">
          <div className="text-center">
            <p className="mb-2"><Trans i18nKey="profile.change.language">Change language</Trans></p>
            <LanguageToggle />
          </div>
        </div>
        <button type="button"
                onClick={logout}
                className="w-full bg-gray-200 dark:bg-gray-600 box-border border border-transparent font-medium leading-5 rounded-full text-sm px-4 py-2.5 text-center inline-flex items-center justify-center dark:focus:ring-[#3b5998]/55">
          <LogOutIcon className="mr-2"/>
          <Trans i18nKey="auth.signout">Log out</Trans>
        </button>
      </Card>
      <DangerZone />
    </div>
  );
}
