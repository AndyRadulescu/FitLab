import { UseFormReturn } from 'react-hook-form';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card } from '../../design/card';
import { Input } from '../../design/input';
import { Button } from '../../design/button';
import { WeightFormData } from '../types';

interface WeightInputFormProps {
  formMethods: UseFormReturn<WeightFormData>;
  onSave: (data: WeightFormData) => Promise<void>;
  onCancel: () => void;
}

export function WeightInputForm({ formMethods, onSave, onCancel }: WeightInputFormProps) {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = formMethods;

  return (
    <Card>
      <form onSubmit={handleSubmit(onSave)}
            className="relative flex flex-col md:flex-row gap-4 aling-center justify-center w-full">
        <div data-testid="close-icon" className="absolute top-0 right-0 z-10" onClick={onCancel}>
          <X size={18} />
        </div>
        <div className="flex-2">
          <Input label={t('dashboard.weight.placeholder')}
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
