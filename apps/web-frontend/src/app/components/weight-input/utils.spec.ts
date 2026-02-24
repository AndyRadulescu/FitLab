import { describe, it, expect } from 'vitest';
import { getTodayWeight } from './utils';
import { Weight } from '../../store/user.store';

describe('getTodayWeight', () => {
  const today = new Date();
  today.setHours(12, 0, 0, 0); // Mid-day today

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(12, 0, 0, 0);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(12, 0, 0, 0);

  it('should return undefined when the weights array is empty', () => {
    expect(getTodayWeight([])).toBeUndefined();
  });

  it('should return the weight if it was created today', () => {
    const weightToday: Weight = { id: '1', weight: 80, createdAt: today };
    const weights = [weightToday];

    expect(getTodayWeight(weights)).toEqual(weightToday);
  });

  it('should return undefined if the weights are only from yesterday', () => {
    const weightYesterday: Weight = { id: '1', weight: 80, createdAt: yesterday };
    const weights = [weightYesterday];

    expect(getTodayWeight(weights)).toBeUndefined();
  });

  it('should return the latest weight from today and ignore future weights', () => {
    const weightYesterday: Weight = { id: '1', weight: 79, createdAt: yesterday };
    const weightToday: Weight = { id: '2', weight: 80, createdAt: today };
    const weightTomorrow: Weight = { id: '3', weight: 81, createdAt: tomorrow };

    // Should return weightToday because weightTomorrow is NOT today
    expect(getTodayWeight([weightYesterday, weightToday, weightTomorrow])).toEqual(weightToday);
  });

  it('should return the latest weight from today when multiple exist (even if unsorted)', () => {
    const earlyToday = new Date(today);
    earlyToday.setHours(8, 0, 0, 0);

    const lateToday = new Date(today);
    lateToday.setHours(20, 0, 0, 0);

    const weightEarly: Weight = { id: '1', weight: 80, createdAt: earlyToday };
    const weightLate: Weight = { id: '2', weight: 81, createdAt: lateToday };

    // Should return lateToday regardless of order
    expect(getTodayWeight([weightEarly, weightLate])).toEqual(weightLate);
    expect(getTodayWeight([weightLate, weightEarly])).toEqual(weightLate);
  });

  it('should work correctly with date strings (rehydrated from storage)', () => {
    const todayISO = today.toISOString();
    // Use 'as any' since the type says Date, but we are testing rehydration
    const weightToday: any = { id: '1', weight: 80, createdAt: todayISO };
    const weights = [weightToday];

    const result = getTodayWeight(weights as Weight[]);
    expect(result).toBeDefined();
    expect(new Date(result!.createdAt).getTime()).toEqual(new Date(todayISO).getTime());
  });

  it('should return the weight even if it was at the very start of today', () => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const weightToday: Weight = { id: '1', weight: 80, createdAt: startOfToday };
    const weights = [weightToday];

    expect(getTodayWeight(weights)).toEqual(weightToday);
  });
});
