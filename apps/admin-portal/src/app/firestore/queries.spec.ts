import { vi, describe, it, expect, beforeEach } from 'vitest';
import { fetchUserInfo, fetchCheckins, fetchWeights, fetchClientIds, fetchAllUsers, unlinkClient, linkClient } from './queries';
import { addDoc, getDoc, getDocs, updateDoc } from 'firebase/firestore';


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
    updateDoc: vi.fn(),
    addDoc: vi.fn(),
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
      vi.mocked(getDocs).mockResolvedValue({ empty: true, docs: [] } as any);

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
      vi.mocked(getDocs).mockResolvedValue({ docs: [], empty: true } as any);

      const result = await fetchClientIds('coach-123');

      expect(result).toEqual([]);
    });

    it('should return client users with connectionStatus if connections found', async () => {
      const mockConnections = [
        { data: () => ({ clientId: 'client-1', status: 'active' }) },
        { data: () => ({ clientId: 'client-2', status: 'unlinked' }) }
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
        .mockResolvedValueOnce({ docs: mockConnections, empty: false } as any)
        .mockResolvedValueOnce(mockUsersSnapshot as any);

      const result = await fetchClientIds('coach-123');

      expect(result).toEqual([
        { id: 'client-1', userId: 'client-1', name: 'Client One', connectionStatus: 'active' },
        { id: 'client-2', userId: 'client-2', name: 'Client Two', connectionStatus: 'unlinked' }
      ]);
      expect(getDocs).toHaveBeenCalledTimes(2);
    });

    it('should filter connections by status when statusFilter is provided', async () => {
      const mockConnections = [
        { data: () => ({ clientId: 'client-2', status: 'unlinked' }) }
      ];

      const mockUsers = [
        { id: 'client-2', name: 'Client Two' }
      ];

      const mockUsersSnapshot = {
        docs: mockUsers.map(u => ({
          id: u.id,
          data: () => ({ name: u.name })
        }))
      };

      vi.mocked(getDocs)
        .mockResolvedValueOnce({ docs: mockConnections, empty: false } as any)
        .mockResolvedValueOnce(mockUsersSnapshot as any);

      const result = await fetchClientIds('coach-123', 'unlinked');

      expect(result).toEqual([
        { id: 'client-2', userId: 'client-2', name: 'Client Two', connectionStatus: 'unlinked' }
      ]);
    });
  });

  describe('unlinkClient', () => {
    it('should update connection status to unlinked', async () => {
      const mockDocRef = { id: 'conn-1' };
      const mockDocs = [{ ref: mockDocRef }];
      vi.mocked(getDocs).mockResolvedValue({ docs: mockDocs } as any);
      vi.mocked(updateDoc).mockResolvedValue(undefined as any);

      await unlinkClient('coach-123', 'client-123');

      expect(updateDoc).toHaveBeenCalledWith(mockDocRef, { status: 'unlinked' });
    });
  });

  describe('linkClient', () => {
    it('should update existing connection to active if found without adding a new document', async () => {
      const mockDocRef = { id: 'conn-1' };
      const mockDocs = [{ ref: mockDocRef }];
      vi.mocked(getDocs).mockResolvedValue({ docs: mockDocs, empty: false } as any);
      vi.mocked(updateDoc).mockResolvedValue(undefined as any);

      await linkClient('coach-123', 'client-123');

      expect(updateDoc).toHaveBeenCalledWith(mockDocRef, { status: 'active' });
      expect(addDoc).not.toHaveBeenCalled();
    });


    it('should add a new connection if no connection found', async () => {
      vi.mocked(getDocs).mockResolvedValue({ docs: [], empty: true } as any);
      vi.mocked(addDoc).mockResolvedValue({ id: 'new-conn' } as any);

      await linkClient('coach-123', 'client-123');

      expect(addDoc).toHaveBeenCalledWith(
        undefined,
        expect.objectContaining({
          coachId: 'coach-123',
          clientId: 'client-123',
          status: 'active'
        })
      );
    });
  });

  describe('fetchAllUsers', () => {
    it('should return all users in the users collection', async () => {
      const mockUsers = [
        { id: 'user-1', name: 'Alice', email: 'alice@example.com' },
        { id: 'user-2', name: 'Bob', email: 'bob@example.com' },
      ];

      const mockSnapshot = {
        docs: mockUsers.map(u => ({
          id: u.id,
          data: () => ({ name: u.name, email: u.email })
        }))
      };

      vi.mocked(getDocs).mockResolvedValue(mockSnapshot as any);

      const result = await fetchAllUsers();

      expect(result).toEqual([
        { id: 'user-1', userId: 'user-1', name: 'Alice', email: 'alice@example.com' },
        { id: 'user-2', userId: 'user-2', name: 'Bob', email: 'bob@example.com' },
      ]);
      expect(getDocs).toHaveBeenCalled();
    });
  });
});


