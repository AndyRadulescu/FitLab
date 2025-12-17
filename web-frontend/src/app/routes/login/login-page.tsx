import { getAuth, getRedirectResult, GoogleAuthProvider, signInWithRedirect, signInWithPopup } from 'firebase/auth';
import { firebaseApp } from '../../firebase';
import { userStore } from '../../store/user.store';
import firebase from 'firebase/compat/app';
import { redirect } from 'react-router';

export function LoginPage() {
  const setUser = userStore(state => state.setUser);

  const provider = new GoogleAuthProvider();
  const auth = getAuth(firebaseApp);
  const signInWithGoogle = () => {
    console.log(firebaseApp);
    signInWithPopup(auth, provider).then((userCredential) => {
      console.log(userCredential);
      setUser(userCredential.user as firebase.User);
      return redirect("/");
    });
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <button className="p-4 bg-blue-500" onClick={signInWithGoogle}> Sign in with google</button>
    </div>
  );
}
