import { z } from 'zod';

export const weightSchema = z.object({
  weight: z.number({ message: 'errors.profile.number' }).min(0, 'errors.profile.min')
});

export type WeightFormData = z.infer<typeof weightSchema>;
