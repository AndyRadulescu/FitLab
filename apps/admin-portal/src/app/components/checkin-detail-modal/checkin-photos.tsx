import { SLOTS } from '@my-org/core';
import { Camera, Loader2 } from 'lucide-react';
import './checkin-detail-modal.scss';

interface CheckinPhotosProps {
  imgUrls: Record<string, string>;
  loadingImages: boolean;
}

export const CheckinPhotos = ({ imgUrls, loadingImages }: CheckinPhotosProps) => {
  return (
    <section>
      <h3 className="checkin-modal__section-title">
        <Camera className="checkin-modal__section-icon" />
        Progress Photos {loadingImages && <Loader2 className="animate-spin inline-block h-4 w-4 ml-2" />}
      </h3>
      <div className="photo-grid">
        {SLOTS.map((slot) => (
          <div key={slot} className="photo-grid__item">
            <div className="photo-grid__container">
              {imgUrls[slot] ? (
                <img 
                  src={imgUrls[slot]} 
                  alt={slot} 
                  className="photo-grid__image" 
                />
              ) : (
                <div className="photo-grid__fallback">
                  {loadingImages ? 'Loading...' : 'No photo'}
                </div>
              )}
              <div className="photo-grid__overlay">
                <span className="photo-grid__overlay-text">{slot} View</span>
              </div>
            </div>
            <p className="photo-grid__label">{slot}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
