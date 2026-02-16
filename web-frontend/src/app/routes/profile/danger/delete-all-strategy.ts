import { collection, query, where, getDocs, writeBatch, doc } from 'firebase/firestore';
import { ref, listAll, deleteObject } from 'firebase/storage';
import { analytics, db, storage } from '../../../../init-firebase-auth';
import { logEvent } from 'firebase/analytics';

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
    const userFolderRef = ref(storage, `checkin-imgs/${userId}`);

    const recursiveDelete = async (folderRef: any) => {
      const listResponse = await listAll(folderRef);
      const filePromises = listResponse.items.map((item) => deleteObject(item));
      const folderPromises = listResponse.prefixes.map((subFolder) => recursiveDelete(subFolder));
      await Promise.all([...filePromises, ...folderPromises]);
    };
    await recursiveDelete(userFolderRef);
  }

  private async wipeUserFirestore(userId: string) {
    const batch = writeBatch(db);

    const checkinsRef = collection(db, 'checkins');
    const userRef = collection(db, 'user');
    const qCheckins = query(checkinsRef, where('userId', '==', userId));
    const qUser = query(userRef, where('userId', '==', userId));

    const [checkinsSnap, startSnap] = await Promise.all([
      getDocs(qCheckins),
      getDocs(qUser)
    ]);

    checkinsSnap.forEach((doc) => {
      batch.delete(doc.ref);
    });
    startSnap.forEach((doc) => {
      batch.delete(doc.ref);
    });

    const profileRef = doc(db, 'users', userId);
    batch.delete(profileRef);
    await batch.commit();

    localStorage.removeItem("user-store");
  }
}
