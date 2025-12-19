import { GoogleAuthProvider, signInWithRedirect, signInWithPopup } from 'firebase/auth';
import { firebaseApp, auth } from '../../../init-firebase-auth';
import { redirect } from 'react-router';
import { userStore } from '../../store/user.store';
import firebase from 'firebase/compat/app';

export function LoginPage() {
  const setUser = userStore(state => state.setUser);

  const signInWithGoogle = () => {
    console.log(firebaseApp);
    signInWithRedirect(auth, new GoogleAuthProvider()).then((user)=>{
      console.log(user);
    });

    // signInWithPopup(auth,  new GoogleAuthProvider()).then((userCredential) => {
    //   console.log(userCredential);
    //   setUser(userCredential.user as firebase.User);
    //   return redirect("/");
    // });
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <button className="p-4 bg-blue-500" onClick={signInWithGoogle}> Sign in with google</button>
    </div>
  );
}
