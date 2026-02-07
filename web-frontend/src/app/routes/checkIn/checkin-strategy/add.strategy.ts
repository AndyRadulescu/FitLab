import { CheckInFormDataDto, CheckInPayload, checkinStore } from '../../../store/checkin.store';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { analytics, db } from '../../../../init-firebase-auth';
import { logEvent } from 'firebase/analytics';
import { CheckInStrategy } from './checkin-strategy';

export class AddCheckInStrategy implements CheckInStrategy {
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
      logEvent(analytics, 'add-checkin');
    }
  }
}
