import { beforeEach, describe, expect, it, vi } from 'vitest';
import { doc, updateDoc } from 'firebase/firestore';
import { logEvent } from 'firebase/analytics';
import { UpdateCheckInStrategy } from './update.strategy';

const mockUpsertCheckin = vi.fn();

vi.mock('../../../store/checkin.store', () => {
  return {
    checkinStore: {
      getState: vi.fn(() => ({
        upsertCheckin: mockUpsertCheckin
      }))
    }
  };
});

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  updateDoc: vi.fn(),
  serverTimestamp: vi.fn(() => 'mock-timestamp'),
  getFirestore: vi.fn()
}));

vi.mock('firebase/analytics', () => ({
  logEvent: vi.fn(),
  getAnalytics: vi.fn()
}));

vi.mock('../../../../init-firebase-auth', () => ({
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
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should update the document in Firestore and sync with the local store', async () => {
    const mockData = { id: 'checkin-123' };
    const userId = 'user-456';
    const mockDocRef = { id: 'checkin-123', path: 'checkins/checkin-123' };

    (doc as any).mockReturnValue(mockDocRef);
    (updateDoc as any).mockResolvedValue(undefined);

    await strategy.checkIn({ data: mockData as any, userId });

    expect(doc).toHaveBeenCalledWith(expect.anything(), 'checkins', 'checkin-123');
    expect(updateDoc).toHaveBeenCalledWith(mockDocRef, expect.objectContaining({
      id: 'checkin-123',
      updatedAt: 'mock-timestamp'
    }));

    expect(mockUpsertCheckin).toHaveBeenCalledWith({ ...mockData, updatedAt: MOCK_DATE });

    expect(logEvent).toHaveBeenCalledWith(expect.anything(), 'update-checkin');
  });

  it('should handle Firestore update failures gracefully', async () => {
    const mockData = { id: 'checkin-123' };
    (updateDoc as any).mockRejectedValue(new Error('Firestore Error'));

    await expect(strategy.checkIn({ data: mockData as any }))
      .rejects.toThrow('Firestore Error');

    expect(mockUpsertCheckin).not.toHaveBeenCalled();
  });
});
