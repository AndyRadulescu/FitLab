import { useEffect, useState } from 'react';
import { StartPageFormDataDto, userStore, Weight } from '../store/user.store';
import { CheckInFormDataDto, CheckInFormDataDtoFirebase, checkinStore } from '../store/checkin.store';
import { useNavigate } from 'react-router-dom';
import { getDocs } from 'firebase/firestore';
import { getCheckinQuery, getStartDataQuery, getWeightQuery } from '../firestore/queries';

export function useAppInitialization() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const userData = userStore((state) => state.userData);
  const setUserData = userStore(state => state.setUserData);
  const setWeights = userStore(state => state.setWeights);
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
      const snapshotUsers = await getDocs(getStartDataQuery(user));
      const initData = snapshotUsers.docs[0]?.data() as StartPageFormDataDto;

      if (!initData) {
        setIsLoading(false);
        return;
      }

      setUserData(initData);
      const snapshotCheckins = await getDocs(getCheckinQuery(user));
      const snapshotWeights = await getDocs(getWeightQuery(user));
      const checkinData: CheckInFormDataDtoFirebase[] = snapshotCheckins.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
        } as CheckInFormDataDtoFirebase;
      });

      const checkinMapped = checkinData.map(checkin => ({
        ...checkin,
        createdAt: checkin.createdAt.toDate(),
        updatedAt: checkin.updatedAt?.toDate()
      })) as CheckInFormDataDto[];
      setCheckin(checkinMapped);

      const weightMapped = snapshotWeights.docs.map((weight) => {
        return {
          id: weight.id,
          createdAt: weight.data().createdAt.toDate(),
          weight: weight.data().weight,
          updatedAt: weight.data().updatedAt?.toDate()
        } as Weight;
      });
      setWeights(weightMapped);
      setIsLoading(false);
    };

    void load();
  }, []);

  return { isLoading, hasInitData: !!userData };
}
