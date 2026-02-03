import { logEvent } from 'firebase/analytics';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analytics } from '../init-firebase-auth';

export function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    if (analytics) {
      logEvent(analytics, 'page_view', {
        page_path: location.pathname,
        page_location: window.location.href
      });
    }
  }, [location]);

  return null;
}
