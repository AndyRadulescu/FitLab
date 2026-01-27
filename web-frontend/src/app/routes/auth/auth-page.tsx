import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../../init-firebase-auth';
import { userStore } from '../../store/user.store';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { SocialButton } from '../../design/social-button';

export function AuthPage() {
  const { i18n } = useTranslation();
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
    void signInWithPopup(auth, new GoogleAuthProvider());
  };

  const onSignInWithFacebook = () => {
    void alert('NOT implemented yet');
  };

  return (
    <div className="w-full h-svh flex flex-col bg-primary dark:bg-gray-800">
      <div className="flex-1 flex justify-center items-start pt-12 px-4 mb-4">
        <img
          src="/images/logo-title.svg"
          alt="Logo"
          className="max-h-64 object-contain"
        />
      </div>
      <div className="w-full shadow-sm bg-white dark:bg-gray-700 rounded-t-4xl flex justify-center rounded">
        <div className="w-full py-16 px-[40px]">
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

            <div onClick={onSignInWithFacebook} className="mb-4">
              <SocialButton socialType="facebook"></SocialButton>
            </div>
            <div className="flex justify-center w-full">
              <select
                className="dark:text-gray-100"
                value={i18n.language}
                onChange={(e) => i18n.changeLanguage(e.target.value)}
              >
                <option value="en">🇺🇸English</option>
                <option value="ro">🇷🇴Română</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
