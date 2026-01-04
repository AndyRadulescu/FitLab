import { auth } from '../../../init-firebase-auth';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Link } from 'react-router-dom';

export function LoginPage() {
  const onSignInWithEmailAndPassword = () => {
    void signInWithEmailAndPassword(auth, 'radulescu.eduard.andrei+test@gmail.com', 'muieplm');
    // .then((userCredential) => {
    //   // Signed in
    //   const user = userCredential.user;
    //   console.log(user);
    //   // ...
    // })
    // .catch((error) => {
    //   const errorCode = error.code;
    //   const errorMessage = error.message;
    //   console.log(error);
    // });
  };

  return (
    <div className="mb-6 px-4">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="email" type="email" placeholder="john@doe.com" />
      </div>
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="password" type="password" />
      </div>
      <button
        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-4 text-center bg-linear-to-r from-violet-500 to-fuchsia-500"
        onClick={onSignInWithEmailAndPassword}>
        Login
      </button>
      <div className="w-full justify-center flex">
        <Link to={'/auth/register'}>Register</Link>
      </div>
    </div>
  );
}
