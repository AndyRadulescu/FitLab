import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { UnauthorizedScreen } from './unauthorized-screen';

vi.mock('react-i18next', () => ({
  Trans: ({ children, defaultValue }: any) => defaultValue || children || null,
}));


describe('UnauthorizedScreen', () => {
  it('should render default title, shield icon, and default description', () => {
    render(<UnauthorizedScreen />);

    expect(screen.getByTestId('unauthorized-screen')).toBeTruthy();
    expect(screen.getByText('Coach Privileges Required')).toBeTruthy();
    expect(screen.getByText(/isCoach: true/)).toBeTruthy();
  });

  it('should render custom title and custom description', () => {
    render(
      <UnauthorizedScreen
        title="Custom Restricted Area"
        description={<p>Custom forbidden message</p>}
      />
    );

    expect(screen.getByText('Custom Restricted Area')).toBeTruthy();
    expect(screen.getByText('Custom forbidden message')).toBeTruthy();
  });

  it('should call onLogout when the logout button is clicked', () => {
    const mockLogout = vi.fn();
    render(<UnauthorizedScreen onLogout={mockLogout} />);

    const button = screen.getByRole('button', { name: /sign out/i });
    expect(button).toBeTruthy();

    fireEvent.click(button);
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it('should not render a button when onLogout is not provided', () => {
    render(<UnauthorizedScreen />);

    expect(screen.queryByRole('button')).toBeNull();
  });
});
