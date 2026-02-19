import { collection, getDocs, query, writeBatch, where } from 'firebase/firestore';
import { deleteObject, listAll, ref } from 'firebase/storage';
import { analytics, db, storage } from '../../../../init-firebase-auth';
import { logEvent } from 'firebase/analytics';
import { CHECKINS_STORAGE, CHECKINS_TABLE, USERS_TABLE, WEIGHT_TABLE } from '../../../firestore/constants';

export class DeleteUserAccount {
  async deleteAllUserData(userId: string) {
    if (!userId) throw new Error('No User ID provided for deletion');

    try {
      await this.wipeUserStorage(userId);

      console.log('enters here');
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
    const basePath = `${CHECKINS_STORAGE}/${userId}`
    const userFolderRef = ref(storage, basePath);

    const recursiveDelete = async (folderRef: any) => {
      console.log(`Deleting ${folderRef.fullPath}`);
      try {
        const listResponse = await listAll(folderRef);
        console.log(listResponse);
        const filePromises = listResponse.items.map((item) => deleteObject(item));
        const folderPromises = listResponse.prefixes.map((subFolder) => {
          console.log(subFolder);
          return recursiveDelete(subFolder)
        });

        await Promise.all([...filePromises, ...folderPromises]);
      } catch (error: any) {
        console.log(error);
        if (error.code === 'storage/object-not-found') {
          console.log(`No storage found at ${folderRef.fullPath}, skipping wipe.`);
          return;
        }
        throw error;
      }
    };

    await recursiveDelete(userFolderRef);
  }

  private async wipeUserFirestore(userId: string) {
    const batch = writeBatch(db);

    const snaps = await Promise.all([
      getDocs(query(collection(db, CHECKINS_TABLE), where('userId', '==', userId))),
      getDocs(query(collection(db, USERS_TABLE), where('userId', '==', userId))),
      getDocs(query(collection(db, WEIGHT_TABLE), where('userId', '==', userId)))
    ]);

    snaps.forEach(snap => {
      snap.forEach(doc => batch.delete(doc.ref));
    });

    await batch.commit();
  }
}
