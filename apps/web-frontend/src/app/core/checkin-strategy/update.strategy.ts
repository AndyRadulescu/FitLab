import { CheckInFormDataDto, checkinStore } from '../../store/checkin.store';
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { analytics, db } from '../../../init-firebase-auth';
import { logEvent } from 'firebase/analytics';
import { CheckInStrategy, CheckinStrategyType } from './checkin-strategy';
import { CHECKINS_TABLE } from '../../firestore/constants';

export class UpdateCheckInStrategy implements CheckInStrategy {
  async checkIn({ data, userId }: { data: CheckinStrategyType, userId?: string }) {
    if(data.id === undefined) return;
    const docRef = doc(db, CHECKINS_TABLE, data.id);
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
