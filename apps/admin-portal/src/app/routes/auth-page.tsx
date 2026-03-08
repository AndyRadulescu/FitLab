import { AuthPage as BaseAuthPage } from '@my-org/auth';
import { analytics, auth } from '../../init-firebase-auth';
import { userStore } from '../store/user.store';
import { useTranslation } from 'react-i18next';
import { handleAuthErrors } from '@my-org/core';

export function AuthPage() {
  const { t } = useTranslation();
  const user = userStore((state) => state.user);

  return (
    <BaseAuthPage
      user={user}
      auth={auth}
      analytics={analytics}
      handleAuthErrors={(err) => handleAuthErrors(err, t)}
      redirectPath="/dashboard"
      logoSrc="/images/logo-title.svg"
    />
  );
}
