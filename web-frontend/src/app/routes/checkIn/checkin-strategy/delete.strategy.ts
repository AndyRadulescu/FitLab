import { CheckInStrategy } from './checkin-strategy';
import { CheckInPayload, checkinStore } from '../../../store/checkin.store';
import { analytics, db, storage } from '../../../../init-firebase-auth';
import { deleteDoc, doc } from 'firebase/firestore';
import { logEvent } from 'firebase/analytics';
import { deleteObject, listAll, ref } from 'firebase/storage';
import { getCheckinPath } from '../../../image-manager/image-path';

export class DeleteCheckInStrategy implements CheckInStrategy {
  async checkIn({ data, userId }: { data: CheckInPayload, userId: string }) {
    if (!data.id) throw new Error('Missing Check-in ID for deletion');

    try {
      await this.deleteFile(data.id, userId);
      await this.deleteDoc(data.id);

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

  private async deleteDoc(checkinId: string) {
    const docRef = doc(db, 'checkins', checkinId);
    await deleteDoc(docRef);
    checkinStore.getState().deleteCheckin(checkinId);
  }
}
