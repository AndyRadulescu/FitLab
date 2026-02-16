import { Input } from '../../components/design/input';
import { Card } from '../../components/design/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Trans, useTranslation } from 'react-i18next';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../init-firebase-auth';
import { userStore } from '../../store/user.store';
import { useNavigate } from 'react-router-dom';
import { SectionHeader } from '../../components/section-header';
import { Button } from '../../components/design/button';

const startPageSchema = z.object({
  dateOfBirth: z.date('errors.date.invalid'),
  startingWeight: z.number({ message: 'errors.profile.empty' }).min(0, 'errors.profile.min'),
  height: z.number({ message: 'errors.profile.empty' }).min(0, 'errors.profile.min')
});

export type StartPageFormData = z.infer<typeof startPageSchema>;

export function StartPage() {
  const { t } = useTranslation();
  const user = userStore((state) => state.user);
  const setInitData = userStore(state => state.setUserData);
  const navigate = useNavigate();

  const sendInitData = async (data: StartPageFormData) => {
    if (!user) {
      navigate('/auth/login', { replace: true });
      return;
    }
    const mappedData = {
      ...data,
      dateOfBirth: data.dateOfBirth.toISOString(),
    };
    try {
      await addDoc(collection(db, 'start'), {
        ...mappedData,
        userId: user.uid,
        createdAt: serverTimestamp()
      });
      setInitData(mappedData);
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
        <SectionHeader><Trans i18nKey="start.title"/></SectionHeader>
        <p className="mb-4"><Trans i18nKey="start.description"/></p>
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
            {...register('startingWeight', { valueAsNumber: true })}
            error={errors.startingWeight?.message && t(errors.startingWeight.message)} />

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
