import { DeleteUserAccount } from './delete-all-strategy';
import { deleteUser, getAuth } from 'firebase/auth';
import { TFunction } from 'i18next';

export const deleteAccount = async (userId: string, t: TFunction<'translation', undefined>) => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) {
    return;
  }
  try {
    await deleteUser(user);
    await new DeleteUserAccount().deleteAllUserData(userId);
  } catch (e) {
    console.log(e);
    alert(t('danger.account.error'));
  }
};
