import React, { useEffect, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { uploadImage } from '../../image-manager/image-compressor.manager';
import { Card } from '../Card';
import { SectionHeader } from '../section-header';
import { Trans } from 'react-i18next';

interface ImageUploaderProps {
  userId: string;
  checkinId: string;
  onChange: (urls: string[]) => void;
  value?: string[];
  error?: string;
}

const SLOTS = ['front', 'back', 'side'] as const;

export const ImageUploader = ({ userId, checkinId, onChange, value, error }: ImageUploaderProps) => {
  const [fileSlots, setFileSlots] = useState<Record<string, File | null>>({
    front: null, back: null, side: null
  });

  const [remoteUrls, setRemoteUrls] = useState<Record<string, string | null>>({
    front: null, back: null, side: null
  });

  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);

  useEffect(() => {
    if (value && value.length > 0) {
      const existing: Record<string, string | null> = { front: null, back: null, side: null };

      value.forEach((url) => {
        if (url.includes('_front.')) existing.front = url;
        if (url.includes('_back.')) existing.back = url;
        if (url.includes('_side.')) existing.side = url;
      });

      setRemoteUrls(existing);
      if (value.length === 3) setUploadComplete(true);
    }
  }, [value]);

  useEffect(() => {
    const newPreviews: Record<string, string> = {};
    Object.entries(fileSlots).forEach(([key, file]) => {
      if (file) newPreviews[key] = URL.createObjectURL(file);
    });
    setPreviews(newPreviews);
    return () => Object.values(newPreviews).forEach((url) => URL.revokeObjectURL(url));
  }, [fileSlots]);

  const handleFileChange = async (slot: string, event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      setUploadComplete(false);
      const originalFile = event.target.files[0];
      const renamedFile = new File([originalFile], `${slot}.jpg`, { // TODO change this, probaly that's why HEIC is not working
        type: originalFile.type,
        lastModified: originalFile.lastModified
      });
      setFileSlots((prev) => ({ ...prev, [slot]: renamedFile }));
      const url = await uploadImage([renamedFile], userId, checkinId);
      const newRemoteUrls = { ...remoteUrls, [slot]: url[0] };
      setRemoteUrls(newRemoteUrls);
      console.log(Object.entries(newRemoteUrls).map(([key, value]) => value || '').filter(Boolean) as string[]);
      onChange(Object.entries(newRemoteUrls).map(([key, value]) => value || '').filter(Boolean) as string[]);
      setUploadComplete(true);
    }
  };

  const removeFile = (slot: string) => {
    setFileSlots((prev) => ({ ...prev, [slot]: null }));
    setRemoteUrls((prev) => ({ ...prev, [slot]: null }));
    setUploadComplete(false);
  };

  const getDisplayUrl = (slot: string) => previews[slot] || remoteUrls[slot];

  return (
    <Card>
      <SectionHeader><Trans i18nKey="section.requiredPhotos">Required Photos</Trans></SectionHeader>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        {SLOTS.map((slot) => {
          const displayUrl = getDisplayUrl(slot);

          return (
            <div key={slot} className="relative aspect-square w-full max-w-[280px] mx-auto sm:max-w-none">
              <div
                className="absolute top-3 left-1/2 -translate-x-1/2 z-10 flex items-center justify-center px-4 h-7 bg-black/40 backdrop-blur-md rounded-full border border-white/10">
                <span className="text-xs uppercase tracking-widest font-bold text-white shadow-sm">
                  {slot}
                </span>
              </div>

              {displayUrl ? (
                <div className="relative h-full w-full">
                  <img
                    src={displayUrl}
                    alt={slot}
                    className="w-full h-full object-cover rounded-2xl border-2 border-gray-100 dark:border-slate-700 shadow-md"
                  />
                  <button
                    onClick={() => removeFile(slot)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 shadow-xl hover:bg-red-600 transition-transform z-20"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <label
                  className="flex flex-col items-center justify-center h-full w-full border-2 border-dashed rounded-2xl cursor-pointer bg-gray-50/50 dark:bg-slate-800/50 hover:bg-gray-100 dark:hover:bg-slate-800 border-gray-300 dark:border-slate-700 transition-all group">
                  <div
                    className="p-4 rounded-full bg-white dark:bg-slate-700 shadow-sm group-hover:scale-110 transition-transform">
                    <Upload className="text-blue-500" size={28} />
                  </div>
                  <span className="mt-3 text-sm text-gray-500 font-semibold"><Trans
                    i18nKey="section.upload" /> {slot}</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleFileChange(slot, e)}
                    accept="image/*"
                  />
                </label>
              )}
            </div>
          );
        })}
      </div>
      {error && (
        <p className="text-red-500 text-xs mt-1"><Trans i18nKey="errors.image.invalid" /></p>
      )}
    </Card>
  );
};
