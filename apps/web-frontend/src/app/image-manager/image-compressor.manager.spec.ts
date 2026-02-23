import { describe, it, expect, vi, beforeEach } from 'vitest';
import imageCompression from 'browser-image-compression';
import { ref, uploadBytes } from 'firebase/storage';
import { uploadImage, uploadToFirebase } from './image-compressor.manager';

vi.mock('browser-image-compression', () => ({
  default: vi.fn((file) => Promise.resolve(file)),
}));

vi.mock('firebase/storage', () => ({
  ref: vi.fn(),
  uploadBytes: vi.fn(() => Promise.resolve()),
}));

vi.mock('../../init-firebase-auth', () => ({
  storage: {}
}));

describe('Image Upload Service', () => {
  const mockFiles = [
    new File(['content'], 'test1.jpg', { type: 'image/jpeg' }),
    new File(['content'], 'test2.jpg', { type: 'image/jpeg' })
  ];
  const userId = 'user-123';
  const checkinId = 'checkin-456';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('uploadToFirebase', () => {
    it('should throw error if no files are provided', () => {
      expect(() => uploadToFirebase([], userId, checkinId)).toThrow('no files uploaded');
    });

    it('should call uploadBytes for each file', async () => {
      await uploadToFirebase(mockFiles, userId, checkinId);

      expect(ref).toHaveBeenCalledTimes(2);
      expect(uploadBytes).toHaveBeenCalledTimes(2);
    });

    it('should return an array of filenames on success', async () => {
      const result = await uploadToFirebase(mockFiles, userId, checkinId);
      expect(result).toEqual(['test1.jpg', 'test2.jpg']);
    });
  });

  describe('uploadImage (Integration)', () => {
    it('should compress images before uploading', async () => {
      await uploadImage(mockFiles, userId, checkinId);

      expect(imageCompression).toHaveBeenCalledTimes(2);
      expect(uploadBytes).toHaveBeenCalledTimes(2);
    });

    it('should handle compression failure gracefully', async () => {
      (imageCompression as any).mockRejectedValueOnce(new Error('CPU Melted'));

      const consoleSpy = vi.spyOn(console, 'error').mockReturnValue();
      await expect(uploadImage(mockFiles, userId, checkinId)).rejects.toThrow('no files uploaded');
      expect(consoleSpy).toHaveBeenCalledWith('Compression error:', expect.any(Error));
    });
  });
});
