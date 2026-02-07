import { Input } from '../../design/input';
import { Card } from '../../design/Card';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trans, useTranslation } from 'react-i18next';
import { userStore } from '../../store/user.store';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../../design/button';
import { checkinStore } from '../../store/checkin.store';
import { ImageUploader } from '../../design/image/image-uploader';
import { CheckInStrategyFactory } from './checkin-strategy/checkin-strategy';
import { collection, doc } from 'firebase/firestore';
import { db } from '../../../init-firebase-auth';
import { useRef } from 'react';

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
  dailySteps: z.number({ message: 'errors.profile.empty' }).min(1, 'errors.profile.min1'),
  imgUrls: z.array(z.string(), 'errors.image.invalid').min(3, 'errors.image.invalid').max(3)
});

export type CheckInFormData = z.infer<typeof checkinSchema>;

export function CheckInPage() {
  const { t } = useTranslation();
  const user = userStore((state) => state.user);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const checkinId = searchParams.get('checkinId');
  const checkinData = checkinStore((state) => state.checkins).find(checkin => checkin.id === checkinId);
  let newCheckinId: string | null = null;
  const newDocRef = useRef<string>(doc(collection(db, 'checkins')).id);
  if (!checkinId) {
    newCheckinId = newDocRef.current;
  }

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<CheckInFormData>({
    resolver: zodResolver(checkinSchema),
    defaultValues: checkinData
  });

  const sendCheckin = async (data: CheckInFormData) => {
    if (!user) {
      navigate('/auth/login', { replace: true });
      return;
    }
    try {
      const strategy = !checkinData ? 'add' : 'edit';
      const { imgUrls, ...dataWithNoImgUrls } = data;
      await CheckInStrategyFactory.getStrategy(strategy).checkIn({
        data: { ...dataWithNoImgUrls, id: checkinData?.id ?? newCheckinId ?? '' },
        userId: user.uid
      });
      navigate('/dashboard/', { replace: true });
    } catch (e) {
      console.log(e);
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
          <Input label={t('checkin.measures.leftThigh')}
                 type="number" {...register('leftThigh', { valueAsNumber: true })}
                 error={errors.leftThigh?.message && t(errors.leftThigh.message)}></Input>
          <Input label={t('checkin.measures.rightThigh')}
                 type="number" {...register('rightThigh', { valueAsNumber: true })}
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

        <div className="my-2">
          <Controller
            name="imgUrls"
            control={control}
            render={({ field: { onChange } }) => (
              <ImageUploader
                userId={user!.uid!}
                checkinId={checkinId ?? newCheckinId!}
                isEdit={!!checkinData}
                onChange={onChange}
                error={errors.imgUrls?.message}
              />
            )}
          />
        </div>

        <div className="mt-4">
          <Button disabled={isSubmitting} type="primary">
            {!checkinData ? 'Check-in' : <Trans i18nKey="checkin.save">Save</Trans>}
          </Button>
        </div>
      </form>
    </div>
  );
}
