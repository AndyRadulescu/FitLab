import React, { useState } from 'react';
import { CheckCircle2, Loader2, Upload, X } from 'lucide-react';
import { uploadImage } from '../../image-manager/image-compressor.manager';

interface ImageUploaderProps {
  userId?: string;
  onChange: (urls: string[]) => void;
  value?: string[];
}

export const ImageUploader = ({ userId, onChange, value }: ImageUploaderProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);

  if (value) {
    console.log(value);
  }

  if (!userId) {
    return <div>Loading...</div>;
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selected = Array.from(event.target.files);
      if (files.length + selected.length > 3) {
        alert('You can only upload 3 images max.');
        return;
      }
      setFiles((prev) => [...prev, ...selected]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const startUpload = async () => {
    setIsUploading(true);
    try {
      const urls = await uploadImage(files, userId);
      onChange(urls);
      setUploadComplete(true);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Something went wrong during upload.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full p-6 border rounded-xl bg-white dark:bg-slate-900 shadow-sm">
      <h2 className="text-xl font-bold mb-4">Required Images (3)</h2>

      <div className="space-y-3 mb-6 text-gray-700">
        {files.map((file, i) => (
          <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm truncate max-w-[200px]">{file.name}</span>
            <button onClick={() => removeFile(i)} className="text-red-500 hover:text-red-700">
              <X size={18} />
            </button>
          </div>
        ))}

        {files.length < 3 && (
          <label
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
            <Upload className="text-gray-400 mb-2" />
            <span className="text-sm text-gray-500">Click to add {3 - files.length} more</span>
            <input type="file" multiple className="hidden" onChange={handleFileChange} accept="image/*" />
          </label>
        )}
      </div>

      {!uploadComplete ? (
        <button
          onClick={startUpload}
          disabled={files.length !== 3 || isUploading}
          className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-semibold disabled:bg-gray-300 flex items-center justify-center gap-2"
        >
          {isUploading ? <Loader2 className="animate-spin" /> : null}
          {isUploading ? 'Processing & Uploading...' : 'Upload & Continue'}
        </button>
      ) : (
        <div className="flex items-center justify-center gap-2 text-green-600 font-bold py-3">
          <CheckCircle2 /> Upload Successful
        </div>
      )}
    </div>
  );
};
