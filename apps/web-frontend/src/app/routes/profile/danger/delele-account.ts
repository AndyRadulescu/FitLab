import { DeleteUserAccount } from './delete-all-strategy';
import { deleteUser, getAuth } from 'firebase/auth';
import { TFunction } from 'i18next';
import { handleAuthErrors } from '../../../core/error-handler';
import firebase from 'firebase/compat/app';
import { userStore } from '../../../store/user.store';
import { checkinStore } from '../../../store/checkin.store';
import AuthError = firebase.auth.AuthError;

export const deleteAccount = async (userId: string, t: TFunction<'translation', undefined>) => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) return;
  try {
    await new DeleteUserAccount().deleteAllUserData(userId);
    await deleteUser(user);
    userStore.getState().delete();
    checkinStore.getState().delete();
  } catch (err: AuthError | any) {
    console.log(err);
    handleAuthErrors(err, t);
  }
};
