import { CheckInStrategy, CheckinStrategyType } from './checkin-strategy';
import { checkinStore } from '../../store/checkin.store';
import { analytics, db, storage } from '../../../init-firebase-auth';
import { doc, runTransaction } from 'firebase/firestore';
import { logEvent } from 'firebase/analytics';
import { deleteObject, listAll, ref } from 'firebase/storage';
import { getCheckinPath } from '@my-org/core';
import { CHECKINS_TABLE, WEIGHT_TABLE } from '@my-org/core';
import { userStore } from '../../store/user.store';

export class DeleteCheckInStrategy implements CheckInStrategy {
  async checkIn({ data, userId }: { data: CheckinStrategyType, userId: string }) {
    if (!data.id) throw new Error('Missing Check-in ID for deletion');

    try {
      await this.deleteFile(data.id, userId);
      await this.deleteDocs(data);

      if (analytics) {
        logEvent(analytics, 'delete-checkin');
      }
      // @ts-expect-error: should always be a FirestoreError
    } catch (err: FirebaseError) {
      console.error('Cleanup failed:', err);
      if (analytics) {
        logEvent(analytics, 'delete-checkin-error', err.message);
        alert('Failed to delete check-in');
      }
    }
  }

  private async deleteFile(checkinId: string, userId: string) {
    const checkinFolderRef = ref(storage, getCheckinPath(userId, checkinId));
    const listResponse = await listAll(checkinFolderRef);
    const deletePromises = listResponse.items.map((item) => deleteObject(item));
    await Promise.allSettled(deletePromises);
  }

  private async deleteDocs(data: CheckinStrategyType) {
    await runTransaction(db, async (transaction) => {
      const checkinRef = doc(db, CHECKINS_TABLE, data.id!);
      transaction.delete(checkinRef);

      if (data.weightId) {
        const weightRef = doc(db, WEIGHT_TABLE, data.weightId);
        transaction.delete(weightRef);
      }
    });

    checkinStore.getState().deleteCheckin(data.id!);
    if (data.weightId) {
      userStore.getState().deleteWeight(data.weightId);
    }
  }
}
