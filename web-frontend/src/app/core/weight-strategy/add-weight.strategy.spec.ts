import { beforeEach, describe, expect, it, vi } from 'vitest';
import { addDoc, collection } from 'firebase/firestore';
import { AddWeightStrategy } from './add-weight.strategy';
import { WEIGHT_TABLE } from '../../firestore/constants';
import { Weight } from '../../store/user.store';

const mockAddWeight = vi.fn();
const mockT = vi.fn((key: string) => key) as any;

vi.mock('../../store/user.store', () => ({
  userStore: {
    getState: vi.fn(() => ({
      addWeight: mockAddWeight
    }))
  }
}));

vi.mock('react-i18next', () => ({}));

vi.mock('firebase/firestore', () => ({
  addDoc: vi.fn(),
  collection: vi.fn(),
  serverTimestamp: vi.fn(() => 'mock-timestamp')
}));

vi.mock('../../../init-firebase-auth', () => ({
  db: {},
  analytics: {}
}));

describe('AddWeightStrategy', () => {
  let strategy: AddWeightStrategy;
  const MOCK_DATE = new Date('2026-02-18T14:00:00Z');

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(MOCK_DATE);
    vi.clearAllMocks();
    strategy = new AddWeightStrategy();

    (collection as any).mockReturnValue('mock-collection-ref');
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should successfully add weight to Firestore and update local store', async () => {
    const weight = { weight: 85.5 } as Weight;
    const userId = 'user-123';
    const mockDocRef = { id: 'new-doc-id' };

    (addDoc as any).mockResolvedValue(mockDocRef);

    await strategy.weight(weight, userId, mockT);

    expect(collection).toHaveBeenCalledWith(expect.anything(), WEIGHT_TABLE);
    expect(addDoc).toHaveBeenCalledWith('mock-collection-ref', {
      userId: userId,
      weight: weight.weight,
      createdAt: 'mock-timestamp'
    });

    expect(mockAddWeight).toHaveBeenCalledWith({
      id: 'new-doc-id',
      weight: weight.weight,
      createdAt: MOCK_DATE
    });
  });

  it('should handle Firestore errors and show an alert', async () => {
    const weight = { weight: 85.5 } as Weight;
    const userId = 'user-123';
    const consoleSpy = vi.spyOn(console, 'error').mockReturnValue();
    const alertSpy = vi.spyOn(window, 'alert').mockReturnValue();

    (addDoc as any).mockRejectedValue(new Error('Firestore Fail'));
    await strategy.weight(weight, userId, mockT);

    expect(consoleSpy).toHaveBeenCalled();
    expect(mockT).toHaveBeenCalledWith('errors.unknown');
    expect(alertSpy).toHaveBeenCalledWith('errors.unknown');
    expect(mockAddWeight).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
    alertSpy.mockRestore();
  });
});
