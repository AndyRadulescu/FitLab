import { CheckInFormDataDto, CheckInPayload, checkinStore } from '../../store/checkin.store';
import { analytics, db } from '../../../init-firebase-auth';
import { collection, deleteDoc, doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { logEvent } from 'firebase/analytics';

interface CheckInStrategy {
  checkIn: ({ data, userId }: { data: CheckInPayload, userId: string }) => Promise<void>;
}

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
    const docRef = doc(db, 'checkins', data.id);
    await deleteDoc(docRef);
    checkinStore.getState().deleteCheckin(data.id!);
    if (analytics) {
      logEvent(analytics, 'delete-checkin');
    }
  }
}

class AddCheckInStrategy implements CheckInStrategy {
  async checkIn({ data, userId }: { data: CheckInPayload, userId: string }) {
    const newDocRef = doc(collection(db, 'checkins'));
    const myId = newDocRef.id;
    const now = new Date();
    const mappedData: CheckInFormDataDto = { ...data, createdAt: now, updatedAt: now, id: myId, userId };

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
