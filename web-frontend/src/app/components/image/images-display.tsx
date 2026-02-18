import React, { useEffect, useState } from 'react';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import { SLOTS } from '../../core/checkin-strategy/checkin-strategy';
import { CameraOff, Loader2 } from 'lucide-react';
import { imagePath } from '../../image-manager/image-path';

const SmallImage = ({ path, label }: { path: string, label: string }) => {
  const [url, setUrl] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const getUrl = async () => {
      try {
        const downloadUrl = await getDownloadURL(ref(getStorage(), path));
        setUrl(downloadUrl);
      } catch (e) {
        console.error('Missing:', path);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    getUrl();
  }, [path]);

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative h-15 w-7 sm:h-20 sm:w-13 lg:h-30 lg:w-17 overflow-hidden rounded-lg bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 flex items-center justify-center">
        {loading && (
          <Loader2 className="absolute h-4 w-4 animate-spin text-blue-500 opacity-50" />
        )}

        {error && !loading && (
          <CameraOff className="h-4 w-4 text-gray-300" />
        )}

        {url && (
          <img
            src={url} alt={label} onLoad={() => setLoading(false)}
            className={`h-full w-full object-cover transition-opacity duration-300 ${
              loading ? 'opacity-0' : 'opacity-100'
            }`}
          />
        )}
      </div>
    </div>
  );
};

export function ImagesDisplay({ checkinId, userId }: { checkinId: string, userId: string }) {
  return (
    <div className="flex gap-1 sm:gap-4">
      {SLOTS.map((slot) => (
        <SmallImage
          key={slot}
          path={imagePath(userId, checkinId, slot, true)}
          label={slot}
        />
      ))}
    </div>
  );
}
