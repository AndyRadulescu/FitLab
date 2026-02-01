import { CheckInFormDataDto, CheckInPayload, checkinStore } from '../../store/checkin.store';
import { db } from '../../../init-firebase-auth';
import { collection, doc, serverTimestamp, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';

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
  }
}

class DeleteCheckInStrategy implements CheckInStrategy {
  async checkIn({ data, userId }: { data: CheckInPayload, userId: string }) {
    const docRef = doc(db, 'checkins', data.id);
    await deleteDoc(docRef);
    checkinStore.getState().deleteCheckin(data.id!);
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
