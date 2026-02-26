import { describe, it, expect, vi, beforeEach } from 'vitest';
import { startTransaction } from './start-transaction.firebase';
import { runTransaction, collection, doc } from 'firebase/firestore';

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  doc: vi.fn(() => ({ id: 'mock-id' })),
  runTransaction: vi.fn(),
  serverTimestamp: vi.fn(() => 'mock-timestamp'),
}));

vi.mock('../../../init-firebase-auth', () => ({
  db: {},
}));

describe('startTransaction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should run a transaction and set data for weight and user', async () => {
    const mockSet = vi.fn();
    (runTransaction as any).mockImplementation(async (db: any, callback: any) => {
      return await callback({
        set: mockSet,
      });
    });

    const userId = 'user123';
    const data = {
      weight: 80,
      height: 180,
      dateOfBirth: '1990-01-01T00:00:00.000Z'
    };

    const result = await startTransaction(userId, data);

    expect(runTransaction).toHaveBeenCalled();
    expect(result).toBe('mock-id');

    // Verify weight set
    expect(mockSet).toHaveBeenCalledWith(expect.anything(), {
      userId: userId,
      createdAt: 'mock-timestamp',
      weight: 80
    });

    // Verify user set
    expect(mockSet).toHaveBeenCalledWith(expect.anything(), {
      ...data,
      userId: userId,
      createdAt: 'mock-timestamp'
    });
  });
});
