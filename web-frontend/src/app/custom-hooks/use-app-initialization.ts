import { useEffect, useState } from 'react';
import { StartPageFormDataDto, userStore, Weight } from '../store/user.store';
import { CheckInFormDataDto, checkinStore } from '../store/checkin.store';
import { useNavigate } from 'react-router-dom';
import { getDocs } from 'firebase/firestore';
import { getCheckinQuery, getStartDataQuery, getWeightQuery } from '../firestore/queries';
import { assertAuthenticated } from '../shared/user.guard';

export function useAppInitialization() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const userData = userStore((state) => state.userData);
  const setUserData = userStore(state => state.setUserData);
  const setWeights = userStore(state => state.setWeights);
  const setCheckin = checkinStore(state => state.setCheckin);
  const user = userStore((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const initialize = async () => {
      try {
        assertAuthenticated(navigate, user);
      } catch {
        return;
      }

      setIsLoading(true);
      try {
        const [snapshotUsers, snapshotCheckins, snapshotWeights] = await Promise.all([
          getDocs(getStartDataQuery(user)),
          getDocs(getCheckinQuery(user)),
          getDocs(getWeightQuery(user))
        ]);

        const initData = snapshotUsers.docs[0]?.data() as StartPageFormDataDto | undefined;
        if (!initData) {
          return;
        }
        setUserData(initData);
        const checkinData: CheckInFormDataDto[] = snapshotCheckins.docs.map((doc) => {
          const data = doc.data();
          return {
            ...data,
            id: doc.id,
            createdAt: data.createdAt.toDate(),
            updatedAt: data.updatedAt?.toDate()
          } as CheckInFormDataDto;
        });
        setCheckin(checkinData);
        const weightMapped = snapshotWeights.docs.map((weight) => {
          const data = weight.data();
          return {
            id: weight.id,
            createdAt: data.createdAt.toDate(),
            weight: data.weight,
            updatedAt: data.updatedAt?.toDate(),
            from: 'weight'
          } as Weight;
        });
        setWeights(weightMapped);
      } catch (error) {
        console.error('Failed to initialize application data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    void initialize();
  }, []);

  return { isLoading, hasInitData: !!userData };
}
