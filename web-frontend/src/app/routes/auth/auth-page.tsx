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
    <div className="w-full h-svh flex flex-col justify-end items-center bg-gray-700 relative">
      <div className="absolute top-10 inset-x-4 h-[50%] bg-[url('/images/logo-title.svg')] bg-no-repeat bg-top bg-center bg-contain"></div>
      <div className="w-full shadow-sm bg-white rounded-t-4xl flex justify-center rounded">
        <div className="w-full py-16 px-[40px]">
          <Outlet />
          <h3 className="w-full text-center inline-block my-2">
            <Trans i18nKey="auth.social">Social</Trans>
          </h3>
          <div className="w-full">
            <div onClick={onSignInWithGoogle} className="mb-2">
              <SocialButton socialType="google"></SocialButton>
            </div>

            <div onClick={onSignInWithFacebook} className="mb-4">
              <SocialButton socialType="facebook"></SocialButton>
            </div>
            <div className="flex justify-center w-full">
              <select
                value={i18n.language}
                onChange={(e) => i18n.changeLanguage(e.target.value)}
              >
                <option value="en">English</option>
                <option value="ro">Română</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
