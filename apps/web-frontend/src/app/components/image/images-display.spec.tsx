/**
 * @vitest-environment jsdom
 */
import { render, screen, waitFor, fireEvent, cleanup, within } from '@testing-library/react';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { ImagesDisplay } from './images-display';
import { getDownloadURL, ref } from 'firebase/storage';
import '@testing-library/jest-dom/vitest';

vi.mock('firebase/storage', () => ({
  getStorage: vi.fn(),
  ref: vi.fn((_, path) => path), // Return path to check it in getDownloadURL
  getDownloadURL: vi.fn()
}));

vi.mock('@my-org/core', () => ({
  imagePath: vi.fn((userId, checkinId, slot, isSmall) =>
    `path/${userId}/${checkinId}/${slot}${isSmall ? '_small' : ''}`)
}));

vi.mock('lucide-react', () => ({
  CameraOff: () => <div data-testid="camera-off-icon" />,
  Loader2: () => <div data-testid="loader-icon" />,
  X: () => <div data-testid="close-icon" />,
  Image: () => <div data-testid="image-icon" />
}));

vi.mock('@my-org/shared-ui', () => ({
  Modal: ({ isOpen, onClose, children }: any) => isOpen ? (
    <div data-testid="modal">
      <button onClick={onClose}>Close</button>
      {children}
    </div>
  ) : null
}));

describe('ImagesDisplay', () => {
  const mockUserId = 'user123';
  const mockCheckinId = 'checkin456';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('should render loaders initially for each slot', async () => {
    // Return a promise that doesn't resolve immediately to keep it in loading state
    vi.mocked(getDownloadURL).mockReturnValue(new Promise(() => {}));

    render(<ImagesDisplay userId={mockUserId} checkinId={mockCheckinId} />);

    const loaders = screen.getAllByTestId('loader-icon');
    expect(loaders).toHaveLength(3); // front, back, side
  });

  it('should render images when download URLs are successfully fetched', async () => {
    vi.mocked(getDownloadURL).mockImplementation((path: any) => {
      return Promise.resolve(`http://mock-url.com/${path}`);
    });

    render(<ImagesDisplay userId={mockUserId} checkinId={mockCheckinId} />);

    await waitFor(() => {
      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(3);
      expect(images[0]).toHaveAttribute('src', expect.stringContaining('http://mock-url.com/path/user123/checkin456/front_small'));
    });
  });

  it('should open modal with high-res image when a thumbnail is clicked', async () => {
    vi.mocked(getDownloadURL).mockImplementation((path: any) => {
      return Promise.resolve(`http://mock-url.com/${path}`);
    });

    render(<ImagesDisplay userId={mockUserId} checkinId={mockCheckinId} />);

    const thumbnail = await screen.findByAltText('front');
    fireEvent.click(thumbnail.parentElement!);

    await waitFor(() => {
      const modal = screen.getByTestId('modal');
      expect(modal).toBeInTheDocument();
      const modalImg = within(modal).getByRole('img', { name: 'front' });
      // High-res path shouldn't have _small
      expect(modalImg).toHaveAttribute('src', 'http://mock-url.com/path/user123/checkin456/front');
    });
  });

  it('should render CameraOff icon when an image fails to load', async () => {
    vi.mocked(getDownloadURL).mockRejectedValue(new Error('Storage error'));

    render(<ImagesDisplay userId={mockUserId} checkinId={mockCheckinId} />);

    await waitFor(() => {
      const errorIcons = screen.getAllByTestId('camera-off-icon');
      expect(errorIcons).toHaveLength(3);
    });
  });

  it('should show images with opacity-100 after download URLs are fetched', async () => {
    vi.mocked(getDownloadURL).mockResolvedValue('http://mock-url.com/image.jpg');

    render(<ImagesDisplay userId={mockUserId} checkinId={mockCheckinId} />);

    const images = await screen.findAllByRole('img');
    expect(images[0]).toHaveClass('opacity-100');
    expect(images[0]).toHaveAttribute('src', 'http://mock-url.com/image.jpg');
  });

  it('should call getDownloadURL with correct paths for each slot', async () => {
    vi.mocked(getDownloadURL).mockResolvedValue('http://mock-url.com/image.jpg');

    render(<ImagesDisplay userId={mockUserId} checkinId={mockCheckinId} />);

    await waitFor(() => {
      expect(ref).toHaveBeenCalledWith(undefined, `path/${mockUserId}/${mockCheckinId}/front_small`);
      expect(ref).toHaveBeenCalledWith(undefined, `path/${mockUserId}/${mockCheckinId}/back_small`);
      expect(ref).toHaveBeenCalledWith(undefined, `path/${mockUserId}/${mockCheckinId}/side_small`);
    });
  });
});
