// Uncomment this line to use CSS modules
// import styles from './app.module.scss';
import { useNavigate } from 'react-router-dom';
import { userStore } from './store/user.store';
import { auth } from '../init-firebase-auth';

export function App() {
  const setUser = userStore(state => state.setUser);
  const navigate = useNavigate();

  const logout = async () => {
    await auth.signOut();
    setUser(undefined);
    navigate('/auth/login', { replace: true });
  };

  return (
    <>
      <p>noting to show yet</p>
      <button onClick={logout}>Log out</button>
    </>
  );
}

export default App;
