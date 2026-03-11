import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserDashboard } from './user-dashboard';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { getDoc, getDocs } from 'firebase/firestore';

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  getDocs: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn(),
}));

vi.mock('../../init-firebase-auth', () => ({
  db: {},
}));

describe('UserDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state initially', () => {
    (getDoc as any).mockReturnValue(new Promise(() => {}));
    
    const { container } = render(
      <MemoryRouter initialEntries={['/dashboard/user123']}>
        <Routes>
          <Route path="/dashboard/:userId" element={<UserDashboard />} />
        </Routes>
      </MemoryRouter>
    );

    expect(container.querySelector('.animate-spin')).toBeTruthy();
  });

  it('should render user data and checkins on success', async () => {
    (getDoc as any).mockResolvedValue({
      exists: () => true,
      id: 'user123',
      data: () => ({ displayName: 'John Doe', email: 'john@example.com' })
    });

    (getDocs as any).mockResolvedValue({
      docs: [
        {
          id: 'checkin1',
          data: () => ({
            kg: 80,
            createdAt: { toDate: () => new Date('2024-01-01') }
          })
        }
      ]
    });

    render(
      <MemoryRouter initialEntries={['/dashboard/user123']}>
        <Routes>
          <Route path="/dashboard/:userId" element={<UserDashboard />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText("John Doe's Dashboard")).toBeTruthy();
    expect(await screen.findByText('john@example.com')).toBeTruthy();
    expect(await screen.findByText('Check-in History')).toBeTruthy();
    expect(await screen.findByText('Weight: 80 kg')).toBeTruthy();
  });
});
