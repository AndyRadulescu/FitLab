import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DeleteCheckInStrategy } from './delete.strategy';
import { doc, runTransaction } from 'firebase/firestore';
import { ref, listAll, deleteObject } from 'firebase/storage';
import { logEvent } from 'firebase/analytics';
import { CHECKINS_TABLE, getCheckinPath, WEIGHT_TABLE } from '@my-org/core';

const mockDeleteCheckin = vi.fn();
const mockDeleteWeight = vi.fn();

const mockTransaction = {
  delete: vi.fn(),
  set: vi.fn(),
  update: vi.fn(),
};

vi.mock('firebase/firestore', () => ({
  doc: vi.fn((...args) => {
    if (args.length === 3) return { id: args[2], table: args[1] };
    return { id: 'random-id' };
  }),
  runTransaction: vi.fn(async (db, cb) => cb(mockTransaction)),
}));

vi.mock('firebase/storage', () => ({
  ref: vi.fn(),
  listAll: vi.fn(),
  deleteObject: vi.fn(),
}));

vi.mock('@my-org/core', () => ({
  getCheckinPath: vi.fn((uid, cid) => `users/${uid}/checkins/${cid}`),
  CHECKINS_TABLE: 'checkins',
  WEIGHT_TABLE: 'weights',
}));

vi.mock('../../../init-firebase-auth', () => ({
  db: { type: 'firestore-instance' },
  storage: { type: 'storage-instance' },
  analytics: { type: 'analytics-instance' }
}));

vi.mock('firebase/analytics', () => ({
  logEvent: vi.fn()
}));

vi.mock('../../store/checkin.store', () => ({
  checkinStore: {
    getState: vi.fn(() => ({
      deleteCheckin: mockDeleteCheckin
    }))
  }
}));

vi.mock('../../store/user.store', () => ({
  userStore: {
    getState: vi.fn(() => ({
      deleteWeight: mockDeleteWeight
    }))
  }
}));

global.alert = vi.fn();

describe('DeleteCheckInStrategy', () => {
  let strategy: DeleteCheckInStrategy;

  beforeEach(() => {
    vi.clearAllMocks();
    (runTransaction as any).mockImplementation(async (db: any, cb: any) => cb(mockTransaction));
    strategy = new DeleteCheckInStrategy();
  });

  it('should delete all files in storage and the firestore documents (checkin and weight) via transaction', async () => {
    const userId = 'user-123';
    const checkinId = 'checkin-456';
    const weightId = 'weight-789';
    const payload = { id: checkinId, weightId };

    const mockFiles = {
      items: [
        { name: 'img1.jpg' },
        { name: 'img2.jpg' }
      ]
    };
    (listAll as any).mockResolvedValue(mockFiles);
    (deleteObject as any).mockResolvedValue(undefined);

    await strategy.checkIn({ data: payload as any, userId });

    expect(getCheckinPath).toHaveBeenCalledWith(userId, checkinId);
    expect(ref).toHaveBeenCalledWith(expect.anything(), `users/${userId}/checkins/${checkinId}`);
    expect(listAll).toHaveBeenCalled();
    expect(deleteObject).toHaveBeenCalledTimes(2);

    // Verify transaction deletes
    expect(runTransaction).toHaveBeenCalled();
    expect(doc).toHaveBeenCalledWith(expect.anything(), CHECKINS_TABLE, checkinId);
    expect(doc).toHaveBeenCalledWith(expect.anything(), WEIGHT_TABLE, weightId);
    expect(mockTransaction.delete).toHaveBeenCalledTimes(2);

    expect(mockDeleteCheckin).toHaveBeenCalledWith(checkinId);
    expect(mockDeleteWeight).toHaveBeenCalledWith(weightId);
    expect(logEvent).toHaveBeenCalledWith(expect.anything(), 'delete-checkin');
  });

  it('should only delete checkin if weightId is missing', async () => {
    const userId = 'user-123';
    const checkinId = 'checkin-456';
    const payload = { id: checkinId };

    (listAll as any).mockResolvedValue({ items: [] });

    await strategy.checkIn({ data: payload as any, userId });

    expect(runTransaction).toHaveBeenCalled();
    expect(mockTransaction.delete).toHaveBeenCalledTimes(1);
    expect(mockDeleteCheckin).toHaveBeenCalledWith(checkinId);
    expect(mockDeleteWeight).not.toHaveBeenCalled();
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

    await strategy.checkIn({ data: { id: 'id-1' } as any, userId: 'u1' });

    expect(runTransaction).toHaveBeenCalled();
    expect(mockTransaction.delete).toHaveBeenCalled();
    expect(mockDeleteCheckin).toHaveBeenCalledWith('id-1');
  });
});
