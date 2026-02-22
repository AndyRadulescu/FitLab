import { WeightStrategy } from './weight-strategy';
import { TFunction } from 'i18next';
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { CHECKINS_TABLE, WEIGHT_TABLE } from '../../firestore/constants';
import { analytics, db } from '../../../init-firebase-auth';
import { userStore, Weight } from '../../store/user.store';
import { logEvent } from 'firebase/analytics';
import { checkinStore } from '../../store/checkin.store';

function isCompleteWeight(data: Partial<Weight>): data is Weight {
  return data.id !== undefined && data.weight !== undefined && data.createdAt !== undefined;
}

export class EditWeightStrategy implements WeightStrategy {
  async weight(data: Partial<Weight>, userId: string, t: TFunction<'translation', undefined>): Promise<void> {
    if (!isCompleteWeight(data)) return;
    try {
      if (data.from === 'checkin') {
        await this.updateCheckin(data);
      } else {
        await this.updateWeight(data);
      }

      if (analytics) {
        logEvent(analytics, 'edit-weight');
      }
    } catch (err) {
      console.error(err);
      alert(t('errors.unknown'));
    }
  }

  private async updateWeight(data: Weight) {
    const weightRef = doc(db, WEIGHT_TABLE, data.id);
    await updateDoc(weightRef, {
      weight: data.weight,
      updatedAt: serverTimestamp()
    });
    userStore.getState().updateWeight({ ...data, weight: data.weight, updatedAt: new Date() });
  }

  private async updateCheckin(data: Weight) {
    const weightRef = doc(db, CHECKINS_TABLE, data.id);
    await updateDoc(weightRef, {
      weight: data.weight,
      updatedAt: serverTimestamp()
    });
    checkinStore.getState().updateWeight(data.id, data.weight, new Date());
  }

}
