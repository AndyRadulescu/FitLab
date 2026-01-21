import { Input } from '../../design/input';
import { Card } from '../../design/Card';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';

const checkinSchema = z.object({
  kg: z.coerce.number({ message: 'errors.profile.empty' }).min(0, 'errors.profile.min'),
  breastSize: z.number({ message: 'errors.profile.empty' }).min(0, 'errors.profile.min'),
  waistSize: z.number({ message: 'errors.profile.empty' }).min(0, 'errors.profile.min'),
  heapSize: z.number({ message: 'errors.profile.empty' }).min(0, 'errors.profile.min'),
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

type CheckInFormData = z.infer<typeof checkinSchema>;

export function CheckInPage() {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<CheckInFormData>({
    resolver: zodResolver(checkinSchema)
  });

  const sendCheckin = (data: CheckInFormData) => {
    console.log(data);
  };

  return (
    <div>
      <h1 className="text-center">Check-in</h1>
      <form noValidate className="mt-4" onSubmit={handleSubmit(data => sendCheckin(data))}>
        <Card className="mb-2">
          <Input label="Kilograme: " type="number" min="0" {...register('kg', { valueAsNumber: true })}
                 error={errors.kg?.message && t(errors.kg.message)}></Input>
        </Card>
        <Card className="mb-2">
          <Input label="Masuraturi bust: " type="number" {...register('breastSize', { valueAsNumber: true })}
                 error={errors.breastSize?.message && t(errors.breastSize.message)}></Input>
          <Input label="Masuraturi talie: " type="number" {...register('waistSize', { valueAsNumber: true })}
                 error={errors.waistSize?.message && t(errors.waistSize.message)}></Input>
          <Input label="Masuraturi solduri: " type="number" {...register('heapSize', { valueAsNumber: true })}
                 error={errors.heapSize?.message && t(errors.heapSize.message)}></Input>
          <Input label="Masuraturi fund: " type="number" {...register('buttSize', { valueAsNumber: true })}
                 error={errors.buttSize?.message && t(errors.buttSize.message)}></Input>
          <Input label="Masuraturi coapsa stanga: " type="number" {...register('leftThigh', { valueAsNumber: true })}
                 error={errors.leftThigh?.message && t(errors.leftThigh.message)}></Input>
          <Input label="Masuraturi coapsa dreapta: " type="number" {...register('rightThigh', { valueAsNumber: true })}
                 error={errors.rightThigh?.message && t(errors.rightThigh.message)}></Input>
          <Input label="Masuraturi bratul stang: " type="number" {...register('leftArm', { valueAsNumber: true })}
                 error={errors.leftArm?.message && t(errors.leftArm.message)}></Input>
          <Input label="Masuraturi bratul drept: " type="number" {...register('rightArm', { valueAsNumber: true })}
                 error={errors.rightArm?.message && t(errors.rightArm.message)}></Input>
        </Card>

        <Card>
          <Input label="Cate ore ai dormit in medie? " type="number" min="0"
                 max="12" {...register('hoursSlept', { valueAsNumber: true })}
                 error={errors.hoursSlept?.message && t(errors.hoursSlept.message)}></Input>
          <Input label="Pe o scara de la 1 la 10 cat de bine ai respectat planul alimentar?" type="number" min="1"
                 max="10" {...register('planAccuracy', { valueAsNumber: true })}
                 error={errors.planAccuracy?.message && t(errors.planAccuracy.message)}></Input>
          <Input label="Pe o scara de la 1 la 10 ce energie ai?" type="number" min="1"
                 max="10" {...register('energyLevel', { valueAsNumber: true })}
                 error={errors.energyLevel?.message && t(errors.energyLevel.message)}></Input>
          <Input label="Pe o scara de la 1 la 10 cum te simti (mood check)?" type="number" min="1"
                 max="10" {...register('moodCheck', { valueAsNumber: true })}
                 error={errors.moodCheck?.message && t(errors.moodCheck.message)}></Input>
          <Input label="Cati pasi ai facut zilnic in medie?" type="number"
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
