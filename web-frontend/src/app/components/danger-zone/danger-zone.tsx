import { Card } from '../design/card';
import { Trans } from 'react-i18next';
import { Button } from '../design/button';
import { SectionHeader } from '../section-header';

export function DangerZone() {
  return (
    <>
      <SectionHeader><Trans i18nKey="profile.danger"/></SectionHeader>
      <Card isDanger={true}>
        <div className="flex flex-col md:flex-row gap-4 aling-center justify-center w-full">
          <div className="flex-2">
            <h3 className="text-lg"><Trans i18nKey="profile.deleteAccount"/></h3>
            <p className="text-md"><Trans i18nKey="profile.delete.info">tst</Trans></p>
          </div>
          <div className="flex-1 flex justify-center items-center">
            <Button type="danger"><Trans i18nKey="profile.deleteAccount"/></Button>
          </div>
        </div>
      </Card>
    </>
  );
}
