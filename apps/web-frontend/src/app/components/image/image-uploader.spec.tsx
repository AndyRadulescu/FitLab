// @vitest-environment jsdom
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ImageUploader } from './image-uploader';
import { uploadImage } from '../../image-manager/image-compressor.manager';
import { getDownloadURL } from 'firebase/storage';
import '@testing-library/jest-dom/vitest';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
  Trans: ({ i18nKey, children }: any) => <span>{i18nKey || children}</span>,
}));

vi.mock('firebase/storage', () => ({
  getStorage: vi.fn(),
  ref: vi.fn(),
  getDownloadURL: vi.fn(),
}));

vi.mock('../../image-manager/image-compressor.manager', () => ({
  uploadImage: vi.fn(),
}));

vi.mock('../../image-manager/image-path', () => ({
  imagePath: vi.fn((userId, checkinId, slot) => `path/${userId}/${checkinId}/${slot}`),
}));

describe('ImageUploader', () => {
  const mockUserId = 'user-123';
  const mockCheckinId = 'checkin-456';
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    global.URL.createObjectURL = vi.fn(() => 'mock-url');
    global.URL.revokeObjectURL = vi.fn();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders upload slots initially', () => {
    render(
      <ImageUploader
        userId={mockUserId}
        checkinId={mockCheckinId}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText(/image.upload.front/i)).toBeInTheDocument();
    expect(screen.getByText(/image.upload.back/i)).toBeInTheDocument();
    expect(screen.getByText(/image.upload.side/i)).toBeInTheDocument();
    expect(screen.getAllByText(/section.upload/i)).toHaveLength(3);
  });

  it('fetches and displays existing images when isEdit is true', async () => {
    (getDownloadURL as any).mockResolvedValueOnce('url-front')
      .mockResolvedValueOnce('url-back')
      .mockResolvedValueOnce('url-side');

    render(
      <ImageUploader
        userId={mockUserId}
        checkinId={mockCheckinId}
        onChange={mockOnChange}
        isEdit={true}
      />
    );

    await waitFor(() => {
      expect(screen.getByAltText('front')).toHaveAttribute('src', 'url-front');
      expect(screen.getByAltText('back')).toHaveAttribute('src', 'url-back');
      expect(screen.getByAltText('side')).toHaveAttribute('src', 'url-side');
    });

    expect(mockOnChange).toHaveBeenCalledWith(['url-front', 'url-back', 'url-side']);
  });

  it('handles file upload for a slot', async () => {
    (uploadImage as any).mockResolvedValue(['uploaded-url-front']);
    
    render(
      <ImageUploader
        userId={mockUserId}
        checkinId={mockCheckinId}
        onChange={mockOnChange}
      />
    );

    const file = new File(['image'], 'front.png', { type: 'image/png' });
    const inputs = document.querySelectorAll('input[type="file"]');
    
    fireEvent.change(inputs[0], { target: { files: [file] } });

    // Should show loader while uploading
    expect(screen.getByText(/section.optimizing/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(uploadImage).toHaveBeenCalled();
      // The checkmark should appear once upload is successful
      const checkmark = document.querySelector('.lucide-circle-check');
      expect(checkmark).toBeInTheDocument();
    });

    expect(mockOnChange).toHaveBeenCalledWith(['uploaded-url-front']);
  });

  it('handles removal of an image', async () => {
    (getDownloadURL as any).mockResolvedValueOnce('url-front')
      .mockResolvedValueOnce('url-back')
      .mockResolvedValueOnce('url-side');

    render(
      <ImageUploader
        userId={mockUserId}
        checkinId={mockCheckinId}
        onChange={mockOnChange}
        isEdit={true}
      />
    );

    await waitFor(() => {
      expect(screen.getByAltText('front')).toBeInTheDocument();
    });

    const removeButtons = screen.getAllByRole('button');
    // First button should be the remove button for front slot
    fireEvent.click(removeButtons[0]);

    expect(screen.queryByAltText('front')).not.toBeInTheDocument();
    // The label for upload should reappear
    expect(screen.getAllByText(/section.upload/i)).toHaveLength(1);
  });

  it('displays error message when error prop is provided', () => {
    render(
      <ImageUploader
        userId={mockUserId}
        checkinId={mockCheckinId}
        onChange={mockOnChange}
        error="errors.image.invalid"
      />
    );

    expect(screen.getByText(/errors.image.invalid/i)).toBeInTheDocument();
  });
});
