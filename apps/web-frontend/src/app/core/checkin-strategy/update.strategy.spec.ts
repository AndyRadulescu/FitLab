import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest';
import { doc } from 'firebase/firestore';
import { logEvent } from 'firebase/analytics';
import { UpdateCheckInStrategy } from './update.strategy';
import { CHECKINS_TABLE, WEIGHT_TABLE } from '@my-org/core';

const mockUpsertCheckin = vi.fn();
const mockUpdateWeight = vi.fn();

const mockBatch = {
  update: vi.fn(),
  commit: vi.fn().mockResolvedValue(undefined),
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
  writeBatch: vi.fn(() => mockBatch),
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
    strategy = new UpdateCheckInStrategy();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should update the document in Firestore and sync with the local store', async () => {
    const mockData = { id: 'checkin-123', weightId: 'w-456', kg: 80 };
    const userId = 'user-456';

    await strategy.checkIn({ data: mockData as any, userId });

    // Verify weight update
    expect(doc).toHaveBeenCalledWith(expect.anything(), WEIGHT_TABLE, 'w-456');
    expect(mockBatch.update).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'w-456', table: WEIGHT_TABLE }),
      expect.objectContaining({ weight: 80, updatedAt: 'mock-timestamp' })
    );
    expect(mockUpdateWeight).toHaveBeenCalled();

    // Verify checkin update
    expect(doc).toHaveBeenCalledWith(expect.anything(), CHECKINS_TABLE, 'checkin-123');
    expect(mockBatch.update).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'checkin-123', table: CHECKINS_TABLE }),
      expect.objectContaining({ updatedAt: 'mock-timestamp' })
    );

    expect(mockBatch.commit).toHaveBeenCalled();
    expect(mockUpsertCheckin).toHaveBeenCalled();
    expect(logEvent).toHaveBeenCalledWith(expect.anything(), 'update-checkin');
  });

  it('should handle Firestore update failures gracefully', async () => {
    const mockData = { id: 'checkin-123', weightId: 'w-456' };
    mockBatch.commit.mockRejectedValueOnce(new Error('Firestore Error'));

    await expect(strategy.checkIn({ data: mockData as any }))
      .rejects.toThrow('Firestore Error');

    expect(mockUpsertCheckin).not.toHaveBeenCalled();
  });
});
