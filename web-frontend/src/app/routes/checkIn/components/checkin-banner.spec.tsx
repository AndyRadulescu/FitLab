import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CheckInBanner } from './checkin-banner';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('CheckInBanner', () => {
  it('renders correctly when isVisible is true', () => {
    render(<CheckInBanner isVisible={true} />);
    expect(screen.getByText('checkin.alreadyDone')).toBeDefined();
    expect(screen.getByText('checkin.onlyOnce')).toBeDefined();
  });

  it('returns null (does not render) when isVisible is false', () => {
    const { container } = render(<CheckInBanner isVisible={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('closes and disappears when the close button is clicked', async () => {
    render(<CheckInBanner isVisible={true} />);
    const closeButton = screen.getByLabelText('Close banner');
    fireEvent.click(closeButton);
    expect(screen.queryByText('checkin.alreadyDone')).toBeNull();
  });
});
