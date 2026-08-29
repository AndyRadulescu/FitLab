import { checkinStore } from '../../store/checkin.store';
import { doc, runTransaction, serverTimestamp } from 'firebase/firestore';
import { analytics, db } from '../../../init-firebase-auth';
import { logEvent } from 'firebase/analytics';
import { CheckInStrategy, CheckinStrategyType } from './checkin-strategy';
import { CheckInFormDataDto, CHECKINS_TABLE, WEIGHT_TABLE } from '@my-org/core';
import { userStore } from '../../store/user.store';

export class UpdateCheckInStrategy implements CheckInStrategy {
  async checkIn({ data, userId }: { data: Partial<CheckinStrategyType>, userId?: string }) {
    if (data.id === undefined || data.weightId === undefined) return;

    const now = new Date();

    await runTransaction(db, async (transaction) => {
      // 1. Update weight if exists
      if (data.weightId && data.kg !== undefined) {
        const weightRef = doc(db, WEIGHT_TABLE, data.weightId);
        transaction.update(weightRef, {
          weight: data.kg,
          updatedAt: serverTimestamp()
        });
      }

      // 2. Update checkin document
      const docRef = doc(db, CHECKINS_TABLE, data.id!);
      const { kg, ...checkinDataWithoutKg } = data;
      const cleanCheckinData = Object.fromEntries(
        Object.entries(checkinDataWithoutKg).filter(([_, v]) => v !== undefined)
      );

      transaction.update(docRef, {
        ...cleanCheckinData,
        updatedAt: serverTimestamp()
      });
    });

    if (data.weightId && data.kg !== undefined) {
      userStore.getState().updateWeight({
        id: data.weightId,
        weight: data.kg,
        createdAt: data.createdAt ?? now,
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
      weightId: data.weightId,
      updatedAt: now
    };

    checkinStore.getState().upsertCheckin(mappedData as CheckInFormDataDto);
    if (analytics) {
      logEvent(analytics, 'update-checkin');
    }
  }
}
