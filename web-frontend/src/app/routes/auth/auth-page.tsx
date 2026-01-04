import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../../init-firebase-auth';
import { userStore } from '../../store/user.store';
import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';

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

  return (
    <div className="w-full h-svh flex justify-center items-center bg-linear-to-r from-violet-500 to-fuchsia-500">
      <div className="w-sm shadow-sm bg-white rounded flex justify-center">
        <div className="w-full py-16">
          <Outlet />
          <h3 className="w-full text-center inline-block my-2">Social</h3>
          <div className="w-full justify-center flex">
            <button className="p-4 bg-blue-500 rounded-full mb-3" onClick={onSignInWithGoogle}> G</button>
          </div>
        </div>
      </div>
    </div>
  );
}
