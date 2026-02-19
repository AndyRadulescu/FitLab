import { WeightStrategy } from './weight-strategy';
import { TFunction } from 'i18next';
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { WEIGHT_TABLE } from '../../firestore/constants';
import { analytics, db } from '../../../init-firebase-auth';
import { userStore, Weight } from '../../store/user.store';
import { logEvent } from 'firebase/analytics';

function isCompleteWeight(data: Partial<Weight>): data is Weight {
  return data.id !== undefined && data.weight !== undefined && data.createdAt !== undefined;
}

export class EditWeightStrategy implements WeightStrategy {
  async weight(data: Partial<Weight>, userId: string, t: TFunction<'translation', undefined>): Promise<void> {
    if (!isCompleteWeight(data)) return;
    try {
      const weightRef = doc(db, WEIGHT_TABLE, data.id);
      await updateDoc(weightRef, {
        weight: data.weight,
        updatedAt: serverTimestamp()
      });
      userStore.getState().updateWeight({ ...data, weight: data.weight, updatedAt: new Date() });
      if (analytics) {
        logEvent(analytics, 'edit-weight');
      }
    } catch (err) {
      console.error(err);
      alert(t('errors.unknown'));
    }
  }

}
