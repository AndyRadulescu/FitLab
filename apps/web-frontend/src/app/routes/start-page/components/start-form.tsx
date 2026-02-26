import { UseFormReturn } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { SectionHeader } from '../../../components/section-header';
import { Card } from '../../../components/design/card';
import { Input } from '../../../components/design/input';
import { Button } from '../../../components/design/button';
import { StartPageFormData } from '../types';

interface StartFormProps {
  formMethods: UseFormReturn<StartPageFormData>;
  onSubmit: (data: StartPageFormData) => Promise<void>;
}

export function StartForm({ formMethods, onSubmit }: StartFormProps) {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = formMethods;

  return (
    <form noValidate className="mx-4 py-8 flex flex-col h-svh justify-between"
          onSubmit={handleSubmit(onSubmit)}>
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
