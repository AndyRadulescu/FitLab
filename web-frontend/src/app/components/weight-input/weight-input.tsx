import { useTranslation } from 'react-i18next';
import { Button } from '../design/button';
import { Card } from '../design/card';
import { useEffect, useState } from 'react';
import { userStore, Weight } from '../../store/user.store';
import { z } from 'zod';
import { Resolver, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { Input } from '../design/input';
import { WeightStrategyFactory } from '../../core/weight-strategy/weight-strategy';
import { getTodayWeight } from './utils';

const weightSchema = z.object({
  weight: z.coerce.number({ message: 'errors.profile.empty' }).min(0, 'errors.profile.min')
});

export type WeightFormData = z.infer<typeof weightSchema>;

export function WeightInput() {
  const { t } = useTranslation();
  const { weights, user } = userStore();
  const [todayWeight, setTodayWeight] = useState<Weight | undefined>(undefined);
  const [isEditable, setIsEditable] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<WeightFormData>({
    resolver: zodResolver(weightSchema) as Resolver<WeightFormData>,
    defaultValues: { weight: 0 }
  });

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

  if (!isEditable) {
    return (
      <Card>
        <div
          className="flex aling-center justify-between w-full">
          <div className="flex items-center">
            <p className="text-md">{t('dashboard.weight.value', { weight: todayWeight?.weight })}</p>
          </div>
          <div onClick={() => setIsEditable(true)}>
            <Button type="tertiary">{t('common.edit')}</Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <form onSubmit={handleSubmit((data) => handleSave(data))}
            className="relative flex flex-col md:flex-row gap-4 aling-center justify-center w-full">
        <div className="absolute top-0 right-0 z-10" onClick={() => setIsEditable(false)}>
          <X size={18} />
        </div>
        <div className="flex-2">
          <Input label={t('dashboard.weight.placeholder')} type="number"
                 min="0" {...register('weight', { valueAsNumber: true })}
                 error={errors.weight?.message && t(errors.weight.message)}></Input>
        </div>
        <div className="flex-1 flex justify-center items-center">
          <Button type="primary">{t('common.save')}</Button>
        </div>
      </form>
    </Card>
  );
}
