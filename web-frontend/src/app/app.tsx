import { useTranslation } from 'react-i18next';
import { Main } from './routes/main';
import { StartPage } from './routes/start-page/start-page';
import { getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { StartPageFormDataDto, userStore } from './store/user.store';
import { useNavigate } from 'react-router-dom';
import { CheckInFormDataDtoFirebase, checkinStore } from './store/checkin.store';
import { getCheckinQuery, getStartDataQuery } from './firestore/queries';

export function App() {
  const { t } = useTranslation(); // don't remove this; used to init i18n
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const initData = userStore((state) => state.initData);
  const setInitData = userStore(state => state.setInitData);
  const setCheckin = checkinStore(state => state.setCheckin);
  const user = userStore((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      if (!user) {
        navigate('/auth/login', { replace: true });
        return;
      }
      setIsLoading(true);

      const snapshotStart = await getDocs(getStartDataQuery(user));
      const snapshotCheckin = await getDocs(getCheckinQuery(user));
      const initData = snapshotStart.docs[0]?.data() as StartPageFormDataDto;
      const checkinData: CheckInFormDataDtoFirebase[] = snapshotCheckin.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          createdAt: data.createdAt.toDate(),
          ...data
        } as CheckInFormDataDtoFirebase;
      });
      const checkinMapped = checkinData.map(checkin => ({ ...checkin, createdAt: checkin.createdAt.toDate() }))
      if (!initData) {
        alert(t('errors.unknown'));
      }
      setInitData(initData);
      setCheckin(checkinMapped);
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
