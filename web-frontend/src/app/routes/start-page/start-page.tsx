import { Input } from '../../design/input';
import { Card } from '../../design/Card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';

const startPageSchema = z.object({
  dateOfBirth: z.date('errors.date.invalid'),
  startingWeight: z.number({ message: 'errors.profile.empty' }).min(0, 'errors.profile.min'),
  height: z.number({ message: 'errors.profile.empty' }).min(0, 'errors.profile.min')
});

type StartPageFormData = z.infer<typeof startPageSchema>;

export function StartPage() {
  const { t } = useTranslation();
  const sendInitData = (data: StartPageFormData) => {
    console.log(data);
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<StartPageFormData>({
    resolver: zodResolver(startPageSchema)
  });


  return (
    <form noValidate className="mt-4" onSubmit={handleSubmit(data => sendInitData(data))}>
      <Card className="mb-4">
        <h1>Salut, bine ai venit la Fitlab!</h1>
        <p>Ca să incepem, ne trebuie doar câteva informații despre tine:</p>
      </Card>
      <Card>
        <Input
          placeholder={t('auth.email', 'Email')}
          type="date"
          {...register('dateOfBirth')}
          error={errors.dateOfBirth?.message && t(errors.dateOfBirth.message)} />

        <Input
          placeholder={t('auth.email', 'Email')}
          type="number"
          min="0"
          {...register('startingWeight')}
          error={errors.startingWeight?.message && t(errors.startingWeight.message)} />

        <Input
          placeholder={t('auth.email', 'Email')}
          type="number"
          min="0"
          {...register('height')}
          error={errors.height?.message && t(errors.height.message)} />
      </Card>
      <button
        disabled={isSubmitting}
        className="w-full hover:bg-amber-500 text-white pointer font-bold py-2 px-4 rounded-full mt-4 text-center bg-linear-to-r from-amber-300 to-red-900">
        Send
      </button>
    </form>
  );
}
