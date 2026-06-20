import { CheckInBanner } from './components/checkin-banner';
import { useCheckInForm } from './hooks/use-checkin-form';
import { CheckInForm } from './components/checkin-form';

export function CheckInPage() {
  const {
    formMethods,
    onSubmit,
    isEditingToday,
    checkinData,
    activeCheckinId,
    user,
    gender
  } = useCheckInForm();

  return (
    <div>
      <CheckInBanner isVisible={isEditingToday} />
      <CheckInForm
        formMethods={formMethods}
        onSubmit={onSubmit}
        user={user!}
        gender={gender}
        activeCheckinId={activeCheckinId}
        isEdit={!!checkinData?.id}
      />
    </div>
  );
}
