import { CheckInFormDataDto, CheckInPayload, checkinStore } from '../../../store/checkin.store';
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { analytics, db } from '../../../../init-firebase-auth';
import { logEvent } from 'firebase/analytics';
import { CheckInStrategy } from './checkin-strategy';

export class UpdateCheckInStrategy implements CheckInStrategy {
  async checkIn({ data, userId }: { data: CheckInPayload, userId?: string }) {
    const docRef = doc(db, 'checkins', data.id);
    const mappedData = { ...data, updatedAt: new Date() };
    await updateDoc(docRef, {
      ...mappedData,
      updatedAt: serverTimestamp()
    });
    checkinStore.getState().upsertCheckin(mappedData as CheckInFormDataDto);
    if (analytics) {
      logEvent(analytics, 'update-checkin');
    }
  }
}
