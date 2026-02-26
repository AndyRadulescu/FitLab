// @vitest-environment jsdom
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useStartForm } from './use-start-form';
import { userStore } from '../../../store/user.store';
import { useNavigate } from 'react-router-dom';
import { startTransaction } from '../start-transaction.firebase';

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}));

vi.mock('../../../store/user.store', () => ({
  userStore: vi.fn(),
}));

vi.mock('../start-transaction.firebase', () => ({
  startTransaction: vi.fn(),
}));

describe('useStartForm', () => {
  const mockNavigate = vi.fn();
  const mockUser = { uid: 'user123' };
  const mockSetUserData = vi.fn();
  const mockAddWeight = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigate as any).mockReturnValue(mockNavigate);
    (userStore as any).mockImplementation((selector: any) => {
      const state = {
        user: mockUser,
        setUserData: mockSetUserData,
        addWeight: mockAddWeight,
      };
      return selector(state);
    });
  });

  it('should call onSubmit and update store and navigate on success', async () => {
    (startTransaction as any).mockResolvedValue('mock-weight-id');

    const { result } = renderHook(() => useStartForm());

    const formData = {
      dateOfBirth: new Date('1990-01-01'),
      weight: 80,
      height: 180,
    };

    await act(async () => {
      await result.current.onSubmit(formData);
    });

    expect(startTransaction).toHaveBeenCalledWith('user123', expect.objectContaining({
      weight: 80,
      height: 180,
      dateOfBirth: formData.dateOfBirth.toISOString()
    }));
    
    expect(mockAddWeight).toHaveBeenCalledWith({
      id: 'mock-weight-id',
      weight: 80,
      createdAt: expect.any(Date),
    });
    expect(mockSetUserData).toHaveBeenCalledWith({
      ...formData,
      dateOfBirth: formData.dateOfBirth.toISOString(),
    });
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard/', { replace: true });
  });
});
