import { z } from 'zod';

export enum MenstrualCycle {
  ON = 'on',
  OFF = 'off',
  PRE = 'pre'
}

export const checkinSchema = z.object({
  kg: z.number({ message: 'errors.profile.number' }).min(0, 'errors.profile.min'),
  breastSize: z.number({ message: 'errors.profile.number' }).min(0, 'errors.profile.min'),
  waistSize: z.number({ message: 'errors.profile.number' }).min(0, 'errors.profile.min'),
  hipSize: z.number({ message: 'errors.profile.number' }).min(0, 'errors.profile.min'),
  buttSize: z.number({ message: 'errors.profile.number' }).min(0, 'errors.profile.min'),
  leftThigh: z.number({ message: 'errors.profile.number' }).min(0, 'errors.profile.min'),
  rightThigh: z.number({ message: 'errors.profile.number' }).min(0, 'errors.profile.min'),
  leftArm: z.number({ message: 'errors.profile.number' }).min(0, 'errors.profile.min'),
  rightArm: z.number({ message: 'errors.profile.number' }).min(0, 'errors.profile.min'),
  hoursSlept: z.number({ message: 'errors.profile.empty' }).min(0, 'errors.profile.min').max(12, 'errors.profile.maxHour'),
  planAccuracy: z.number({ message: 'errors.profile.empty' }).min(1, 'errors.profile.min1').max(10, 'errors.profile.max10'),
  energyLevel: z.number({ message: 'errors.profile.empty' }).min(1, 'errors.profile.min1').max(10, 'errors.profile.max10'),
  moodCheck: z.number({ message: 'errors.profile.empty' }).min(1, 'errors.profile.min1').max(10, 'errors.profile.max10'),
  dailySteps: z.number({ message: 'errors.profile.empty' }).min(1, 'errors.profile.min1'),
  workouts: z.number({ message: 'errors.profile.empty' }).min(0, 'errors.profile.min1').max(10, 'errors.profile.max10'),
  menstrualCycle: z.enum(MenstrualCycle, { message: 'errors.profile.empty' }),
  imgUrls: z.array(z.string(), 'errors.image.invalid').min(3, 'errors.image.invalid').max(3)
});

export type CheckInFormData = z.infer<typeof checkinSchema>;

export type CheckInFormDataDto = Omit<CheckInFormData, 'kg'> & {
  id: string;
  weightId: string;
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
};
