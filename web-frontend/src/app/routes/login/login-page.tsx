import { getAuth, GoogleAuthProvider, onAuthStateChanged, getRedirectResult, signInWithRedirect } from 'firebase/auth';
import { firebaseApp } from '../../firebase';
import { userStore } from '../../store/user.store';
import { redirect } from 'react-router';

export function LoginPage() {
  const updateIsLoggedIn = userStore(state => state.setIsLoggedIn);

  const provider = new GoogleAuthProvider();
  const auth = getAuth(firebaseApp);
  const signInWithGoogle = () => {
    console.log(firebaseApp);
    signInWithRedirect(auth, provider).then((token) => {
      console.log(token);
    });
  };

  getRedirectResult(auth)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access Google APIs.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;

      // The signed-in user info.
      const user = result.user;
      // IdP data available using getAdditionalUserInfo(result)
      // ...
    }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });

  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log(user);
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      const uid = user.uid;
      console.log(user);
      updateIsLoggedIn(true);
      redirect('/')
      // ...
    } else {
      console.log('logged out');
      updateIsLoggedIn(false);
      // User is signed out
      // ...
    }
  });

  return (
    <div className="w-full h-full flex justify-center items-center">
      <button className="p-4 bg-blue-500" onClick={signInWithGoogle}> Sign in with google</button>
    </div>
  );
}
