import { Weight } from '../../store/user.store';
import { CheckInFormDataDto } from '../../store/checkin.store';

export const getTodayWeight = (weights: Weight[]): Weight | undefined => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const todayTime = today.getTime();
  const tomorrowTime = tomorrow.getTime();

  const todayWeights = weights.filter((w) => {
    const createdAt = new Date(w.createdAt).getTime();
    return createdAt >= todayTime && createdAt < tomorrowTime;
  });

  if (todayWeights.length === 0) {
    return undefined;
  }

  return todayWeights.reduce((latest, current) => {
    return new Date(current.createdAt).getTime() > new Date(latest.createdAt).getTime()
      ? current
      : latest;
  });
};

export const transformCheckinsToWeights = (checkins: CheckInFormDataDto[]): Weight[] => {
  return checkins.map((checkin) => ({
    id: checkin.id,
    weight: checkin.kg,
    createdAt: checkin.createdAt,
    updatedAt: checkin.updatedAt
  }));
}
