import { CheckInFormDataDto, checkinStore } from '../../store/checkin.store';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { analytics, db } from '../../../init-firebase-auth';
import { logEvent } from 'firebase/analytics';
import { CheckInStrategy } from './checkin-strategy';
import { CHECKINS_TABLE } from '../../firestore/queries';

export class AddCheckInStrategy implements CheckInStrategy {
  async checkIn({ data, userId }: { data: Partial<CheckInFormDataDto>, userId: string }) {
    if(!data.id) return;
    const now = new Date();
    const newDocRef = doc(db, CHECKINS_TABLE, data.id);
    const mappedData = { ...data, createdAt: now, updatedAt: now, userId } as CheckInFormDataDto;

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
