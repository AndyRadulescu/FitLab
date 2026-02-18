import { beforeEach, describe, expect, it, vi } from 'vitest';
import { doc, updateDoc } from 'firebase/firestore';
import { logEvent } from 'firebase/analytics';
import { EditWeightStrategy } from './edit-weight.strategy';
import { Weight } from '../../store/user.store';
import { WEIGHT_TABLE } from '../../firestore/queries';

const mockUpdateWeight = vi.fn();
const mockT = vi.fn((key: string) => key) as any;

vi.mock('../../store/user.store', () => ({
  userStore: {
    getState: vi.fn(() => ({
      updateWeight: mockUpdateWeight
    }))
  }
}));

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  updateDoc: vi.fn(),
  serverTimestamp: vi.fn(() => 'mock-timestamp'),
}));

vi.mock('firebase/analytics', () => ({
  logEvent: vi.fn(),
}));

vi.mock('../../../init-firebase-auth', () => ({
  db: {},
  analytics: {}
}));

describe('EditWeightStrategy', () => {
  let strategy: EditWeightStrategy;
  const MOCK_DATE = new Date('2026-02-18T15:00:00Z');

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(MOCK_DATE);
    vi.clearAllMocks();
    strategy = new EditWeightStrategy();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should update weight in Firestore, local store, and log analytics', async () => {
    const mockData: Weight = { id: 'weight-abc', weight: 90.5, createdAt: new Date() };
    const userId = 'user-123';
    const mockDocRef = { id: 'weight-abc' };

    (doc as any).mockReturnValue(mockDocRef);
    (updateDoc as any).mockResolvedValue(undefined);

    await strategy.weight(mockData, userId, mockT);

    expect(doc).toHaveBeenCalledWith(expect.anything(), WEIGHT_TABLE, 'weight-abc');
    expect(updateDoc).toHaveBeenCalledWith(mockDocRef, {
      weight: 90.5,
      updatedAt: 'mock-timestamp'
    });

    expect(mockUpdateWeight).toHaveBeenCalledWith({
      ...mockData,
      weight: 90.5,
      updatedAt: MOCK_DATE
    });

    expect(logEvent).toHaveBeenCalledWith(expect.anything(), 'edit-weight');
  });

  it('should catch errors and notify the user via alert', async () => {
    const mockData: Weight = { id: 'weight-abc', weight: 90.5, createdAt: new Date() };
    const consoleSpy = vi.spyOn(console, 'error').mockReturnValue();
    const alertSpy = vi.spyOn(window, 'alert').mockReturnValue();

    (updateDoc as any).mockRejectedValue(new Error('Update Failed'));

    await strategy.weight(mockData, 'user-123', mockT);

    expect(consoleSpy).toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith('errors.unknown');
    expect(mockUpdateWeight).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
    alertSpy.mockRestore();
  });
});
