import { Resolver, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userStore } from '../../../store/user.store';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { checkinStore } from '../../../store/checkin.store';
import { collection, doc } from 'firebase/firestore';
import { db } from '../../../../init-firebase-auth';
import { useMemo, useRef } from 'react';
import { CheckInStrategyFactory } from '../../../core/checkin-strategy/checkin-strategy';
import { assertAuthenticated } from '../../../shared/user.guard';
import { CheckInFormData, CheckInFormDataDto, checkinSchema } from '@my-org/core';

const isToday = (date: Date) => {
  const today = new Date();
  const d = new Date(date);
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
};

export function useCheckInForm() {
  const user = userStore((state) => state.user);
  const weights = userStore((state) => state.weights);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const checkinId = searchParams.get('checkinId');
  const checkins = checkinStore((state) => state.checkins);

  const todayCheckin = useMemo(() => checkins.find(c => isToday(c.createdAt)), [checkins]);
  const todayWeight = useMemo(() => weights.find(w => isToday(w.createdAt)), [weights]);

  const checkinData = useMemo<(Partial<CheckInFormDataDto> & { kg?: number }) | null>(() => {
    const baseCheckin = checkinId
      ? checkins.find(checkin => checkin.id === checkinId)
      : todayCheckin;

    if (baseCheckin) {
      const weight = weights.find(w => w.id === baseCheckin.weightId);
      return { ...baseCheckin, kg: weight?.weight };
    }

    if (!checkinId && todayWeight) {
      return { kg: todayWeight.weight };
    }

    return null;
  }, [checkinId, checkins, todayCheckin, weights, todayWeight]);

  const isEditingToday = !checkinId && !!todayCheckin;

  const newDocRef = useRef<string>(doc(collection(db, 'checkins')).id).current;
  const activeCheckinId = checkinData?.id ?? newDocRef;

  const formMethods = useForm<CheckInFormData>({
    resolver: zodResolver(checkinSchema) as Resolver<CheckInFormData>,
    defaultValues: checkinData as any
  });

  const onSubmit = async (data: CheckInFormData) => {
    assertAuthenticated(navigate, user);
    try {
      const strategy = !checkinData || !checkinData.id ? 'add' : 'edit';
      const { imgUrls, ...dataWithNoImgUrls } = data;

      // Determine weightId: either from existing checkin, or from today's weight if starting a new checkin
      const weightId = checkinData?.weightId || (!checkinData?.id ? todayWeight?.id : undefined);

      await CheckInStrategyFactory.getStrategy(strategy).checkIn({
        data: { ...dataWithNoImgUrls, id: activeCheckinId, weightId },
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
