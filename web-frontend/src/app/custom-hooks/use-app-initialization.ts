import { useEffect, useState } from 'react';
import { StartPageFormDataDto, userStore } from '../store/user.store';
import { CheckInFormDataDto, CheckInFormDataDtoFirebase, checkinStore } from '../store/checkin.store';
import { useNavigate } from 'react-router-dom';
import { getDocs } from 'firebase/firestore';
import { getCheckinQuery, getStartDataQuery } from '../firestore/queries';
import { useTranslation } from 'react-i18next';

export function useAppInitialization() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const initData = userStore((state) => state.userData);
  const setUserData = userStore(state => state.setUserData);
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
      const checkinMapped = checkinData.map(checkin => ({
        ...checkin,
        createdAt: checkin.createdAt.toDate(),
        updatedAt: checkin.updatedAt.toDate()
      })) as CheckInFormDataDto[];
      if (!initData) {
        setUserData(initData);
        setIsLoading(false);
        return;
      }
      setCheckin(checkinMapped);
      setIsLoading(false);
    };

    void load();
  }, []);

  return { isLoading, hasInitData: !!initData };
}
