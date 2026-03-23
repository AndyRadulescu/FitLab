import { useNavigate } from 'react-router-dom';
import { analytics, auth } from '../../../init-firebase-auth';
import { Trans, useTranslation } from 'react-i18next';
import { Card, Button } from '@my-org/shared-ui';
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
      <SectionHeader>
        <div>
          <h1 className="text-gray-900 primary-text-dark bold text-2xl md:text-4xl">
            <Trans i18nKey="profile.settings">Profile settings</Trans>
          </h1>
          <p
            className="text-xs md:text-xl text-ellipsis text-gray-500">@{auth.currentUser?.displayName ?? auth.currentUser?.email}</p>
        </div>
      </SectionHeader>
      <div className="mb-4">
        <LanguageToggle />
      </div>

      <div className="mb-6">
        <Button 
          type="secondary"
          onClick={logout}
          icon={<LogOutIcon size={20} />}
        >
          <Trans i18nKey="auth.signout">Log out</Trans>
        </Button>
      </div>

      <Card className="mb-4">
        <div className="text-center">
          <a href="https://amazonia-fitlab.ro/privacy-policy/"
             target="_blank"
             rel="noopener noreferrer"
             className="text-xs text-gray-500 hover:text-primary transition-colors underline underline-offset-4">
            <Trans i18nKey="profile.privacy_policy">Privacy Policy</Trans>
          </a>
        </div>
      </Card>
      <DangerZone />
    </div>
  );
}
