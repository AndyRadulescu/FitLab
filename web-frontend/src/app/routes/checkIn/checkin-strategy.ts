import { CheckInFormDataDto, CheckInPayload, checkinStore } from '../../store/checkin.store';
import { db } from '../../../init-firebase-auth';
import { collection, doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';

interface CheckInStrategy {
  checkIn: ({ data, userId }: { data: CheckInPayload, userId: string }) => Promise<void>;
}

class UpdateCheckInStrategy implements CheckInStrategy {
  async checkIn({ data, userId }: { data: CheckInPayload, userId: string }) {
    const docRef = doc(db, 'checkins', data.id);
    const mappedData = { ...data, updatedAt: new Date() };
    await updateDoc(docRef, {
      ...mappedData,
      updatedAt: serverTimestamp()
    });
    checkinStore.getState().upsertCheckin(mappedData as CheckInFormDataDto);
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

export class CheckInStrategyFactory {
  static getStrategy(isEdit: boolean | undefined): CheckInStrategy {
    if (isEdit) {
      return new UpdateCheckInStrategy();
    }
    return new AddCheckInStrategy();
  }
}
