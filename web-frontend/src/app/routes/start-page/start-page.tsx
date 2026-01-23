import { Input } from '../../design/input';
import { Card } from '../../design/Card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../init-firebase-auth';
import { userStore } from '../../store/user.store';
import { useNavigate } from 'react-router-dom';

const startPageSchema = z.object({
  dateOfBirth: z.date('errors.date.invalid'),
  startingWeight: z.number({ message: 'errors.profile.empty' }).min(0, 'errors.profile.min'),
  height: z.number({ message: 'errors.profile.empty' }).min(0, 'errors.profile.min')
});

export type StartPageFormData = z.infer<typeof startPageSchema>;

export function StartPage({ onStart }: { onStart: () => void }) {
  const { t } = useTranslation();
  const user = userStore((state) => state.user);
  const navigate = useNavigate();

  const sendInitData = async (data: StartPageFormData) => {
    if (!user) {
      navigate('/auth/login', { replace: true });
      return;
    }

    try {
      await addDoc(collection(db, 'start'), {
        ...data,
        dateOfBirth: data.dateOfBirth.toISOString(),
        userId: user.uid,
        createdAt: serverTimestamp()
      });
      onStart()
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
    <form noValidate className="mx-4 flex flex-col h-svh justify-between" onSubmit={handleSubmit(data => sendInitData(data))}>
      <div>
        <Card className="my-4">
          <h1 className="text-2xl mb-2">Salut, bine ai venit la Fitlab!</h1>
          <p className="mb-4">Ca să incepem, ne trebuie doar câteva informații despre tine:</p>
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
      <button
        disabled={isSubmitting}
        className="mb-4 w-full hover:bg-amber-500 text-white pointer font-bold py-2 px-4 rounded-full mt-4 text-center bg-linear-to-r from-amber-300 to-red-900">
        Start
      </button>
    </form>
  );
}
