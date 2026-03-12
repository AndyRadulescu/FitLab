import { CheckInFormDataDto, checkinStore } from '../../store/checkin.store';
import { collection, doc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { analytics, db } from '../../../init-firebase-auth';
import { logEvent } from 'firebase/analytics';
import { CheckInStrategy, CheckinStrategyType } from './checkin-strategy';
import { CHECKINS_TABLE, WEIGHT_TABLE } from '@my-org/core';
import { userStore } from '../../store/user.store';

export class AddCheckInStrategy implements CheckInStrategy {
  async checkIn({ data, userId }: { data: Partial<CheckinStrategyType>, userId: string }) {
    if (!data.id) return;
    const now = new Date();
    const batch = writeBatch(db);

    // 1. Handle Weight
    let weightId = data.weightId;
    const weightValue = data.kg;
    if (weightValue === undefined) return;

    if (!weightId) {
      const weightRef = doc(collection(db, WEIGHT_TABLE));
      weightId = weightRef.id;
      batch.set(weightRef, {
        id: weightId,
        userId: userId,
        weight: weightValue,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        from: 'checkin'
      });
      userStore.getState().addWeight({
        id: weightId,
        weight: weightValue,
        createdAt: now,
        updatedAt: now,
        from: 'checkin'
      });
    } else {
      const weightRef = doc(db, WEIGHT_TABLE, weightId);
      batch.update(weightRef, {
        weight: weightValue,
        updatedAt: serverTimestamp()
      });
      userStore.getState().updateWeight({
        id: weightId,
        weight: weightValue,
        createdAt: now,
        updatedAt: now,
        from: 'checkin'
      });
    }

    // 2. Handle Checkin
    const newDocRef = doc(db, CHECKINS_TABLE, data.id);
    const { kg, ...checkinDataWithoutKg } = data;
    const mappedData = {
      ...checkinDataWithoutKg,
      weightId: weightId as string,
      createdAt: now,
      updatedAt: now,
      userId
    } as CheckInFormDataDto;

    batch.set(newDocRef, {
      ...checkinDataWithoutKg,
      weightId,
      userId: userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    await batch.commit();

    checkinStore.getState().upsertCheckin(mappedData);
    if (analytics) {
      logEvent(analytics, 'add-checkin');
    }
  }
}
