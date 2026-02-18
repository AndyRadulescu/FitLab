import { DeleteUserAccount } from './delete-all-strategy';
import { deleteUser, getAuth } from 'firebase/auth';
import { TFunction } from 'i18next';
import { handleAuthErrors } from '../../../core/error-handler';
import firebase from 'firebase/compat/app';
import AuthError = firebase.auth.AuthError;
import { userStore } from '../../../store/user.store';

export const deleteAccount = async (userId: string, t: TFunction<'translation', undefined>) => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) {
    return;
  }
  try {
    await deleteUser(user);
    await new DeleteUserAccount().deleteAllUserData(userId);
    userStore.getState().delete()
  } catch (err: AuthError | any) {
    console.log(err);
    handleAuthErrors(err, t);
  }
};
