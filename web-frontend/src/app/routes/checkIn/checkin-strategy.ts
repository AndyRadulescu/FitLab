import { CheckInFormDataDto, CheckInPayload, checkinStore } from '../../store/checkin.store';
import { analytics, db, storage } from '../../../init-firebase-auth';
import { deleteDoc, doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { logEvent } from 'firebase/analytics';
import { deleteObject, listAll, ref } from 'firebase/storage';
import firebase from 'firebase/compat/app';
import FirebaseError = firebase.FirebaseError;

interface CheckInStrategy {
  checkIn: ({ data, userId }: { data: CheckInPayload, userId: string }) => Promise<void>;
}

export const SLOTS = ['front', 'back', 'side'] as const;

class UpdateCheckInStrategy implements CheckInStrategy {
  async checkIn({ data, userId }: { data: CheckInPayload, userId?: string }) {
    const docRef = doc(db, 'checkins', data.id);
    const mappedData = { ...data, updatedAt: new Date() };
    await updateDoc(docRef, {
      ...mappedData,
      updatedAt: serverTimestamp()
    });
    checkinStore.getState().upsertCheckin(mappedData as CheckInFormDataDto);
    if (analytics) {
      logEvent(analytics, 'add-checkin');
    }
  }
}

class DeleteCheckInStrategy implements CheckInStrategy {
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
    const checkinFolderRef = ref(storage, `checkin-imgs/${userId}/${checkinId}`);
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

class AddCheckInStrategy implements CheckInStrategy {
  async checkIn({ data, userId }: { data: CheckInPayload, userId: string }) {
    const now = new Date();
    const newDocRef = doc(db, 'checkins', data.id);
    const mappedData: CheckInFormDataDto = { ...data, createdAt: now, updatedAt: now, userId };

    await setDoc(newDocRef, {
      ...mappedData,
      userId: userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    checkinStore.getState().upsertCheckin(mappedData);
    if (analytics) {
      logEvent(analytics, 'update-checkin');
    }
  }
}

type StrategyType = 'add' | 'edit' | 'delete';
const strategies = new Map<StrategyType, CheckInStrategy>();

strategies.set('add', new AddCheckInStrategy());
strategies.set('edit', new UpdateCheckInStrategy());
strategies.set('delete', new DeleteCheckInStrategy());

export class CheckInStrategyFactory {
  static getStrategy(strategy: StrategyType): CheckInStrategy {
    return strategies.get(strategy) ?? new AddCheckInStrategy();
  }
}
