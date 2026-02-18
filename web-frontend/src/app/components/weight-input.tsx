import { useTranslation } from 'react-i18next';
import { Button } from './design/button';
import { Card } from './design/card';
import { useEffect, useState } from 'react';
import { userStore, Weight } from '../store/user.store';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { Input } from '../components/design/input';
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../../init-firebase-auth';
import { WEIGHT_TABLE } from '../firestore/queries';

const weightSchema = z.object({
  weight: z.coerce.number({ message: 'errors.profile.empty' }).min(0, 'errors.profile.min')
});

export type WeightFormData = z.infer<typeof weightSchema>;

const getTodayWeight = (weights: Weight[]): Weight | undefined => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return weights.find(w => w.createdAt >= today);
};

export function WeightInput() {
  const { t } = useTranslation();
  const { weights, addWeight, updateWeight, user } = userStore();
  const [todayWeight, setTodayWeight] = useState<Weight | undefined>(undefined);
  const [isEditable, setIsEditable] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<WeightFormData>({
    resolver: zodResolver(weightSchema)
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
      // Update
      const weightRef = doc(db, WEIGHT_TABLE, todayWeight.id);
      await updateDoc(weightRef, {
        weight: data.weight,
        updatedAt: serverTimestamp()
      });
      updateWeight({ ...todayWeight, weight: data.weight, updatedAt: new Date() });
    } else {
      // Add
      const docRef = await addDoc(collection(db, WEIGHT_TABLE), {
        userId: user.uid,
        weight: data.weight,
        createdAt: serverTimestamp()
      });
      addWeight({ id: docRef.id, weight: data.weight, createdAt: new Date() });
    }
    setIsEditable(false);
  };

  if (!isEditable) {
    return (
      <Card>
        <div
          className="flex flex-col md:flex-row gap-4 aling-center justify-center w-full">
          <div className="flex-2">
            <h3 className="text-xl">{t('dashboard.weight.title')}</h3>
            <p className="text-md">{t('dashboard.weight.value', { weight: todayWeight?.weight })}</p>
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
