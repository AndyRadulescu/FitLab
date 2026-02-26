import { collection, doc, runTransaction, serverTimestamp } from 'firebase/firestore';
import { USERS_TABLE, WEIGHT_TABLE } from '../../firestore/constants';
import { db } from '../../../init-firebase-auth';
import { StartMappedWeightData } from './types';

export async function startTransaction(userId: string, mappedData: StartMappedWeightData): Promise<string | null> {
  let weightId = null;
  await runTransaction(db, async (transaction) => {
    const weightRef = doc(collection(db, WEIGHT_TABLE));
    weightId = weightRef.id;
    const userRef = doc(collection(db, USERS_TABLE));

    transaction.set(weightRef, {
      userId: userId,
      createdAt: serverTimestamp(),
      weight: mappedData.weight
    });

    transaction.set(userRef, {
      ...mappedData,
      userId: userId,
      createdAt: serverTimestamp()
    });
  });
  return weightId;
}
