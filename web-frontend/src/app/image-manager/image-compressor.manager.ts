import imageCompression from 'browser-image-compression';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

async function compressImage(imageFiles: File[]): Promise<File[]> {
  const options = {
    maxWidthOrHeight: 1080,
    useWebWorker: true,
    initialQuality: 0.8,
    fileType: 'image/jpeg'
  };

  try {
    console.log(imageFiles);
    return await Promise.all(
      imageFiles.map(file => imageCompression(file, options))
    );
  } catch (error) {
    console.log(error);
    console.error('Compression error:', error);
  }
  return [];
}

export function uploadToFirebase(compressedFiles: File[], userId: string) {
  const storage = getStorage();

  if (!compressedFiles || compressedFiles.length === 0) throw Error('no files uploaded');
  const uploadPromises = compressedFiles.map(async (file, index) => {
    const storageRef = ref(storage, `checkin-imgs/${userId}/${Date.now()}_${index}.jpg`);

    const snapshot = await uploadBytes(storageRef, file);
    const fullResUrl = await getDownloadURL(snapshot.ref);

    console.log(snapshot);
    console.log(fullResUrl);

    return fullResUrl;
  });

  return Promise.all(uploadPromises);
};

export async function uploadImage(files: File[], userId: string) {
  const compressedImageFiles = await compressImage(files);
  return uploadToFirebase(compressedImageFiles, userId);
}
