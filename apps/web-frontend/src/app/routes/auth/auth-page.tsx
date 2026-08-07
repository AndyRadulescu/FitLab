import { analytics, auth } from '../../../init-firebase-auth';
import { userStore } from '../../store/user.store';
import { useTranslation } from 'react-i18next';
import { AnalyticsTracker } from '../../analytics-tracker';
import { handleAuthErrors } from '@my-org/core';
import { useHtmlLang } from '../../custom-hooks/use-html-lang';
import { AuthPage as BaseAuthPage } from '@my-org/auth';
import { useLastUsedProvider } from '../../custom-hooks/use-last-used-provider';
import { LastUsedBadge } from '../../components/last-used-badge/last-used-badge';

export function AuthPage() {
  useHtmlLang();
  const { t } = useTranslation();
  const user = userStore(state => state.user);
  const { lastUsedProvider, setLastUsedProvider } = useLastUsedProvider();

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
        lastUsedProvider={lastUsedProvider}
        onLoginAttempt={(provider) => setLastUsedProvider(provider)}
        onSocialClick={(provider) => setLastUsedProvider(provider)}
        renderLastUsedBadge={(provider) =>
          lastUsedProvider === provider ? <LastUsedBadge /> : null
        }
      />
    </>
  );
}
