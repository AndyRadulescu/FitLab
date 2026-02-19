import { Controller, UseFormReturn } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { SectionHeader } from '../../../components/section-header';
import { Card } from '../../../components/design/card';
import { Input } from '../../../components/design/input';
import { FormSlider } from '../../../components/custom-slider/form-slider';
import { ImageUploader } from '../../../components/image/image-uploader';
import { Button } from '../../../components/design/button';
import { CheckInFormData } from '../types';
import firebase from 'firebase/compat/app';

interface CheckInFormProps {
  formMethods: UseFormReturn<CheckInFormData>;
  onSubmit: (data: CheckInFormData) => Promise<void>;
  user: firebase.User | null;
  activeCheckinId: string | null;
  isEdit: boolean;
}

export function CheckInForm({ formMethods, onSubmit, user, activeCheckinId, isEdit }: CheckInFormProps) {
  const { t } = useTranslation();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = formMethods;

  return (
    <form noValidate className="mt-4" onSubmit={handleSubmit(onSubmit)}>
      <SectionHeader><Trans i18nKey="checkin.measurements">Measurements</Trans></SectionHeader>
      <Card className="mb-4">
        <Input label={t('checkin.measures.kg')} type="number" min="0" {...register('kg', { valueAsNumber: true })}
               error={errors.kg?.message && t(errors.kg.message)}></Input>
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

      <SectionHeader><Trans i18nKey="checkin.lifestyle">Lifestyle check:</Trans></SectionHeader>
      <Card className="mb-4">
        <FormSlider
          name="hoursSlept" control={control} label={t('checkin.sleep')} min={0} max={12} step={0.5}
          error={errors.hoursSlept?.message ? t(errors.hoursSlept.message) : undefined}
        />

        <FormSlider
          name="planAccuracy" control={control} label={t('checkin.plan')} min={1} max={10} step={1}
          error={errors.planAccuracy?.message ? t(errors.planAccuracy.message) : undefined}
        />

        <FormSlider
          name="energyLevel" control={control} label={t('checkin.energy')} min={1} max={10} step={1}
          error={errors.energyLevel?.message ? t(errors.energyLevel.message) : undefined}
        />

        <FormSlider
          name="moodCheck" control={control} label={t('checkin.mood')} min={1} max={10} step={1}
          error={errors.moodCheck?.message ? t(errors.moodCheck.message) : undefined}
        />

        <Input label={t('checkin.steps')} type="number"
               min="0" {...register('dailySteps', { valueAsNumber: true })}
               error={errors.dailySteps?.message && t(errors.dailySteps.message)}></Input>
      </Card>

      <SectionHeader><Trans i18nKey="section.requiredPhotos">Required Photos</Trans></SectionHeader>
      <div className="my-2">
        <Controller
          name="imgUrls"
          control={control}
          render={({ field: { onChange } }) => (
            <ImageUploader
              userId={user!.uid!}
              checkinId={activeCheckinId!}
              isEdit={isEdit}
              onChange={onChange}
              error={errors.imgUrls?.message}
            />
          )}
        />
      </div>

      <div className="mt-4">
        <Button disabled={isSubmitting} type="primary">
          {!isEdit ? 'Check-in' : <Trans i18nKey="checkin.save">Save</Trans>}
        </Button>
      </div>
    </form>
  );
}
