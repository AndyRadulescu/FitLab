// Uncomment this line to use CSS modules
// import styles from './app.module.scss';
import { useNavigate } from 'react-router-dom';
import { userStore } from './store/user.store';
import { auth } from '../init-firebase-auth';
import { useTranslation } from 'react-i18next';

export function App() {
  const setUser = userStore(state => state.setUser);
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const logout = async () => {
    await auth.signOut();
    setUser(undefined);
    navigate('/auth/login', { replace: true });
  };

  return (
    <>
      <div>
        <button onClick={() => i18n.changeLanguage("en")}>EN</button>
        <button onClick={() => i18n.changeLanguage("ro")}>RO</button>
      </div>
      <p>noting to show yet</p>
      <button onClick={logout}>Log out</button>
    </>
  );
}

export default App;
