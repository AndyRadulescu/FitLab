import { GoogleAuthProvider, signInWithPopup, signInWithRedirect } from 'firebase/auth';
import { auth } from '../../../init-firebase-auth';
import { userStore } from '../../store/user.store';
import { Navigate, useLocation } from 'react-router-dom';

export function LoginPage() {
  const isLoggedIn = userStore(state => state.isLoggedIn);
  const location = useLocation();

  if (isLoggedIn) return (
    <Navigate
      to="/"
      replace
      state={{ from: location }}
    />
  );

  const signInWithGoogle = () => {
    void signInWithPopup(auth, new GoogleAuthProvider());

    // signInWithEmailAndPassword(auth, 'radulescu.eduard.andrei+test@gmail.com', 'muieplm')
    //   .then((userCredential) => {
    //     // Signed in
    //     const user = userCredential.user;
    //     console.log(user);
    //     // ...
    //   })
    //   .catch((error) => {
    //     const errorCode = error.code;
    //     const errorMessage = error.message;
    //     console.log(error);
    //   });
  };

  return (
    <div className="w-full h-svh flex justify-center items-center bg-linear-to-r from-violet-500 to-fuchsia-500">
      <button className="p-4 bg-blue-500" onClick={signInWithGoogle}> Sign in with google popup</button>
    </div>
  );
}
