import { checkinStore } from '../../store/checkin.store';
import { collection, doc, runTransaction, serverTimestamp } from 'firebase/firestore';
import { analytics, db } from '../../../init-firebase-auth';
import { logEvent } from 'firebase/analytics';
import { CheckInStrategy, CheckinStrategyType } from './checkin-strategy';
import { CheckInFormDataDto, CHECKINS_TABLE, WEIGHT_TABLE } from '@my-org/core';
import { userStore } from '../../store/user.store';

export class AddCheckInStrategy implements CheckInStrategy {
  async checkIn({ data, userId }: { data: Partial<CheckinStrategyType>, userId: string }) {
    if (!data.id) return;
    const now = new Date();

    // 1. Handle Weight
    let weightId = data.weightId;
    const weightValue = data.kg;
    if (weightValue === undefined) return;

    await runTransaction(db, async (transaction) => {
      if (!weightId) {
        const weightRef = doc(collection(db, WEIGHT_TABLE));
        weightId = weightRef.id;
        transaction.set(weightRef, {
          id: weightId,
          userId: userId,
          weight: weightValue,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          from: 'checkin'
        });
      } else {
        const weightRef = doc(db, WEIGHT_TABLE, weightId);
        transaction.update(weightRef, {
          weight: weightValue,
          updatedAt: serverTimestamp()
        });
      }

      // 2. Handle Checkin
      const newDocRef = doc(db, CHECKINS_TABLE, data.id!);
      const { kg, ...checkinDataWithoutKg } = data;
      const cleanCheckinData = Object.fromEntries(
        Object.entries(checkinDataWithoutKg).filter(([_, v]) => v !== undefined)
      );

      transaction.set(newDocRef, {
        ...cleanCheckinData,
        weightId,
        userId: userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    });

    if (!data.weightId) {
      userStore.getState().addWeight({
        id: weightId!,
        weight: weightValue,
        createdAt: now,
        updatedAt: now,
        from: 'checkin'
      });
    } else {
      userStore.getState().updateWeight({
        id: weightId!,
        weight: weightValue,
        createdAt: now,
        updatedAt: now,
        from: 'checkin'
      });
    }

    const { kg, ...checkinDataWithoutKg } = data;
    const cleanCheckinData = Object.fromEntries(
      Object.entries(checkinDataWithoutKg).filter(([_, v]) => v !== undefined)
    );
    const mappedData = {
      ...cleanCheckinData,
      weightId: weightId as string,
      createdAt: now,
      updatedAt: now,
      userId
    } as CheckInFormDataDto;

    checkinStore.getState().upsertCheckin(mappedData);
    if (analytics) {
      logEvent(analytics, 'add-checkin');
    }
  }
}
