import { vi, describe, it, expect, beforeEach } from 'vitest';
import { fetchUserInfo, fetchCheckins, fetchWeights, fetchClientIds } from './queries';
import { getDoc, getDocs } from 'firebase/firestore';

vi.mock('firebase/firestore', async () => {
  const actual = await vi.importActual('firebase/firestore');
  return {
    ...actual,
    collection: vi.fn(),
    getDocs: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
    orderBy: vi.fn(),
    doc: vi.fn(),
    getDoc: vi.fn(),
  };
});

vi.mock('../../init-firebase-auth', () => ({
  db: {}
}));

describe('queries', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchUserInfo', () => {
    it('should return user info if user exists', async () => {
      const mockUser = { name: 'John Doe' };
      const mockDocSnap = {
        exists: () => true,
        id: 'user-123',
        data: () => mockUser
      };
      vi.mocked(getDoc).mockResolvedValue(mockDocSnap as any);

      const result = await fetchUserInfo('user-123');

      expect(result).toEqual({ id: 'user-123', ...mockUser });
      expect(getDoc).toHaveBeenCalled();
    });

    it('should return null if user does not exist', async () => {
      const mockDocSnap = {
        exists: () => false
      };
      vi.mocked(getDoc).mockResolvedValue(mockDocSnap as any);

      const result = await fetchUserInfo('user-123');

      expect(result).toBeNull();
    });
  });

  describe('fetchCheckins', () => {
    it('should return checkins for a user', async () => {
      const mockCheckins = [
        { id: '1', note: 'Feeling good' },
        { id: '2', note: 'Feeling okay' }
      ];
      const mockSnapshot = {
        docs: mockCheckins.map(c => ({
          id: c.id,
          data: () => ({ note: c.note })
        }))
      };
      vi.mocked(getDocs).mockResolvedValue(mockSnapshot as any);

      const result = await fetchCheckins('user-123');

      expect(result).toEqual(mockCheckins);
      expect(getDocs).toHaveBeenCalled();
    });
  });

  describe('fetchWeights', () => {
    it('should return weights for a user', async () => {
      const mockWeights = [
        { id: '1', weight: 80 },
        { id: '2', weight: 79 }
      ];
      const mockSnapshot = {
        docs: mockWeights.map(w => ({
          id: w.id,
          data: () => ({ weight: w.weight })
        }))
      };
      vi.mocked(getDocs).mockResolvedValue(mockSnapshot as any);

      const result = await fetchWeights('user-123');

      expect(result).toEqual(mockWeights);
      expect(getDocs).toHaveBeenCalled();
    });
  });

  describe('fetchClientIds', () => {
    it('should return empty array if no connections found', async () => {
      vi.mocked(getDocs).mockResolvedValue({ docs: [] } as any);

      const result = await fetchClientIds('coach-123');

      expect(result).toEqual([]);
    });

    it('should return client users if connections found', async () => {
      const mockConnections = [
        { data: () => ({ clientId: 'client-1' }) },
        { data: () => ({ clientId: 'client-2' }) }
      ];
      
      const mockUsers = [
        { id: 'client-1', name: 'Client One' },
        { id: 'client-2', name: 'Client Two' }
      ];

      const mockUsersSnapshot = {
        docs: mockUsers.map(u => ({
          id: u.id,
          data: () => ({ name: u.name })
        }))
      };

      vi.mocked(getDocs)
        .mockResolvedValueOnce({ docs: mockConnections } as any)
        .mockResolvedValueOnce(mockUsersSnapshot as any);

      const result = await fetchClientIds('coach-123');

      expect(result).toEqual(mockUsers);
      expect(getDocs).toHaveBeenCalledTimes(2);
    });
  });
});
