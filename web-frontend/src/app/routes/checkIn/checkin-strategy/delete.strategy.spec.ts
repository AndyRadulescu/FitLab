import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DeleteCheckInStrategy } from './delete.strategy';
import { doc, deleteDoc } from 'firebase/firestore';
import { ref, listAll, deleteObject } from 'firebase/storage';
import { logEvent } from 'firebase/analytics';
import { getCheckinPath } from '../../../image-manager/image-path';

const mockDeleteCheckin = vi.fn();

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  deleteDoc: vi.fn(),
}));

vi.mock('firebase/storage', () => ({
  ref: vi.fn(),
  listAll: vi.fn(),
  deleteObject: vi.fn(),
}));

vi.mock('../../../image-manager/image-path', () => ({
  getCheckinPath: vi.fn((uid, cid) => `users/${uid}/checkins/${cid}`),
}));

vi.mock('../../../../init-firebase-auth', () => ({
  db: { type: 'firestore-instance' },
  storage: { type: 'storage-instance' },
  analytics: { type: 'analytics-instance' }
}));

vi.mock('firebase/analytics', () => ({
  logEvent: vi.fn()
}));

vi.mock('../../../store/checkin.store', () => ({
  checkinStore: {
    getState: vi.fn(() => ({
      deleteCheckin: mockDeleteCheckin
    }))
  }
}));

global.alert = vi.fn();

describe('DeleteCheckInStrategy', () => {
  let strategy: DeleteCheckInStrategy;

  beforeEach(() => {
    vi.clearAllMocks();
    strategy = new DeleteCheckInStrategy();
  });

  it('should delete all files in storage and the firestore document', async () => {
    const userId = 'user-123';
    const checkinId = 'checkin-456';
    const payload = { id: checkinId };

    const mockFiles = {
      items: [
        { name: 'img1.jpg' },
        { name: 'img2.jpg' }
      ]
    };
    (listAll as any).mockResolvedValue(mockFiles);
    (deleteObject as any).mockResolvedValue(undefined);
    (deleteDoc as any).mockResolvedValue(undefined);

    await strategy.checkIn({ data: payload as any, userId });

    expect(getCheckinPath).toHaveBeenCalledWith(userId, checkinId);
    expect(ref).toHaveBeenCalledWith(expect.anything(), `users/${userId}/checkins/${checkinId}`);
    expect(listAll).toHaveBeenCalled();
    expect(deleteObject).toHaveBeenCalledTimes(2);
    expect(doc).toHaveBeenCalledWith(expect.anything(), 'checkins', checkinId);
    expect(deleteDoc).toHaveBeenCalled();
    expect(mockDeleteCheckin).toHaveBeenCalledWith(checkinId);
    expect(logEvent).toHaveBeenCalledWith(expect.anything(), 'delete-checkin');
  });

  it('should throw error if checkin ID is missing', async () => {
    await expect(strategy.checkIn({ data: {} as any, userId: 'u1' }))
      .rejects.toThrow('Missing Check-in ID for deletion');
  });

  it('should handle errors, log them to analytics, and show an alert', async () => {
    const errorMsg = 'Firebase Error';
    (listAll as any).mockRejectedValue({ message: errorMsg });
    await strategy.checkIn({ data: { id: 'error-id' } as any, userId: 'u1' });
    expect(logEvent).toHaveBeenCalledWith(
      expect.anything(),
      'delete-checkin-error',
      errorMsg
    );

    expect(global.alert).toHaveBeenCalledWith('Failed to delete check-in');
  });

  it('should continue to delete doc even if file deletion fails (Promise.allSettled behavior)', async () => {
    const mockFiles = { items: [{ name: 'img1.jpg' }] };
    (listAll as any).mockResolvedValue(mockFiles);
    (deleteObject as any).mockRejectedValue(new Error('File locked')); // This fails
    (deleteDoc as any).mockResolvedValue(undefined); // This succeeds

    await strategy.checkIn({ data: { id: 'id-1' } as any, userId: 'u1' });

    expect(deleteDoc).toHaveBeenCalled();
    expect(mockDeleteCheckin).toHaveBeenCalledWith('id-1');
  });
});
