import { GoogleAuthProvider, signInWithRedirect } from 'firebase/auth';
import { auth } from '../../../init-firebase-auth';
import { userStore } from '../../store/user.store';
import { Navigate, useLocation } from 'react-router-dom';

export function LoginPage() {
  const isLoggedIn = userStore(state => state.isLoggedIn);
  const location = useLocation();
  if(isLoggedIn) return (
    <Navigate
      to="/"
      replace
      state={{ from: location }}
    />
  )

  // useEffect(() => {
  //   if (isLoggedIn) {
  //     console.log('already logged in');
  //     redirect('/');
  //   }
  // });

  const signInWithGoogle = () => {
    void signInWithRedirect(auth, new GoogleAuthProvider());
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <button className="p-4 bg-blue-500" onClick={signInWithGoogle}> Sign in with google</button>
    </div>
  );
}
