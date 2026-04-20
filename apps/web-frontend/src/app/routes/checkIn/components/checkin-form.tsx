import { Controller, UseFormReturn } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { SectionHeader } from '../../../components/section-header';
import { Card, Input, Button, OptionSelector } from '@my-org/shared-ui';
import { FormSlider } from '../../../components/custom-slider/form-slider';
import { ImageUploader } from '../../../components/image/image-uploader';
import { CheckInFormData, MenstrualCycle } from '../types';
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
        <Input label={t('checkin.measures.breast')} infoText={t('checkin.measures.info.breast')} type="number" {...register('breastSize', { valueAsNumber: true })}
               error={errors.breastSize?.message && t(errors.breastSize.message)}></Input>
        <Input label={t('checkin.measures.waist')} infoText={t('checkin.measures.info.waist')} type="number" {...register('waistSize', { valueAsNumber: true })}
               error={errors.waistSize?.message && t(errors.waistSize.message)}></Input>
        <Input label={t('checkin.measures.hips')} infoText={t('checkin.measures.info.hips')} type="number" {...register('hipSize', { valueAsNumber: true })}
               error={errors.hipSize?.message && t(errors.hipSize.message)}></Input>
        <Input label={t('checkin.measures.butt')} infoText={t('checkin.measures.info.butt')} type="number" {...register('buttSize', { valueAsNumber: true })}
               error={errors.buttSize?.message && t(errors.buttSize.message)}></Input>
        <Input label={t('checkin.measures.leftThigh')} infoText={t('checkin.measures.info.thigh')} type="number" {...register('leftThigh', { valueAsNumber: true })}
               error={errors.leftThigh?.message && t(errors.leftThigh.message)}></Input>
        <Input label={t('checkin.measures.rightThigh')} infoText={t('checkin.measures.info.thigh')} type="number" {...register('rightThigh', { valueAsNumber: true })}
               error={errors.rightThigh?.message && t(errors.rightThigh.message)}></Input>
        <Input label={t('checkin.measures.leftArm')} infoText={t('checkin.measures.info.arm')} type="number" {...register('leftArm', { valueAsNumber: true })}
               error={errors.leftArm?.message && t(errors.leftArm.message)}></Input>
        <Input label={t('checkin.measures.rightArm')} infoText={t('checkin.measures.info.arm')} type="number" {...register('rightArm', { valueAsNumber: true })}
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

        <Input label={t('checkin.workouts')} type="number"
               min={0} max={10} step={1} {...register('workouts', { valueAsNumber: true })}
               error={errors.workouts?.message && t(errors.workouts.message)}></Input>

        <Controller
          name="menstrualCycle"
          control={control}
          render={({ field: { value, onChange } }) => (
            <OptionSelector
              label={t('checkin.menstrualCycle.question')}
              infoText={t('checkin.menstrualCycle.info')}
              value={value}
              onChange={onChange}
              options={[
                { label: t('checkin.menstrualCycle.on'), value: MenstrualCycle.ON },
                { label: t('checkin.menstrualCycle.off'), value: MenstrualCycle.OFF },
                { label: t('checkin.menstrualCycle.pre'), value: MenstrualCycle.PRE },
              ]}
              error={errors.menstrualCycle?.message && t(errors.menstrualCycle.message)}
            />
          )}
        />
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
          {!isEdit ? t('checkin.button') : <Trans i18nKey="checkin.save">Save</Trans>}
        </Button>
      </div>
    </form>
  );
}
