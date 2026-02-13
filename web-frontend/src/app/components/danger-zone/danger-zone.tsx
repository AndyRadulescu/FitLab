import { Card } from '../design/card';
import { Trans } from 'react-i18next';
import { Button } from '../design/button';
import { SectionHeader } from '../section-header';

export function DangerZone() {
  return (
    <>
      <SectionHeader><Trans i18nKey="profile.danger">Danger zone</Trans></SectionHeader>
      <Card isDanger={true}>
        <div className="flex column aling-center justify-center w-full">
          <div className="flex-2">
            <h3 className="text-lg">Delete account</h3>
            <p className="text-md">Once you delete this account, there is no going back, all data will be lost.</p>
          </div>
          <div className="flex-1">
            <Button type="danger">Delete account</Button>
          </div>
        </div>
      </Card>
    </>
  );
}
