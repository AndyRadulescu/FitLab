import { Resolver, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userStore } from '../../../store/user.store';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { checkinStore } from '../../../store/checkin.store';
import { collection, doc } from 'firebase/firestore';
import { db } from '../../../../init-firebase-auth';
import { useMemo, useRef } from 'react';
import { CheckInStrategyFactory } from '../../../core/checkin-strategy/checkin-strategy';
import { CheckInFormData, checkinSchema } from '../types';

const isToday = (date: Date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

export function useCheckInForm() {
  const user = userStore((state) => state.user);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const checkinId = searchParams.get('checkinId');
  const checkins = checkinStore((state) => state.checkins);

  const todayCheckin = useMemo(() => checkins.find(c => isToday(c.createdAt)), [checkins]);

  const checkinData = useMemo(() => {
    if (checkinId) {
      return checkins.find(checkin => checkin.id === checkinId);
    }
    return todayCheckin;
  }, [checkinId, checkins, todayCheckin]);

  const isEditingToday = !checkinId && !!todayCheckin;

  const newDocRef = useRef<string>(doc(collection(db, 'checkins')).id);
  const newCheckinId = (!checkinId && !todayCheckin) ? newDocRef.current : null;
  const activeCheckinId = checkinData?.id ?? newCheckinId;

  const formMethods = useForm<CheckInFormData>({
    resolver: zodResolver(checkinSchema) as Resolver<CheckInFormData>,
    defaultValues: checkinData as any
  });

  const onSubmit = async (data: CheckInFormData) => {
    if (!user) {
      navigate('/auth/login', { replace: true });
      return;
    }
    try {
      const strategy = !checkinData || !checkinData.id ? 'add' : 'edit';
      const { imgUrls, ...dataWithNoImgUrls } = data;
      await CheckInStrategyFactory.getStrategy(strategy).checkIn({
        data: { ...dataWithNoImgUrls, id: activeCheckinId ?? '' },
        userId: user.uid
      });
      navigate('/dashboard/', { replace: true });
    } catch (e) {
      console.log(e);
      alert('something went wrong');
    }
  };

  return {
    formMethods,
    onSubmit,
    isEditingToday,
    checkinData,
    activeCheckinId,
    user
  };
}
