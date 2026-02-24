import { Card } from '../../../components/design/card';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { useState } from 'react';

interface CheckInBannerProps {
  isVisible: boolean;
}

export function CheckInBanner({ isVisible }: CheckInBannerProps) {
  const { t } = useTranslation();
  const [show, setShow] = useState(true);

  if (!isVisible || !show) return null;

  return (
    <Card className="mb-4 bg-orange-100 border-orange-500 text-orange-800 p-4 relative pr-12">
      <p className="font-bold">{t('checkin.alreadyDone')}</p>
      <p>{t('checkin.onlyOnce')}</p>
      <button
        type="button"
        onClick={() => setShow(false)}
        className="absolute top-2 right-2 p-2 hover:bg-orange-200 rounded-full transition-colors"
        aria-label="Close banner"
      >
        <X size={20} />
      </button>
    </Card>
  );
}
