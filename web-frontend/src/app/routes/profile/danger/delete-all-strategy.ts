import { collection, query, where, getDocs, runTransaction, doc } from 'firebase/firestore';
import { ref, listAll, deleteObject } from 'firebase/storage';
import { analytics, db, storage } from '../../../../init-firebase-auth';
import { logEvent } from 'firebase/analytics';
import { CHECKINS_STORAGE, CHECKINS_TABLE, USERS_TABLE, WEIGHT_TABLE } from '../../../firestore/queries';

export class DeleteUserAccount {
  async deleteAllUserData(userId: string) {
    if (!userId) throw new Error('No User ID provided for deletion');

    try {
      await this.wipeUserStorage(userId);

      await this.wipeUserFirestore(userId);

      if (analytics) {
        logEvent(analytics, 'account_deleted_complete', { userId });
      }
    } catch (err) {
      console.error('Full cleanup failed:', err);
      throw err;
    }
  }

  private async wipeUserStorage(userId: string) {
    const userFolderRef = ref(storage, `${CHECKINS_STORAGE}${userId}`);

    const recursiveDelete = async (folderRef: any) => {
      const listResponse = await listAll(folderRef);
      const filePromises = listResponse.items.map((item) => deleteObject(item));
      const folderPromises = listResponse.prefixes.map((subFolder) => recursiveDelete(subFolder));
      await Promise.all([...filePromises, ...folderPromises]);
    };
    await recursiveDelete(userFolderRef);
  }

  private async wipeUserFirestore(userId: string) {
    await runTransaction(db, async (transaction) => {
      const checkinsRef = collection(db, CHECKINS_TABLE);
      const userRef = collection(db, USERS_TABLE);
      const weightRef = collection(db, WEIGHT_TABLE);
      const qCheckins = query(checkinsRef, where('userId', '==', userId));
      const qUser = query(userRef, where('userId', '==', userId));
      const qWeight = query(weightRef, where('userId', '==', userId));

      const [checkinsSnap, startSnap, weightSnap] = await Promise.all([
        getDocs(qCheckins),
        getDocs(qUser),
        getDocs(qWeight)
      ]);

      checkinsSnap.forEach((doc) => {
        transaction.delete(doc.ref);
      });
      startSnap.forEach((doc) => {
        transaction.delete(doc.ref);
      });
      weightSnap.forEach((doc) => {
        transaction.delete(doc.ref);
      });

      const profileRef = doc(db, 'users', userId);
      transaction.delete(profileRef);
    });

    localStorage.removeItem("user-store");
  }
}
