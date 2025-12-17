// Uncomment this line to use CSS modules
// import styles from './app.module.scss';
import { getAuth } from 'firebase/auth';
import { redirect } from 'react-router';
import { userStore } from './store/user.store';


export function App() {
  const setUser = userStore(state => state.setUser);

  const auth = getAuth();
  const logout = () => {
    void auth.signOut().then(() => {
      console.log('loggout');
      setUser(undefined);
      redirect('/login');
    });
  };

  return (
    <>
      <p>noting to show yet</p>
      <button onClick={logout}>Log out</button>
    </>
  );
}

export default App;
