import { WeightStrategy } from './weight-strategy';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { analytics, db } from '../../../init-firebase-auth';
import { userStore, Weight } from '../../store/user.store';
import { WEIGHT_TABLE } from '../../firestore/queries';
import { TFunction } from 'i18next';
import { logEvent } from 'firebase/analytics';

export class AddWeightStrategy implements WeightStrategy {
  async weight(weight: Weight, userId: string, t: TFunction<'translation', undefined>): Promise<void> {
    try {
      const docRef = await addDoc(collection(db, WEIGHT_TABLE), {
        userId: userId,
        weight: weight.weight,
        createdAt: serverTimestamp()
      });
      userStore.getState().addWeight({ id: docRef.id, weight: weight.weight, createdAt: new Date() });
      if (analytics) {
        logEvent(analytics, 'add-weight');
      }
    } catch (err) {
      console.error(err);
      alert(t('errors.unknown'));
    }
  }
}
