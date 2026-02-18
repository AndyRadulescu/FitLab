import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AddCheckInStrategy } from './add.strategy';
import { doc, setDoc } from 'firebase/firestore';
import { checkinStore } from '../../store/checkin.store';
import { logEvent } from 'firebase/analytics';
import { CHECKINS_TABLE } from '../../firestore/queries';

const mockAddCheckin = vi.fn();
vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  setDoc: vi.fn(),
  serverTimestamp: vi.fn(() => 'mock-server-timestamp')
}));

vi.mock('../../../init-firebase-auth', () => ({
  db: { type: 'firestore-instance' },
  analytics: { type: 'analytics-instance' }
}));

vi.mock('firebase/analytics', () => ({
  logEvent: vi.fn()
}));

vi.mock('../../store/checkin.store', () => {
  return {
    checkinStore: {
      getState: vi.fn(() => ({
        upsertCheckin: mockAddCheckin
      }))
    }
  };
});

describe('AddCheckInStrategy', () => {
  let strategy: AddCheckInStrategy;
  const MOCK_DATE = new Date('2026-02-07T14:00:00Z');

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(MOCK_DATE);
    vi.clearAllMocks();
    strategy = new AddCheckInStrategy();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should create a new document and sync with store', async () => {
    const payload = { id: 'new-id' };
    const userId = 'user-99';
    const mockDocRef = { id: 'new-id' };

    (doc as any).mockReturnValue(mockDocRef);
    (setDoc as any).mockResolvedValue(undefined);

    await strategy.checkIn({ data: payload as any, userId });

    expect(doc).toHaveBeenCalledWith(expect.anything(), CHECKINS_TABLE, 'new-id');
    expect(setDoc).toHaveBeenCalledWith(
      mockDocRef,
      expect.objectContaining({
        id: 'new-id',
        userId: 'user-99',
        createdAt: 'mock-server-timestamp',
        updatedAt: 'mock-server-timestamp'
      })
    );

    expect(mockAddCheckin).toHaveBeenCalledWith({ ...payload, userId, createdAt: MOCK_DATE, updatedAt: MOCK_DATE });
    expect(logEvent).toHaveBeenCalledWith(expect.anything(), 'add-checkin');
  });

  it('should throw an error if setDoc fails', async () => {
    const error = new Error('Network error');
    (setDoc as any).mockRejectedValue(error);

    await expect(strategy.checkIn({ data: { id: '1' } as any, userId: 'u1' }))
      .rejects.toThrow('Network error');

    expect(checkinStore.getState().upsertCheckin).not.toHaveBeenCalled();
  });
});
