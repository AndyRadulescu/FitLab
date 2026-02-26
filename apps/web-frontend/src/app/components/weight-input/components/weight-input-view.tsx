import { useTranslation } from 'react-i18next';
import { Button } from '../../design/button';
import { Card } from '../../design/card';
import { Weight } from '../../../store/user.store';

interface WeightInputViewProps {
  todayWeight?: Weight;
  onEdit: () => void;
}

export function WeightInputView({ todayWeight, onEdit }: WeightInputViewProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <div className="flex aling-center justify-between w-full">
        <div className="flex items-center">
          <p className="text-md">{t('dashboard.weight.value', { weight: todayWeight?.weight })}</p>
        </div>
        <div onClick={onEdit}>
          <Button type="tertiary">{t('common.edit')}</Button>
        </div>
      </div>
    </Card>
  );
}
