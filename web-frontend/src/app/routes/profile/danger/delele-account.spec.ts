import { describe, it, expect, vi, beforeEach } from 'vitest';
import { deleteAccount } from './delele-account';
import { getAuth, deleteUser } from 'firebase/auth';
import { DeleteUserAccount } from './delete-all-strategy';
import { handleAuthErrors } from '../../../core/error-handler';

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  deleteUser: vi.fn(),
}));

vi.mock('./delete-all-strategy', () => {
  const DeleteUserAccount = vi.fn();
  DeleteUserAccount.prototype.deleteAllUserData = vi.fn();
  return { DeleteUserAccount };
});

vi.mock('../../../core/error-handler', () => ({
  handleAuthErrors: vi.fn(),
}));

const mockUserStoreState = { delete: vi.fn() };
vi.mock('../../../store/user.store', () => ({
  userStore: { getState: () => mockUserStoreState },
}));

const mockCheckinStoreState = { delete: vi.fn() };
vi.mock('../../../store/checkin.store', () => ({
  checkinStore: { getState: () => mockCheckinStoreState },
}));

describe('deleteAccount', () => {
  const mockT = vi.fn() as any;
  const userId = 'test-uid-123';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call functions in the correct sequence', async () => {
    const mockUser = { uid: userId };
    (getAuth as any).mockReturnValue({ currentUser: mockUser });

    const deleteDataSpy = vi.spyOn(DeleteUserAccount.prototype, 'deleteAllUserData').mockResolvedValue(undefined);
    const deleteUserSpy = vi.mocked(deleteUser).mockResolvedValue(undefined);
    const checkinStoreSpy = vi.spyOn(mockCheckinStoreState, 'delete');

    await deleteAccount(userId, mockT);

    expect(deleteDataSpy).toHaveBeenCalledOnce();
    expect(deleteUserSpy).toHaveBeenCalledOnce();
    expect(checkinStoreSpy).toHaveBeenCalledOnce();

    const dataCallOrder = deleteDataSpy.mock.invocationCallOrder[0];
    const userCallOrder = deleteUserSpy.mock.invocationCallOrder[0];
    const checkinStoreCallOrder = checkinStoreSpy.mock.invocationCallOrder[0];

    expect(dataCallOrder).toBeLessThan(userCallOrder);
  });

  it('should handle errors and call handleAuthErrors', async () => {
    const mockUser = { uid: userId };
    (getAuth as any).mockReturnValue({ currentUser: mockUser });

    const error = new Error('Firebase Error');
    vi.mocked(deleteUser).mockRejectedValue(error);

    await deleteAccount(userId, mockT);

    expect(handleAuthErrors).toHaveBeenCalledWith(error, mockT);
  });

  it('should exit early if no current user is found', async () => {
    (getAuth as any).mockReturnValue({ currentUser: null });
    const deleteDataSpy = vi.spyOn(DeleteUserAccount.prototype, 'deleteAllUserData');

    await deleteAccount(userId, mockT);

    expect(deleteDataSpy).not.toHaveBeenCalled();
  });
});
