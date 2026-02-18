import { WeightStrategy } from './weight-strategy';
import { TFunction } from 'i18next';
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { WEIGHT_TABLE } from '../../firestore/queries';
import { analytics, db } from '../../../init-firebase-auth';
import { userStore, Weight } from '../../store/user.store';
import { logEvent } from 'firebase/analytics';

export class EditWeightStrategy implements WeightStrategy {
  async weight(data:  Weight, userId: string, t: TFunction<'translation', undefined>): Promise<void> {
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
