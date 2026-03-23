import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthProvider, AuthContextProps } from './types';
import { GoogleAuthProvider, FacebookAuthProvider, signInWithRedirect } from 'firebase/auth';
import { logEvent } from 'firebase/analytics';
import { Trans, useTranslation } from 'react-i18next';
import { LanguageToggle, SocialButton } from '@my-org/shared-ui';
import { ReactNode } from 'react';

interface AuthPageProps extends AuthContextProps {
  user: any; // Ideally typed according to your user store
  logoSrc?: string;
  children?: ReactNode;
}

export function AuthPage({ user, auth, analytics, handleAuthErrors, redirectPath, logoSrc = '/images/logo-title.svg' }: AuthPageProps) {
  const location = useLocation();
  const { i18n, t } = useTranslation();

  if (user) {
    return <Navigate to={redirectPath} replace state={{ from: location }} />;
  }

  const onSocialLogin = async (provider: 'google' | 'facebook') => {
    auth.languageCode = i18n.language;
    const authProvider = provider === 'google' ? new GoogleAuthProvider() : new FacebookAuthProvider();
    if (analytics) {
      logEvent(analytics, `${provider}-login`);
    }
    try {
      await signInWithRedirect(auth, authProvider);
    } catch (err: any) {
      handleAuthErrors(err, t);
    }
  };

  return (
    <AuthProvider auth={auth} analytics={analytics} handleAuthErrors={handleAuthErrors} redirectPath={redirectPath}>
      <div
        className="auth-theme-trigger w-full min-h-svh flex flex-col lg:flex-row align-center bg-primary dark:bg-zinc-950 lg:dark:bg-neutral-700 lg:bg-white">

        {/* Left side - Logo/Image */}
        <div
          className="flex-1 flex justify-center items-center p-8 lg:p-12 dark:bg-zinc-950 lg:bg-primary lg:rounded-t-none lg:rounded-r-4xl">
          <img
            src={logoSrc}
            alt="Logo"
            className="max-h-64 lg:max-h-[80%] object-contain"
          />
        </div>

        {/* Right side - Form */}
        <div
          className="w-full md:w-[80%] md:ml-[10%] lg:ml-0 lg:max-w-xl bg-white dark:bg-neutral-700 rounded-t-4xl lg:rounded-none flex flex-col justify-center">
          <div className="w-full py-16 px-6 md:px-12 lg:px-16">
            <Outlet />

            <div className="flex items-center gap-4 w-full my-4">
              <div className="flex-1 h-px bg-gray-300" />
              <span className="text-sm text-gray-500 dark:text-gray-100 whitespace-nowrap">
                <Trans i18nKey="auth.social">Social</Trans>
              </span>
              <div className="flex-1 h-px bg-gray-300" />
            </div>

            <div className="w-full">
              <div className="mb-2">
                <SocialButton socialType="google" onClick={() => void onSocialLogin('google')} />
              </div>
              <div className="mb-4">
                <SocialButton socialType="facebook" onClick={() => void onSocialLogin('facebook')} />
              </div>

              <div className="flex justify-center w-full mt-6 flex-col items-center gap-4">
                <LanguageToggle analytics={analytics} />
                <a href="https://amazonia-fitlab.ro/privacy-policy/"
                   target="_blank"
                   rel="noopener noreferrer"
                   className="text-xs text-gray-500 hover:text-primary transition-colors underline underline-offset-4 mt-2">
                  <Trans i18nKey="profile.privacy_policy">Privacy Policy</Trans>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthProvider>
  );
}
