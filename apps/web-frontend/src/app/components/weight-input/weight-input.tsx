import { WeightInputView } from './components/weight-input-view';
import { WeightInputForm } from './components/weight-input-form';
import { useWeightInputForm } from './hooks/use-weight-input-form';

export function WeightInput() {
  const {
    formMethods,
    handleSave,
    isEditable,
    setIsEditable,
    todayWeight
  } = useWeightInputForm();

  if (!isEditable) {
    return (
      <WeightInputView
        todayWeight={todayWeight}
        onEdit={() => setIsEditable(true)}
      />
    );
  }

  return (
    <WeightInputForm
      formMethods={formMethods}
      onSave={handleSave}
      onCancel={() => setIsEditable(false)}
    />
  );
}
