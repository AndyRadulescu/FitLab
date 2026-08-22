import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest';
import { AddCheckInStrategy } from './add.strategy';
import { doc, collection, runTransaction } from 'firebase/firestore';
import { logEvent } from 'firebase/analytics';
import { CHECKINS_TABLE, WEIGHT_TABLE } from '@my-org/core';

const mockUpsertCheckin = vi.fn();
const mockAddWeight = vi.fn();
const mockUpdateWeight = vi.fn();

const mockTransaction = {
  set: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
};

vi.mock('firebase/firestore', () => ({
  doc: vi.fn((...args) => {
    if (args.length === 3) return { id: args[2], table: args[1] };
    if (args.length === 1 && args[0].table) return { id: 'random-id', table: args[0].table };
    return { id: 'random-id' };
  }),
  collection: vi.fn((db, table) => ({ table })),
  runTransaction: vi.fn(async (db, cb) => cb(mockTransaction)),
  serverTimestamp: vi.fn(() => 'mock-server-timestamp')
}));

vi.mock('../../../init-firebase-auth', () => ({
  db: { type: 'firestore-instance' },
  analytics: { type: 'analytics-instance' }
}));

vi.mock('firebase/analytics', () => ({
  logEvent: vi.fn()
}));

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
      addWeight: mockAddWeight,
      updateWeight: mockUpdateWeight
    }))
  }
}));

describe('AddCheckInStrategy', () => {
  let strategy: AddCheckInStrategy;
  const MOCK_DATE = new Date('2026-02-07T14:00:00Z');

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(MOCK_DATE);
    vi.clearAllMocks();
    (runTransaction as any).mockImplementation(async (db: any, cb: any) => cb(mockTransaction));
    strategy = new AddCheckInStrategy();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should create a new document in transaction and sync with store', async () => {
    const payload = { id: 'new-id', kg: 75 };
    const userId = 'user-99';

    await strategy.checkIn({ data: payload as any, userId });

    expect(runTransaction).toHaveBeenCalled();

    // Verify Weight creation (no weightId provided)
    expect(collection).toHaveBeenCalledWith(expect.anything(), WEIGHT_TABLE);
    expect(mockTransaction.set).toHaveBeenCalledWith(
      expect.objectContaining({ table: WEIGHT_TABLE }),
      expect.objectContaining({
        userId,
        weight: 75,
        from: 'checkin'
      })
    );
    expect(mockAddWeight).toHaveBeenCalled();

    // Verify Checkin creation
    expect(doc).toHaveBeenCalledWith(expect.anything(), CHECKINS_TABLE, 'new-id');
    expect(mockTransaction.set).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'new-id', table: CHECKINS_TABLE }),
      expect.objectContaining({
        weightId: expect.any(String),
        userId: 'user-99',
        createdAt: 'mock-server-timestamp',
        updatedAt: 'mock-server-timestamp'
      })
    );

    expect(mockUpsertCheckin).toHaveBeenCalled();
    expect(logEvent).toHaveBeenCalledWith(expect.anything(), 'add-checkin');
  });

  it('should update existing weight in transaction if weightId is provided', async () => {
    const payload = { id: 'new-id', kg: 76, weightId: 'w-123' };
    const userId = 'user-99';

    await strategy.checkIn({ data: payload as any, userId });

    expect(runTransaction).toHaveBeenCalled();
    expect(doc).toHaveBeenCalledWith(expect.anything(), WEIGHT_TABLE, 'w-123');
    expect(mockTransaction.update).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'w-123', table: WEIGHT_TABLE }),
      expect.objectContaining({
        weight: 76,
        updatedAt: 'mock-server-timestamp'
      })
    );
    expect(mockUpdateWeight).toHaveBeenCalled();
  });

  it('should throw an error if runTransaction fails', async () => {
    const error = new Error('Transaction error');
    (runTransaction as any).mockRejectedValueOnce(error);

    await expect(strategy.checkIn({ data: { id: '1', kg: 70 } as any, userId: 'u1' }))
      .rejects.toThrow('Transaction error');

    expect(mockUpsertCheckin).not.toHaveBeenCalled();
  });
});
