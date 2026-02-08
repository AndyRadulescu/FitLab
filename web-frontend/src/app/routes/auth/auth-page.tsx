import { GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from 'firebase/auth';
import { analytics, auth } from '../../../init-firebase-auth';
import { userStore } from '../../store/user.store';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { SocialButton } from '../../design/social-button';
import { LanguageToggle } from '../../design/language-toggle';
import { AnalyticsTracker } from '../../analytics-tracker';
import { logEvent } from 'firebase/analytics';
import { handleAuthErrors } from './error-handler';

export function AuthPage() {
  const { i18n, t } = useTranslation();
  const isLoggedIn = userStore(state => state.isLoggedIn);
  const location = useLocation();

  if (isLoggedIn) return (
    <Navigate
      to="/"
      replace
      state={{ from: location }}
    />
  );

  const onSignInWithGoogle = () => {
    if (analytics) {
      logEvent(analytics, 'google-login');
    }
    auth.languageCode = i18n.language;
    void signInWithPopup(auth, new GoogleAuthProvider()).catch((err) => {
      handleAuthErrors(err, t);
    });;
  };

  const onSignInWithFacebook = () => {
    if (analytics) {
      logEvent(analytics, 'facebook-login');
    }
    auth.languageCode = i18n.language;
    void signInWithPopup(auth, new FacebookAuthProvider()).catch((err) => {
      handleAuthErrors(err, t);
    });;
  };

  return (
    <>
      <AnalyticsTracker />
      <div
        className="w-full min-h-svh flex flex-col lg:flex-row align-center bg-primary dark:bg-gray-800 lg:dark:bg-gray-700 lg:bg-white">
        <div
          className="flex-1 flex justify-center items-center p-8 lg:p-12 dark:bg-gray-800 lg:bg-primary lg:rounded-t-none lg:rounded-r-4xl">
          <img
            src="/images/logo-title.svg"
            alt="Logo"
            className="max-h-64 lg:max-h-[80%] object-contain"
          />
        </div>

        <div
          className="w-full md:w-[80%] md:ml-[10%] lg:ml-0 lg:max-w-xl bg-white dark:bg-gray-700 rounded-t-4xl lg:rounded-none flex flex-col justify-center">
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
              <div onClick={onSignInWithGoogle} className="mb-2">
                <SocialButton socialType="google"></SocialButton>
              </div>
              {/*<div onClick={onSignInWithFacebook} className="mb-4">*/}
              {/*  <SocialButton socialType="facebook"></SocialButton>*/}
              {/*</div>*/}

              <div className="flex justify-center w-full mt-6">
                <LanguageToggle />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
