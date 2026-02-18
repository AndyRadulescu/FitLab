import { useTranslation } from 'react-i18next';
import { Button } from './design/button';
import { Card } from './design/card';
import { useEffect, useState } from 'react';
import { useWeightStore } from '../store/weight.store';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {X} from 'lucide-react';
import { Input } from '@web-frontend/app/components/design/input';

const weightSchema = z.object({
  weight: z.coerce.number({ message: 'errors.profile.empty' }).min(0, 'errors.profile.min')
});

export type WeightFormData = z.infer<typeof weightSchema>;

export function WeightInput() {
  const { t } = useTranslation();
  const { weight, isUpdatedToday, fetchWeight, saveWeight } = useWeightStore();
  const [currentWeight, setCurrentWeight] = useState(weight?.toString() || '');
  const [isEditable, setIsEditable] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<WeightFormData>({
    resolver: zodResolver(weightSchema),
    defaultValues: { weight: currentWeight }
  });

  useEffect(() => {
    fetchWeight();
  }, [fetchWeight]);

  useEffect(() => {
    if (weight) {
      setCurrentWeight(weight.toString());
    }
    setIsEditable(!isUpdatedToday);
  }, [weight, isUpdatedToday]);

  const handleSave = (data: WeightFormData) => {
    const newWeight = parseFloat(currentWeight);
    if (!isNaN(newWeight)) {
      saveWeight(newWeight);
    }
  };

  if (!isEditable) {
    return (
      <Card>
        <div
          className="flex flex-col md:flex-row gap-4 aling-center justify-center w-full">
          <div className="flex-2">
            <h3 className="text-xl">{t('dashboard.weight.title')}</h3>
            <p className="text-md">{t('dashboard.weight.value', { weight: currentWeight })}</p>
          </div>
          <div className="flex-1 flex justify-center items-center">
            <div onClick={() => setIsEditable(true)}>
              <Button type="tertiary">{t('common.edit')}</Button>
            </div>
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
          <X size={18}/>
        </div>
        <div className="flex-2">
          <h3 className="text-xl">{t('dashboard.weight.title')}</h3>
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
