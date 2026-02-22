import { useNavigate } from 'react-router-dom';
import { analytics, auth } from '../../../init-firebase-auth';
import { Trans, useTranslation } from 'react-i18next';
import { Card } from '../../components/design/card';
import { LanguageToggle } from '../../components/language-toggle/language-toggle';
import { logEvent } from 'firebase/analytics';
import { DangerZone } from '../../components/danger-zone/danger-zone';
import { LogOutIcon } from 'lucide-react';
import { SectionHeader } from '../../components/section-header';

export function ProfilePage() {
  useTranslation();
  const navigate = useNavigate();

  const logout = async () => {
    await auth.signOut();
    if (analytics) {
      logEvent(analytics, 'logout');
    }
    navigate('/auth/login', { replace: true });
  };

  return (
    <div>
      <SectionHeader><Trans i18nKey="profile.settings">Profile settings</Trans></SectionHeader>
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
          <LogOutIcon className="mr-2" />
          <Trans i18nKey="auth.signout">Log out</Trans>
        </button>
      </Card>
      <DangerZone />
    </div>
  );
}
