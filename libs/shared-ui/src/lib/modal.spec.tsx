/**
 * @vitest-environment jsdom
 */
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Modal } from './modal';
import '@testing-library/jest-dom/vitest';

describe('Modal', () => {
  beforeEach(() => {
    // Mock HTMLDialogElement methods that are not implemented in JSDOM
    HTMLDialogElement.prototype.showModal = vi.fn(function() { this.open = true; });
    HTMLDialogElement.prototype.close = vi.fn(function() { this.open = false; });
  });

  it('should render children when open', () => {
    render(
      <Modal isOpen={true} onClose={() => {}}>
        <div data-testid="content">Modal Content</div>
      </Modal>
    );

    expect(screen.getByTestId('content')).toBeInTheDocument();
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose}>
        <div>Content</div>
      </Modal>
    );

    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalled();
  });

  it('should hide close button when showCloseButton is false', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} showCloseButton={false}>
        <div>Content</div>
      </Modal>
    );

    expect(screen.queryByLabelText('Close')).not.toBeInTheDocument();
  });

  it('should call onClose when backdrop is clicked', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose}>
        <div data-testid="content">Content</div>
      </Modal>
    );

    // Click the dialog itself (the backdrop in this implementation)
    const dialog = screen.getByRole('dialog', { hidden: true });
    fireEvent.click(dialog);
    expect(onClose).toHaveBeenCalled();
  });

  it('should not call onClose when content is clicked', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose}>
        <div data-testid="content">Content</div>
      </Modal>
    );

    const content = screen.getByTestId('content');
    fireEvent.click(content);
    expect(onClose).not.toHaveBeenCalled();
  });
});
