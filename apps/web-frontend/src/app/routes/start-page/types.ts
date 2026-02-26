import { z } from 'zod';

export const startPageSchema = z.object({
  dateOfBirth: z.date({ message: 'errors.date.invalid' }),
  weight: z.number({ message: 'errors.profile.empty' }).min(0, 'errors.profile.min'),
  height: z.number({ message: 'errors.profile.empty' }).min(0, 'errors.profile.min')
});

export type StartPageFormData = z.infer<typeof startPageSchema>;

export type StartMappedWeightData = {
  dateOfBirth: string
  weight: number
  height: number
}
