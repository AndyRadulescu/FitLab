import { WeightStrategy } from './weight-strategy';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../init-firebase-auth';
import { userStore } from '../../store/user.store';
import { WEIGHT_TABLE } from '../../firestore/queries';
import { TFunction } from 'i18next';

export class AddWeightStrategy implements WeightStrategy {
  async weight(weight: number, userId: string, t: TFunction<'translation', undefined>): Promise<void> {
    try {
      const docRef = await addDoc(collection(db, WEIGHT_TABLE), {
        userId: userId,
        weight: weight,
        createdAt: serverTimestamp()
      });
      userStore.getState().addWeight({ id: docRef.id, weight: weight, createdAt: new Date() });
    } catch (err) {
      console.error(err);
      alert(t('errors.unknown'));
    }
  }
}
