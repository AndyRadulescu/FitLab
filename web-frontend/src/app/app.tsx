import { useTranslation } from 'react-i18next';
import { Main } from './routes/main';
import { StartPage } from './routes/start-page/start-page';
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { db } from '../init-firebase-auth';
import { useEffect, useState } from 'react';
import { StartPageFormDataDto, userStore } from './store/user.store';
import { useNavigate } from 'react-router-dom';

export function App() {
  const { t } = useTranslation(); // don't remove this; used to init i18n
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const initData = userStore((state) => state.initData);
  const setInitData = userStore(state => state.setInitData);
  const user = userStore((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      if (!user) {
        navigate('/auth/login', { replace: true });
        return;
      }
      setIsLoading(true);

      const q = query(
        collection(db, 'start'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc'),
        limit(1)
      );
      const snapshot = await getDocs(q);
      const initData = snapshot.docs[0]?.data() as StartPageFormDataDto;
      if (!initData) {
        alert(t('errors.unknown'));
      }
      setInitData(initData)
      setIsLoading(false);
    };

    void load();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!initData) {
    return <StartPage />;
  }
  return <Main />;
}

export default App;
