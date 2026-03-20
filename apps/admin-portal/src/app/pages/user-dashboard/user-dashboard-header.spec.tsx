import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { UserDashboardHeader } from './user-dashboard-header';

describe('UserDashboardHeader', () => {
  const mockOnBack = vi.fn();

  it('should render user displayName when available', () => {
    const user = { id: '123', displayName: 'John Doe', email: 'john@example.com' };
    render(<UserDashboardHeader user={user} onBack={mockOnBack} />);

    expect(screen.getByText("John Doe's Dashboard")).toBeTruthy();
    expect(screen.getByText('john@example.com')).toBeTruthy();
    expect(screen.getByText('123')).toBeTruthy();
  });

  it('should render email as title when displayName is missing', () => {
    const user = { id: '123', email: 'john@example.com' };
    render(<UserDashboardHeader user={user} onBack={mockOnBack} />);

    expect(screen.getByText("john@example.com's Dashboard")).toBeTruthy();
  });

  it('should render "User" as title when both displayName and email are missing', () => {
    const user = { id: '123' };
    render(<UserDashboardHeader user={user} onBack={mockOnBack} />);

    expect(screen.getByText("User's Dashboard")).toBeTruthy();
  });

  it('should call onBack when back button is clicked', () => {
    const user = { id: '123' };
    render(<UserDashboardHeader user={user} onBack={mockOnBack} />);

    const backButton = screen.getByLabelText('Go back');
    fireEvent.click(backButton);

    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it('should not render email section if email is missing', () => {
    const user = { id: '123' };
    render(<UserDashboardHeader user={user} onBack={mockOnBack} />);

    expect(screen.queryByText('Email:')).toBeNull();
  });

  it('should not render ID section if id is missing', () => {
    const user = { email: 'john@example.com' };
    render(<UserDashboardHeader user={user} onBack={mockOnBack} />);

    expect(screen.queryByText('User ID:')).toBeNull();
  });
});
