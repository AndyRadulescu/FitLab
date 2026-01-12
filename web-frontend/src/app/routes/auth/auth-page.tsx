import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../../init-firebase-auth';
import { userStore } from '../../store/user.store';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Trans } from 'react-i18next';

export function AuthPage() {
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
    void alert("NOT implemented yet")
  };

  return (
    <div className="w-full h-svh flex justify-center items-center bg-linear-to-r from-amber-300 to-red-900">
      <div className="w-sm shadow-sm bg-white rounded flex justify-center">
        <div className="w-full py-16 mb-6 px-4">
          <Outlet />
          <h3 className="w-full text-center inline-block my-2">
            <Trans i18nKey="auth.social">Social</Trans>
          </h3>
          <div className="w-full">
            <button type="button"
                    onClick={onSignInWithGoogle}
                    className="mb-2 w-full text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 box-border border border-transparent font-medium leading-5 rounded-full text-sm px-4 py-2.5 inline-flex items-center justify-center dark:focus:ring-[#4285F4]/55">
              <svg className="w-4 h-4 me-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24"
                   height="24" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd"
                      d="M12.037 21.998a10.313 10.313 0 0 1-7.168-3.049 9.888 9.888 0 0 1-2.868-7.118 9.947 9.947 0 0 1 3.064-6.949A10.37 10.37 0 0 1 12.212 2h.176a9.935 9.935 0 0 1 6.614 2.564L16.457 6.88a6.187 6.187 0 0 0-4.131-1.566 6.9 6.9 0 0 0-4.794 1.913 6.618 6.618 0 0 0-2.045 4.657 6.608 6.608 0 0 0 1.882 4.723 6.891 6.891 0 0 0 4.725 2.07h.143c1.41.072 2.8-.354 3.917-1.2a5.77 5.77 0 0 0 2.172-3.41l.043-.117H12.22v-3.41h9.678c.075.617.109 1.238.1 1.859-.099 5.741-4.017 9.6-9.746 9.6l-.215-.002Z"
                      clip-rule="evenodd" />
              </svg>
              Sign in with Google
            </button>

            <button type="button"
                    onClick={onSignInWithFacebook}
                    className="w-full text-white bg-[#3b5998] hover:bg-[#3b5998]/90 focus:ring-4 focus:outline-none focus:ring-[#3b5998]/50 box-border border border-transparent font-medium leading-5 rounded-full text-sm px-4 py-2.5 text-center inline-flex items-center justify-center dark:focus:ring-[#3b5998]/55">
              <svg className="w-4 h-4 me-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24"
                   height="24" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd"
                      d="M13.135 6H15V3h-1.865a4.147 4.147 0 0 0-4.142 4.142V9H7v3h2v9.938h3V12h2.021l.592-3H12V6.591A.6.6 0 0 1 12.592 6h.543Z"
                      clip-rule="evenodd" />
              </svg>
              Sign in with Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
