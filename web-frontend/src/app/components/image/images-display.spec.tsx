import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ImagesDisplay } from './images-display';
import { getDownloadURL, ref, getStorage } from 'firebase/storage';
import '@testing-library/jest-dom/vitest';

vi.mock('firebase/storage', () => ({
  getStorage: vi.fn(),
  ref: vi.fn((_, path) => path), // Return path to check it in getDownloadURL
  getDownloadURL: vi.fn(),
}));

vi.mock('../../image-manager/image-path', () => ({
  imagePath: vi.fn((userId, checkinId, slot) => `path/${userId}/${checkinId}/${slot}`),
}));

vi.mock('lucide-react', () => ({
  CameraOff: () => <div data-testid="camera-off-icon" />,
  Loader2: () => <div data-testid="loader-icon" />,
}));

describe('ImagesDisplay', () => {
  const mockUserId = 'user123';
  const mockCheckinId = 'checkin456';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loaders initially for each slot', async () => {
    // Return a promise that doesn't resolve immediately to keep it in loading state
    vi.mocked(getDownloadURL).mockReturnValue(new Promise(() => {}));

    render(<ImagesDisplay userId={mockUserId} checkinId={mockCheckinId} />);

    const loaders = screen.getAllByTestId('loader-icon');
    expect(loaders).toHaveLength(3); // front, back, side
  });

  it('should render images when download URLs are successfully fetched', async () => {
    vi.mocked(getDownloadURL).mockImplementation((storageRef) => {
      return Promise.resolve(`http://mock-url.com/${storageRef}`);
    });

    render(<ImagesDisplay userId={mockUserId} checkinId={mockCheckinId} />);

    await waitFor(() => {
      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(3);
      expect(images[0]).toHaveAttribute('src', expect.stringContaining('http://mock-url.com/'));
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
      expect(ref).toHaveBeenCalledWith(undefined, `path/${mockUserId}/${mockCheckinId}/front`);
      expect(ref).toHaveBeenCalledWith(undefined, `path/${mockUserId}/${mockCheckinId}/back`);
      expect(ref).toHaveBeenCalledWith(undefined, `path/${mockUserId}/${mockCheckinId}/side`);
    });
  });
});
