import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Resolver, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userStore, Weight } from '../../../store/user.store';
import { checkinStore } from '../../../store/checkin.store';
import { WeightStrategyFactory } from '../../../core/weight-strategy/weight-strategy';
import { getTodayWeight, transformCheckinsToWeights } from '../utils';
import { WeightFormData, weightSchema } from '../types';

export function useWeightInputForm() {
  const { t } = useTranslation();
  const { weights, user } = userStore();
  const { checkins } = checkinStore();
  const [todayWeight, setTodayWeight] = useState<Weight | undefined>(undefined);
  const [isEditable, setIsEditable] = useState(false);

  const formMethods = useForm<WeightFormData>({
    resolver: zodResolver(weightSchema) as Resolver<WeightFormData>,
    defaultValues: { weight: 0 }
  });

  const { setValue } = formMethods;

  useEffect(() => {
    const foundWeight = getTodayWeight([...weights, ...transformCheckinsToWeights(checkins)]);
    setTodayWeight(foundWeight);
    setIsEditable(!foundWeight);
    if (foundWeight) {
      setValue('weight', foundWeight.weight);
    }
  }, [weights, checkins, setValue]);

  const handleSave = async (data: WeightFormData) => {
    if (!user) return;
    if (todayWeight) {
      const weight: Weight = { ...todayWeight, weight: data.weight };
      await WeightStrategyFactory.getStrategy('edit').weight(weight, user.uid, t);
    } else {
      await WeightStrategyFactory.getStrategy('add').weight(data, user.uid, t);
    }
    setIsEditable(false);
  };

  return {
    formMethods,
    handleSave,
    isEditable,
    setIsEditable,
    todayWeight,
    t
  };
}
