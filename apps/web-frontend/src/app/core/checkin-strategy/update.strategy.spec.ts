import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest';
import { doc, runTransaction } from 'firebase/firestore';
import { logEvent } from 'firebase/analytics';
import { UpdateCheckInStrategy } from './update.strategy';
import { CHECKINS_TABLE, WEIGHT_TABLE } from '@my-org/core';

const mockUpsertCheckin = vi.fn();
const mockUpdateWeight = vi.fn();

const mockTransaction = {
  update: vi.fn(),
  set: vi.fn(),
  delete: vi.fn(),
};

vi.mock('../../store/checkin.store', () => ({
  checkinStore: {
    getState: vi.fn(() => ({
      upsertCheckin: mockUpsertCheckin
    }))
  }
}));

vi.mock('../../store/user.store', () => ({
  userStore: {
    getState: vi.fn(() => ({
      updateWeight: mockUpdateWeight
    }))
  }
}));

vi.mock('firebase/firestore', () => ({
  doc: vi.fn((db, table, id) => ({ id, table })),
  runTransaction: vi.fn(async (db, cb) => cb(mockTransaction)),
  serverTimestamp: vi.fn(() => 'mock-timestamp')
}));

vi.mock('firebase/analytics', () => ({
  logEvent: vi.fn(),
  getAnalytics: vi.fn()
}));

vi.mock('../../../init-firebase-auth', () => ({
  db: {},
  analytics: {}
}));

describe('UpdateCheckInStrategy', () => {
  let strategy: UpdateCheckInStrategy;
  const MOCK_DATE = new Date('2026-02-07T14:00:00Z');

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(MOCK_DATE);
    vi.clearAllMocks();
    (runTransaction as any).mockImplementation(async (db: any, cb: any) => cb(mockTransaction));
    strategy = new UpdateCheckInStrategy();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should update the document in Firestore via transaction and sync with the local store', async () => {
    const mockData = { id: 'checkin-123', weightId: 'w-456', kg: 80 };
    const userId = 'user-456';

    await strategy.checkIn({ data: mockData as any, userId });

    expect(runTransaction).toHaveBeenCalled();

    // Verify weight update
    expect(doc).toHaveBeenCalledWith(expect.anything(), WEIGHT_TABLE, 'w-456');
    expect(mockTransaction.update).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'w-456', table: WEIGHT_TABLE }),
      expect.objectContaining({ weight: 80, updatedAt: 'mock-timestamp' })
    );
    expect(mockUpdateWeight).toHaveBeenCalled();

    // Verify checkin update
    expect(doc).toHaveBeenCalledWith(expect.anything(), CHECKINS_TABLE, 'checkin-123');
    expect(mockTransaction.update).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'checkin-123', table: CHECKINS_TABLE }),
      expect.objectContaining({ updatedAt: 'mock-timestamp' })
    );

    expect(mockUpsertCheckin).toHaveBeenCalled();
    expect(logEvent).toHaveBeenCalledWith(expect.anything(), 'update-checkin');
  });

  it('should handle Firestore transaction failures gracefully', async () => {
    const mockData = { id: 'checkin-123', weightId: 'w-456' };
    (runTransaction as any).mockRejectedValueOnce(new Error('Firestore Error'));

    await expect(strategy.checkIn({ data: mockData as any }))
      .rejects.toThrow('Firestore Error');

    expect(mockUpsertCheckin).not.toHaveBeenCalled();
  });
});
