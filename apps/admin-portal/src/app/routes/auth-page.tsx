import { AuthPage as BaseAuthPage } from '@my-org/auth';
import { analytics, auth } from '../../init-firebase-auth';
import { userStore } from '../store/user.store';
import { useTranslation } from 'react-i18next';

export function AuthPage() {
  const { t } = useTranslation();
  const user = userStore((state) => state.user);

  // Simple error handler using translations
  const handleAuthErrors = (err: any) => {
    console.error('Auth error:', err);
    // Ideally we'd have a full handleAuthErrors like in web-frontend
    // but for now we'll just show the error message or a default
    alert(t('errors.unknown'));
  };

  return (
    <BaseAuthPage
      user={user}
      auth={auth}
      analytics={analytics}
      handleAuthErrors={handleAuthErrors}
      redirectPath="/dashboard"
      logoSrc="/images/logo-title.svg"
    />
  );
}
