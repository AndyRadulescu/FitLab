import imageCompression from 'browser-image-compression';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../../init-firebase-auth';

async function compressImage(imageFiles: File[]): Promise<File[]> {
  const options = {
    maxWidthOrHeight: 1080,
    useWebWorker: true,
    initialQuality: 0.8,
    alwaysKeepType: false,
    fileType: 'image/jpeg'
  };

  try {
    return await Promise.all(
      imageFiles.map(file => imageCompression(file, options))
    );
  } catch (error) {
    console.log(error);
    console.error('Compression error:', error);
  }
  return [];
}

export function uploadToFirebase(compressedFiles: File[], userId: string, checkinId: string) {
  if (!compressedFiles || compressedFiles.length === 0) throw Error('no files uploaded');
  const uploadPromises = compressedFiles.map(async (file, index) => {
    const storageRef = ref(storage, `checkin-imgs/${userId}/${checkinId}/${file.name}`);

    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  });

  return Promise.all(uploadPromises);
};

export async function uploadImage(files: File[], userId: string, checkinId: string) {
  const compressedImageFiles = await compressImage(files);
  return uploadToFirebase(compressedImageFiles, userId, checkinId);
}
