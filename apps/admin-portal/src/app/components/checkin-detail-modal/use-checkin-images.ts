import { useState, useEffect } from 'react';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../../../init-firebase-auth';
import { imagePath, SLOTS } from '@my-org/core';

export const useCheckinImages = (checkin: any, isOpen: boolean) => {
  const [imgUrls, setImgUrls] = useState<Record<string, string>>({});
  const [loadingImages, setLoadingImages] = useState(false);

  useEffect(() => {
    const fetchImages = async () => {
      if (!checkin || !isOpen) return;
      setLoadingImages(true);
      const urls: Record<string, string> = {};
      
      const fetchPromises = SLOTS.map(async (slot) => {
        try {
          const path = imagePath(checkin.userId, checkin.id, slot);
          const url = await getDownloadURL(ref(storage, path));
          urls[slot] = url;
        } catch (e) {
          console.warn(`Failed to fetch image for slot ${slot}:`, e);
        }
      });

      await Promise.all(fetchPromises);
      setImgUrls(urls);
      setLoadingImages(false);
    };

    fetchImages();
  }, [checkin, isOpen]);

  return { imgUrls, loadingImages };
};
