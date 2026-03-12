import { Weight } from '../../store/user.store';

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
