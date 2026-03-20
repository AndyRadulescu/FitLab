import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useCheckinImages } from './use-checkin-images';
import { getDownloadURL, ref } from 'firebase/storage';

// Mock Firebase storage
vi.mock('firebase/storage', () => ({
  getDownloadURL: vi.fn(),
  ref: vi.fn(),
}));

vi.mock('../../../init-firebase-auth', () => ({
  storage: {},
}));

describe('useCheckinImages', () => {
  const mockCheckin = { id: 'c1', userId: 'u1' };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not fetch if isOpen is false', async () => {
    const { result } = renderHook(() => useCheckinImages(mockCheckin, false));
    
    expect(result.current.loadingImages).toBe(false);
    expect(getDownloadURL).not.toHaveBeenCalled();
  });

  it('should fetch images on mount when isOpen is true', async () => {
    (getDownloadURL as any).mockResolvedValue('http://example.com/image.jpg');

    const { result } = renderHook(() => useCheckinImages(mockCheckin, true));
    
    expect(result.current.loadingImages).toBe(true);

    await waitFor(() => expect(result.current.loadingImages).toBe(false));

    expect(Object.keys(result.current.imgUrls).length).toBeGreaterThan(0);
    expect(result.current.imgUrls['front']).toBe('http://example.com/image.jpg');
  });

  it('should handle partial fetch failures', async () => {
    (getDownloadURL as any).mockImplementation((storageRef: any) => {
      // Corrected logic: Ensure the name of the file is included in the error for clarity if needed.
      if (storageRef?.toString().includes('back')) {
        return Promise.reject(new Error('Not found'));
      }
      return Promise.resolve('http://example.com/image.jpg');
    });

    const { result } = renderHook(() => useCheckinImages(mockCheckin, true));

    await waitFor(() => expect(result.current.loadingImages).toBe(false));

    // 'front' view should be there, 'back' might be missing
    expect(result.current.imgUrls['front']).toBe('http://example.com/image.jpg');
  });
});
