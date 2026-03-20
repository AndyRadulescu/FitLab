import { LoadingScreen, Modal } from '@my-org/shared-ui';
import { useCheckinImages } from './checkin-detail-modal/use-checkin-images';
import { CheckinPhotos } from './checkin-detail-modal/checkin-photos';
import { CheckinLifestyle } from './checkin-detail-modal/checkin-lifestyle';
import { CheckinMeasurements } from './checkin-detail-modal/checkin-measurements';
import './checkin-detail-modal/checkin-detail-modal.scss';

interface CheckinDetailModalProps {
  checkin: any;
  isOpen: boolean;
  onClose: () => void;
  loading?: boolean;
}

export const CheckinDetailModal = ({ checkin, isOpen, onClose, loading }: CheckinDetailModalProps) => {
  const { imgUrls, loadingImages } = useCheckinImages(checkin, isOpen);

  const formatDate = (date: any) => {
    if (date?.toDate) return date.toDate().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    return 'Unknown Date';
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="!max-w-4xl">
      <div className="checkin-modal__container">
        {loading ? (
          <LoadingScreen fullScreen={false} />
        ) : checkin ? (
          <>
            <header className="checkin-modal__header">
              <h2 className="checkin-modal__title">Check-in Details</h2>
              <p className="checkin-modal__date">{formatDate(checkin.createdAt)}</p>
            </header>

            <div className="checkin-modal__body">
              <CheckinPhotos imgUrls={imgUrls} loadingImages={loadingImages} />
              <CheckinLifestyle checkin={checkin} />
              <CheckinMeasurements checkin={checkin} />
            </div>

            <footer className="checkin-modal__footer">
              <button 
                onClick={onClose}
                className="checkin-modal__close-button"
              >
                Close Preview
              </button>
            </footer>
          </>
        ) : (
          <div className="checkin-modal__empty">
            <p>Check-in data not found.</p>
            <button onClick={onClose} className="mt-4 text-indigo-600 font-bold">Close</button>
          </div>
        )}
      </div>
    </Modal>
  );
};
