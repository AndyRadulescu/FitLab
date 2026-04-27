import { checkinStore } from '../../store/checkin.store';
import { doc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { analytics, db } from '../../../init-firebase-auth';
import { logEvent } from 'firebase/analytics';
import { CheckInStrategy } from './checkin-strategy';
import { CheckInFormDataDto, CHECKINS_TABLE, WEIGHT_TABLE } from '@my-org/core';
import { userStore } from '../../store/user.store';

export class UpdateCheckInStrategy implements CheckInStrategy {
  async checkIn({ data, userId }: { data: any, userId?: string }) {
    if (data.id === undefined || data.weightId === undefined) return;
    const batch = writeBatch(db);

    const now = new Date();

    // 1. Update weight if exists
    if (data.weightId && data.kg !== undefined) {
      const weightRef = doc(db, WEIGHT_TABLE, data.weightId);
      batch.update(weightRef, {
        weight: data.kg,
        updatedAt: serverTimestamp()
      });
      userStore.getState().updateWeight({
        id: data.weightId,
        weight: data.kg,
        createdAt: data.createdAt ?? now,
        updatedAt: now,
        from: 'checkin'
      });
    }

    // 2. Update checkin document
    const docRef = doc(db, CHECKINS_TABLE, data.id);
    const { kg, ...checkinDataWithoutKg } = data;
    const mappedData = {
      ...checkinDataWithoutKg,
      weightId: data.weightId,
      updatedAt: now
    };

    batch.update(docRef, {
      ...checkinDataWithoutKg,
      updatedAt: serverTimestamp()
    });

    await batch.commit();

    checkinStore.getState().upsertCheckin(mappedData as CheckInFormDataDto);
    if (analytics) {
      logEvent(analytics, 'update-checkin');
    }
  }
}
