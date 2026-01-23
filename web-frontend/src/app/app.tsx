import { useTranslation } from 'react-i18next';
import { Main } from './routes/main';
import { StartPage, StartPageFormData } from './routes/start-page/start-page';
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { db } from '../init-firebase-auth';
import { useEffect, useState } from 'react';
import { userStore } from './store/user.store';
import { useNavigate } from 'react-router-dom';

export function App() {
  const { t } = useTranslation(); // don't remove this; used to init i18n
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [doc, setHasStartDoc] = useState<StartPageFormData | null>(null);
  const user = userStore((state) => state.user);
  const navigate = useNavigate();

  const startJourney = () => {
    setIsStarted(true);
  }

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
      console.log(snapshot);
      setHasStartDoc(snapshot.docs[0]?.data() as StartPageFormData | null ?? null);
      setIsLoading(false);
    };

    void load();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!doc && !isStarted) {
    return <StartPage onStart={startJourney} />;
  }
  return <Main />;
}

export default App;
