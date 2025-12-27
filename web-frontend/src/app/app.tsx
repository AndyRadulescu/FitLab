// Uncomment this line to use CSS modules
// import styles from './app.module.scss';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { userStore } from './store/user.store';


export function App() {
  const setUser = userStore(state => state.setUser);
  const navigate = useNavigate();

  const auth = getAuth();
  const logout = async () => {
    await auth.signOut();
    setUser(undefined);
    navigate('/login', { replace: true });
  };


  return (
    <>
      <p>noting to show yet</p>
      <button onClick={logout}>Log out</button>
    </>
  );
}

export default App;
