import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Resolver, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userStore, Weight } from '../../../store/user.store';
import { WeightStrategyFactory } from '../../../core/weight-strategy/weight-strategy';
import { getTodayWeight } from '../utils';
import { WeightFormData, weightSchema } from '../types';

export function useWeightInputForm() {
  const { t } = useTranslation();
  const { weights, user } = userStore();
  const [todayWeight, setTodayWeight] = useState<Weight | undefined>(undefined);
  const [isEditable, setIsEditable] = useState(false);

  const formMethods = useForm<WeightFormData>({
    resolver: zodResolver(weightSchema) as Resolver<WeightFormData>,
    defaultValues: { weight: 0 }
  });

  const { setValue } = formMethods;

  useEffect(() => {
    const foundWeight = getTodayWeight(weights);
    setTodayWeight(foundWeight);
    setIsEditable(!foundWeight);
    if (foundWeight) {
      setValue('weight', foundWeight.weight);
    }
  }, [weights, setValue]);

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
