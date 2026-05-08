import { collection, doc, runTransaction, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../init-firebase-auth';
import { StartMappedWeightData, USERS_TABLE, WEIGHT_TABLE } from '@my-org/core';

export async function startTransaction(userId: string, mappedData: StartMappedWeightData): Promise<string | null> {
  let weightId = null;
  await runTransaction(db, async (transaction) => {
    const weightRef = doc(collection(db, WEIGHT_TABLE));
    weightId = weightRef.id;
    const userRef = doc(db, USERS_TABLE, userId);

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
