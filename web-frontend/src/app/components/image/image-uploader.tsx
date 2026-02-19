import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Upload, X } from 'lucide-react';
import { uploadImage } from '../../image-manager/image-compressor.manager';
import { Card } from '../design/card';
import { Trans } from 'react-i18next';
import { SLOTS } from '../../core/checkin-strategy/checkin-strategy';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import { imagePath } from '../../image-manager/image-path';

interface ImageUploaderProps {
  userId: string;
  checkinId: string;
  onChange: (urls: string[]) => void;
  isEdit?: boolean;
  error?: string;
}

export const ImageUploader = ({ userId, checkinId, onChange, isEdit, error }: ImageUploaderProps) => {
  const [fileSlots, setFileSlots] = useState<Record<string, File | null>>({
    front: null, back: null, side: null
  });

  const [remoteUrls, setRemoteUrls] = useState<Record<string, string | null>>({
    front: null, back: null, side: null
  });

  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [uploadingSlots, setUploadingSlots] = useState<Record<string, boolean>>({
    front: false, back: false, side: false
  });

  useEffect(() => {
    const fetchAllUrls = async () => {
      if (!isEdit || !userId || !checkinId) return;
      const existing: Record<string, string | null> = { front: null, back: null, side: null };

      try {
        const fetchPromises = SLOTS.map(async (slot) => {
          try {
            const path = imagePath(userId, checkinId, slot);
            const downloadUrl = await getDownloadURL(ref(getStorage(), path));
            return { slot, url: downloadUrl };
          } catch (error) {
            console.warn(`Could not fetch storage URL for slot: ${slot}`, error);
            return { slot, url: null };
          }
        });

        const results = await Promise.all(fetchPromises);
        results.forEach(({ slot, url }) => {
          if (slot in existing) {
            existing[slot] = url;
          }
        });

        setRemoteUrls(existing);
      } catch (err) {
        console.error("Error in image sync process:", err);
      }
    };

    fetchAllUrls();
  }, []);

  useEffect(() => {
    const remoteUrlsArray = SLOTS.map(s => remoteUrls[s]).filter(Boolean) as string[];
    if (remoteUrlsArray.length > 0) {
      onChange(remoteUrlsArray);
    }
  }, [remoteUrls, onChange]);

  const handleFileChange = async (slot: string, event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      const originalFile = event.target.files[0];
      const renamedFile = new File([originalFile], `${slot}`, {
        type: originalFile.type,
        lastModified: originalFile.lastModified
      });
      setFileSlots((prev) => ({ ...prev, [slot]: originalFile }));
      setUploadingSlots(prev => ({ ...prev, [slot]: true }));

      try {
        const fileName = await uploadImage([renamedFile], userId, checkinId);
        setRemoteUrls((prev) => ({ ...prev, [slot]: fileName[0] }));
      } catch (err) {
        console.error('Upload failed', err);
      } finally {
        setUploadingSlots(prev => ({ ...prev, [slot]: false }));
      }
    }
  };

  const removeFile = (slot: string) => {
    setFileSlots((prev) => ({ ...prev, [slot]: null }));
    setRemoteUrls((prev) => ({ ...prev, [slot]: null }));
  };

  useEffect(() => {
    const newPreviews: Record<string, string> = {};
    Object.entries(fileSlots).forEach(([key, file]) => {
      if (file) newPreviews[key] = URL.createObjectURL(file);
    });
    setPreviews(newPreviews);
    return () => Object.values(newPreviews).forEach((url) => URL.revokeObjectURL(url));
  }, [fileSlots]);

  const getDisplayUrl = (slot: string) => previews[slot] || remoteUrls[slot];

  return (
    <Card>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        {SLOTS.map((slot) => {
          const displayUrl = getDisplayUrl(slot);

          return (
            <div key={slot} className="relative aspect-square w-full max-w-[280px] mx-auto sm:max-w-none">
              <div
                className="absolute top-3 left-1/2 -translate-x-1/2 z-10 flex items-center justify-center px-4 h-7 bg-black/40 backdrop-blur-md rounded-full border border-white/10">
                <span className="text-xs uppercase tracking-widest font-bold text-white shadow-sm">
                  <Trans i18nKey={`image.upload.${slot}`}/>
                </span>
              </div>

              {displayUrl ? (
                <div className="relative h-full w-full group">
                  <img
                    src={displayUrl}
                    alt={slot}
                    className={`w-full h-full object-cover rounded-2xl border-2 shadow-md transition-all ${
                      uploadingSlots[slot] ? 'brightness-50 blur-[2px]' : 'border-gray-100 dark:border-slate-700'
                    }`}
                  />

                  {uploadingSlots[slot] && (
                    <div
                      className="absolute inset-0 flex flex-col items-center justify-center z-30 bg-black/20 rounded-2xl backdrop-blur-[1px]">
                      <div
                        className="bg-white/90 dark:bg-slate-900/90 p-3 rounded-full shadow-lg animate-in zoom-in duration-300">
                        <Loader2 className="text-blue-500 animate-spin" size={24} />
                      </div>
                      <span className="mt-2 text-[10px] font-bold text-white uppercase tracking-tighter drop-shadow-md">
                        <Trans i18nKey="section.optimizing" />
                      </span>
                    </div>
                  )}

                  {!uploadingSlots[slot] && remoteUrls[slot] && (
                    <div
                      className="absolute top-2 right-8 bg-emerald-500 text-white rounded-full p-1 shadow-lg animate-in fade-in zoom-in duration-500">
                      <CheckCircle2 size={14} />
                    </div>
                  )}

                  {!uploadingSlots[slot] && (
                    <button
                      onClick={() => removeFile(slot)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 shadow-xl hover:bg-red-600 transition-transform hover:scale-110 active:scale-90 z-20"
                    >
                      <X size={18} />
                    </button>
                  )}
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
