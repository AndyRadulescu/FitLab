// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CheckInPage } from './checkIn-page';
import { useCheckInForm } from './hooks/use-checkin-form';
import '@testing-library/jest-dom/vitest';

vi.mock('./hooks/use-checkin-form', () => ({
  useCheckInForm: vi.fn(),
}));

vi.mock('./components/checkin-banner', () => ({
  CheckInBanner: ({ isVisible }: { isVisible: boolean }) =>
    isVisible ? <div data-testid="mock-banner">Banner Visible</div> : null,
}));

vi.mock('./components/checkin-form', () => ({
  CheckInForm: ({ isEdit }: { isEdit: boolean }) =>
    <div data-testid="mock-form">{isEdit ? 'Edit Form' : 'New Form'}</div>,
}));

describe('CheckInPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the form and hide the banner when not editing today', () => {
    (useCheckInForm as any).mockReturnValue({
      formMethods: {},
      onSubmit: vi.fn(),
      isEditingToday: false,
      checkinData: null,
      activeCheckinId: 'new-id',
      user: { uid: '123' }
    });

    render(<CheckInPage />);

    expect(screen.getByTestId('mock-form')).toBeInTheDocument();
    expect(screen.getByText('New Form')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-banner')).not.toBeInTheDocument();
  });

  it('should render the banner when editing today', () => {
    (useCheckInForm as any).mockReturnValue({
      formMethods: {},
      onSubmit: vi.fn(),
      isEditingToday: true,
      checkinData: { id: 'today-1' },
      activeCheckinId: 'today-1',
      user: { uid: '123' }
    });

    render(<CheckInPage />);

    expect(screen.getByTestId('mock-banner')).toBeInTheDocument();
    expect(screen.getByText('Edit Form')).toBeInTheDocument();
  });
});
