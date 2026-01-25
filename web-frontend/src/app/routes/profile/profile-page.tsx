import { useNavigate } from 'react-router-dom';
import { userStore } from '../../store/user.store';
import { auth } from '../../../init-firebase-auth';
import { Trans, useTranslation } from 'react-i18next';
import { Card } from '../../design/Card';

export function ProfilePage() {
  const { i18n } = useTranslation();
  const setUser = userStore(state => state.setUser);
  const navigate = useNavigate();

  const logout = async () => {
    await auth.signOut();
    setUser(undefined);
    navigate('/auth/login', { replace: true });
  };

  return (
    <div>
      <Card>
        <div className="flex justify-center w-full mb-4">
          <div className="text-center">
            <p><Trans i18nKey="profile.change.language">Change language</Trans></p>
            <select value={i18n.language} onChange={(e) => i18n.changeLanguage(e.target.value)}>
              <option value="en">🇺🇸 English</option>
              <option value="ro">🇷🇴 Română</option>
            </select>
          </div>
        </div>
        <button type="button"
                onClick={logout}
                className="w-full bg-gray-200 dark:bg-gray-600 box-border border border-transparent font-medium leading-5 rounded-full text-sm px-4 py-2.5 text-center inline-flex items-center justify-center dark:focus:ring-[#3b5998]/55">
          <span className="material-icons">logout</span>
          <Trans i18nKey="auth.signout">Log out</Trans>
        </button>
      </Card>
    </div>
  );
}
