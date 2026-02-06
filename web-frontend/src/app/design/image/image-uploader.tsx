import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Upload, X } from 'lucide-react';
import { uploadImage } from '../../image-manager/image-compressor.manager';
import { Card } from '../Card';
import { SectionHeader } from '../section-header';
import { Trans } from 'react-i18next';

interface ImageUploaderProps {
  userId?: string;
  onChange: (urls: string[]) => void;
  value?: string[];
}

const SLOTS = ['front', 'back', 'side'] as const;

export const ImageUploader = ({ userId, onChange, value }: ImageUploaderProps) => {
  const [fileSlots, setFileSlots] = useState<Record<string, File | null>>({
    front: null,
    back: null,
    side: null
  });

  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);

  useEffect(() => {
    const newPreviews: Record<string, string> = {};

    Object.entries(fileSlots).forEach(([key, file]) => {
      if (file) newPreviews[key] = URL.createObjectURL(file);
    });
    setPreviews(newPreviews);
    return () => {
      Object.values(newPreviews).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [fileSlots]);

  if (!userId) return <div className="p-6 text-center animate-pulse">Loading...</div>;

  const handleFileChange = (slot: string, event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setFileSlots((prev) => ({ ...prev, [slot]: file }));
    }
  };

  const removeFile = (slot: string) => {
    setFileSlots((prev) => ({ ...prev, [slot]: null }));
  };

  const startUpload = async () => {
    const filesArray = Object.values(fileSlots).filter((f): f is File => f !== null);
    if (filesArray.length !== 3) return;

    setIsUploading(true);
    try {
      const urls = await uploadImage(filesArray, userId);
      onChange(urls);
      setUploadComplete(true);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const allFilesSelected = Object.values(fileSlots).every((f) => f !== null);

  return (
    <Card>
      <SectionHeader><Trans i18nkey="section.requiredPhotos">Required Photos</Trans></SectionHeader>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        {SLOTS.map((slot) => (
          <div key={slot} className="relative aspect-square w-full max-w-[280px] mx-auto sm:max-w-none">
            <div
              className="absolute top-3 left-1/2 -translate-x-1/2 z-10 flex items-center justify-center px-4 py-1.5 bg-black/40 backdrop-blur-md rounded-full border border-white/10">
              <span className="text-xs uppercase tracking-widest font-bold text-white shadow-sm">
                {slot}
              </span>
            </div>

            {fileSlots[slot] ? (
              <div className="relative h-full w-full">
                <img
                  src={previews[slot]}
                  alt={slot}
                  className="w-full h-full object-cover rounded-2xl border-2 border-gray-100 dark:border-slate-700 shadow-md"
                />
                <button
                  onClick={() => removeFile(slot)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 shadow-xl hover:bg-red-600 transition-transform active:scale-90 z-20"
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
                <span className="mt-3 text-sm text-gray-500 font-semibold"><Trans i18nKey="section.upload"/> {slot}</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => handleFileChange(slot, e)}
                  accept="image/*"
                />
              </label>
            )}
          </div>
        ))}
      </div>

      {!uploadComplete ? (
        <button
          onClick={startUpload}
          disabled={!allFilesSelected || isUploading}
          className="w-full py-4 px-4 bg-indigo-600 text-white rounded-xl font-bold disabled:bg-gray-200 dark:disabled:bg-slate-800 dark:disabled:text-slate-500 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          {isUploading ? <Loader2 className="animate-spin" /> : null}
          {isUploading ? <Trans i18nKey="section.optimizing"/> : <Trans i18nKey="section.uploading"/>}
        </button>
      ) : (
        <div
          className="flex items-center justify-center gap-3 text-emerald-600 font-bold py-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800">
          <CheckCircle2 size={20} /> <Trans i18nKey="section.uploadComplete"/>
        </div>
      )}
    </Card>
  );
};
