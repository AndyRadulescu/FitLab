import { Input } from '../../components/design/input';
import { Card } from '../../components/design/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Trans, useTranslation } from 'react-i18next';
import { collection, doc, runTransaction, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../init-firebase-auth';
import { userStore } from '../../store/user.store';
import { useNavigate } from 'react-router-dom';
import { SectionHeader } from '../../components/section-header';
import { Button } from '../../components/design/button';
import { USERS_TABLE, WEIGHT_TABLE } from '../../firestore/queries';

const startPageSchema = z.object({
  dateOfBirth: z.date('errors.date.invalid'),
  weight: z.number({ message: 'errors.profile.empty' }).min(0, 'errors.profile.min'),
  height: z.number({ message: 'errors.profile.empty' }).min(0, 'errors.profile.min')
});

export type StartPageFormData = z.infer<typeof startPageSchema>;

export function StartPage() {
  const { t } = useTranslation();
  const user = userStore((state) => state.user);
  const setUserData = userStore(state => state.setUserData);
  const addWeight = userStore(state => state.addWeight);
  const navigate = useNavigate();

  const sendInitData = async (data: StartPageFormData) => {
    if (!user) {
      navigate('/auth/login', { replace: true });
      return;
    }
    const mappedData = {
      ...data,
      dateOfBirth: data.dateOfBirth.toISOString()
    };
    try {
      let weightId = null
      await runTransaction(db, async (transaction) => {
        const weightRef = doc(collection(db, WEIGHT_TABLE));
        weightId = weightRef.id
        const userRef = doc(collection(db, USERS_TABLE));

        transaction.set(weightRef, {
          userId: user.uid,
          createdAt: serverTimestamp(),
          weight: mappedData.weight
        });

        transaction.set(userRef, {
          ...mappedData,
          userId: user.uid,
          createdAt: serverTimestamp()
        });
      });
      if(!weightId) return
      addWeight({ id: weightId, weight: mappedData.weight, createdAt: new Date() });
      setUserData(mappedData);
      navigate('/dashboard/', { replace: true });
    } catch (e) {
      alert('something went wrong');
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<StartPageFormData>({
    resolver: zodResolver(startPageSchema)
  });

  return (
    <form noValidate className="mx-4 py-8 flex flex-col h-svh justify-between"
          onSubmit={handleSubmit(data => sendInitData(data))}>
      <div>
        <SectionHeader><Trans i18nKey="start.title" /></SectionHeader>
        <p className="mb-4"><Trans i18nKey="start.description" /></p>
        <Card className="my-4">
          <Input
            label={t('start.dateOfBirth')}
            type="date"
            {...register('dateOfBirth', { valueAsDate: true })}
            error={errors.dateOfBirth?.message && t(errors.dateOfBirth.message)} />

          <Input
            label={t('start.startingWeight')}
            type="number"
            min="0"
            {...register('weight', { valueAsNumber: true })}
            error={errors.weight?.message && t(errors.weight.message)} />

          <Input
            label={t('start.height')}
            type="number"
            min="0"
            {...register('height', { valueAsNumber: true })}
            error={errors.height?.message && t(errors.height.message)} />
        </Card>
      </div>
      <Button type="primary" disabled={isSubmitting}>
        Start
      </Button>
    </form>
  );
}
