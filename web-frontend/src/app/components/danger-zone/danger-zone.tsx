import { Trans, useTranslation } from 'react-i18next';
import { Button } from '../design/button';
import { SectionHeader } from '../section-header';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { Card } from '../design/card';
import { userStore } from '../../store/user.store';
import { deleteAccount } from '../../routes/profile/danger/delele-account';
import { useNavigate } from 'react-router-dom';
import { assertAuthenticated } from '../../shared/user.guard';

export function DangerZone() {
  const user = userStore(state => state.user);
  const setUser = userStore(state => state.setUser);
  const [isShown, setShown] = useState<boolean>(false);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const removeAccount = async () => {
    assertAuthenticated(navigate, user);
    if (!window.confirm(t('danger.delete.account'))) {
      return;
    }
    const string = prompt(t('danger.type'));
    if (string !== 'delete account') {
      return;
    }
    await deleteAccount(user!.uid, t);
    setUser(undefined);
    navigate('/auth/login', { replace: true });
  };

  return (
    <>
      <div className="cursor-pointer" onClick={() => setShown(!isShown)}>
        <SectionHeader><Trans i18nKey="profile.danger" /> {isShown ? <ChevronUp /> : <ChevronDown />}</SectionHeader>
      </div>
      {isShown && <Card isDanger={true}>
        <div className="flex flex-col md:flex-row gap-4 aling-center justify-center w-full">
          <div className="flex-2">
            <h3 className="text-lg"><Trans i18nKey="profile.deleteAccount" /></h3>
            <p className="text-md"><Trans i18nKey="profile.delete.info"/></p>
          </div>
          <div className="flex-1 flex justify-center items-center" onClick={removeAccount}>
            <Button type="danger"><Trans i18nKey="profile.deleteAccount" /></Button>
          </div>
        </div>
      </Card>
      }
    </>
  );
}
