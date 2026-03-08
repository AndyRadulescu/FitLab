import { analytics, auth } from '../../../init-firebase-auth';
import { userStore } from '../../store/user.store';
import { useTranslation } from 'react-i18next';
import { AnalyticsTracker } from '../../analytics-tracker';
import { handleAuthErrors } from '@my-org/core';
import { useHtmlLang } from '../../custom-hooks/use-html-lang';
import { AuthPage as BaseAuthPage } from '@my-org/auth';

export function AuthPage() {
  useHtmlLang();
  const { t } = useTranslation();
  const user = userStore(state => state.user);

  return (
    <>
      <AnalyticsTracker />
      <BaseAuthPage
        user={user}
        auth={auth}
        analytics={analytics}
        handleAuthErrors={(err) => handleAuthErrors(err, t)}
        redirectPath="/"
        logoSrc="/images/logo-title.svg"
      />
    </>
  );
}
