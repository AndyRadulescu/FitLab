import { WeightStrategy } from './weight-strategy';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { analytics, db } from '../../../init-firebase-auth';
import { userStore } from '../../store/user.store';
import { TFunction } from 'i18next';
import { logEvent } from 'firebase/analytics';
import { Weight, WEIGHT_TABLE } from '@my-org/core';

export class AddWeightStrategy implements WeightStrategy {
  async weight(weight: Partial<Weight>, userId: string, t: TFunction<'translation', undefined>): Promise<void> {
    if (!weight.weight) return;
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
