// Uncomment this line to use CSS modules
import { Outlet, useNavigate } from 'react-router-dom';
import { userStore } from './store/user.store';
import { auth } from '../init-firebase-auth';
import { Trans, useTranslation } from 'react-i18next';

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
    <div className="h-svh flex justify-center items-center">
      <Outlet />
      {/*<div>*/}
      {/*  <button onClick={() => i18n.changeLanguage('en')}>EN</button>*/}
      {/*  <button onClick={() => i18n.changeLanguage('ro')}>RO</button>*/}
      {/*</div>*/}
      <p><Trans i18nKey="dashboard.nothingYet">Noting to show yet</Trans></p>
      <button onClick={logout}>Log out</button>

      <div className="fixed bottom-2 left-0 w-full px-2">
        <div className="flex justify-evenly items-center h-[60px] bg-gray-800 rounded-full">
          <span className="material-icons text-5xl text-white">send</span>
          <span className="material-icons text-5xl bg-amber-600 text-white rounded-full p-2">add</span>
          <span className="material-icons text-5xl text-white">manage_accounts</span>
        </div>
      </div>

    </div>
  );
}

export default App;
