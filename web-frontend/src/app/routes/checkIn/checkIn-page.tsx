import { Input } from '../../design/input';
import { Card } from '../../design/Card';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { addDoc, collection, serverTimestamp, doc } from 'firebase/firestore';
import { db } from '../../../init-firebase-auth';
import { userStore } from '../../store/user.store';
import { useNavigate } from 'react-router-dom';
import { checkinStore } from '../../store/checkin.store';

const checkinSchema = z.object({
  kg: z.coerce.number({ message: 'errors.profile.empty' }).min(0, 'errors.profile.min'),
  breastSize: z.number({ message: 'errors.profile.empty' }).min(0, 'errors.profile.min'),
  waistSize: z.number({ message: 'errors.profile.empty' }).min(0, 'errors.profile.min'),
  hipSize: z.number({ message: 'errors.profile.empty' }).min(0, 'errors.profile.min'),
  buttSize: z.number({ message: 'errors.profile.empty' }).min(0, 'errors.profile.min'),
  leftThigh: z.number({ message: 'errors.profile.empty' }).min(0, 'errors.profile.min'),
  rightThigh: z.number({ message: 'errors.profile.empty' }).min(0, 'errors.profile.min'),
  leftArm: z.number({ message: 'errors.profile.empty' }).min(0, 'errors.profile.min'),
  rightArm: z.number({ message: 'errors.profile.empty' }).min(0, 'errors.profile.min'),
  hoursSlept: z.number({ message: 'errors.profile.empty' }).min(0, 'errors.profile.min').max(12, 'errors.profile.maxHour'),
  planAccuracy: z.number({ message: 'errors.profile.empty' }).min(1, 'errors.profile.min1').max(10, 'errors.profile.max10'),
  energyLevel: z.number({ message: 'errors.profile.empty' }).min(1, 'errors.profile.min1').max(10, 'errors.profile.max10'),
  moodCheck: z.number({ message: 'errors.profile.empty' }).min(1, 'errors.profile.min1').max(10, 'errors.profile.max10'),
  dailySteps: z.number({ message: 'errors.profile.empty' }).min(1, 'errors.profile.min1')
});

export type CheckInFormData = z.infer<typeof checkinSchema>;

export function CheckInPage() {
  const { t } = useTranslation();
  const user = userStore((state) => state.user);
  const addCheckin = checkinStore((state) => state.addCheckin);
  const navigate = useNavigate();
  const ref = doc(collection(db, 'checkin')); // 👈 ID generated here

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<CheckInFormData>({
    resolver: zodResolver(checkinSchema)
  });

  const sendCheckin = async (data: CheckInFormData) => {
    if (!user) {
      navigate('/auth/login', { replace: true });
      return;
    }
    try {
      const mappedData = {...data, createdAt: new Date(), id: ref.id}
      await addDoc(collection(db, 'checkins'), {
        ...mappedData,
        userId: user.uid,
        createdAt: serverTimestamp()
      });
      addCheckin(mappedData)
      navigate('/dashboard/', { replace: true });
    } catch (e) {
      alert('something went wrong');
    }
  };

  return (
    <div>
      <h1 className="text-center text-2xl mb-4">Check-in</h1>
      <form noValidate className="mt-4" onSubmit={handleSubmit(data => sendCheckin(data))}>
        <Card className="mb-2">
          <Input label={t('checkin.measures.kg')} type="number" min="0" {...register('kg', { valueAsNumber: true })}
                 error={errors.kg?.message && t(errors.kg.message)}></Input>
        </Card>
        <Card className="mb-2">
          <Input label={t('checkin.measures.breast')} type="number" {...register('breastSize', { valueAsNumber: true })}
                 error={errors.breastSize?.message && t(errors.breastSize.message)}></Input>
          <Input label={t('checkin.measures.waist')} type="number" {...register('waistSize', { valueAsNumber: true })}
                 error={errors.waistSize?.message && t(errors.waistSize.message)}></Input>
          <Input label={t('checkin.measures.hips')} type="number" {...register('hipSize', { valueAsNumber: true })}
                 error={errors.hipSize?.message && t(errors.hipSize.message)}></Input>
          <Input label={t('checkin.measures.butt')} type="number" {...register('buttSize', { valueAsNumber: true })}
                 error={errors.buttSize?.message && t(errors.buttSize.message)}></Input>
          <Input label={t('checkin.measures.leftThigh')} type="number" {...register('leftThigh', { valueAsNumber: true })}
                 error={errors.leftThigh?.message && t(errors.leftThigh.message)}></Input>
          <Input label={t('checkin.measures.rightThigh')} type="number" {...register('rightThigh', { valueAsNumber: true })}
                 error={errors.rightThigh?.message && t(errors.rightThigh.message)}></Input>
          <Input label={t('checkin.measures.leftArm')} type="number" {...register('leftArm', { valueAsNumber: true })}
                 error={errors.leftArm?.message && t(errors.leftArm.message)}></Input>
          <Input label={t('checkin.measures.rightArm')} type="number" {...register('rightArm', { valueAsNumber: true })}
                 error={errors.rightArm?.message && t(errors.rightArm.message)}></Input>
        </Card>

        <Card>
          <Input label={t('checkin.sleep')} type="number" min="0"
                 max="12" {...register('hoursSlept', { valueAsNumber: true })}
                 error={errors.hoursSlept?.message && t(errors.hoursSlept.message)}></Input>
          <Input label={t('checkin.plan')} type="number" min="1"
                 max="10" {...register('planAccuracy', { valueAsNumber: true })}
                 error={errors.planAccuracy?.message && t(errors.planAccuracy.message)}></Input>
          <Input label={t('checkin.energy')} type="number" min="1"
                 max="10" {...register('energyLevel', { valueAsNumber: true })}
                 error={errors.energyLevel?.message && t(errors.energyLevel.message)}></Input>
          <Input label={t('checkin.mood')} type="number" min="1"
                 max="10" {...register('moodCheck', { valueAsNumber: true })}
                 error={errors.moodCheck?.message && t(errors.moodCheck.message)}></Input>
          <Input label={t('checkin.steps')} type="number"
                 min="0" {...register('dailySteps', { valueAsNumber: true })}
                 error={errors.dailySteps?.message && t(errors.dailySteps.message)}></Input>
        </Card>
        <button
          disabled={isSubmitting}
          className="w-full hover:bg-amber-500 text-white pointer font-bold py-2 px-4 rounded-full mt-4 text-center bg-linear-to-r from-amber-300 to-red-900">
          Check-in
        </button>
      </form>
    </div>
  );
}
