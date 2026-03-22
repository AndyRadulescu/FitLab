import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../init-firebase-auth';
import { LOGS_TABLE } from '@my-org/core';
import { userStore } from '../store/user.store';

export interface ErrorLog {
  message: string;
  stack?: string;
  url: string;
  userAgent: string;
  userId?: string;
  timestamp: any;
  type: 'js-error' | 'promise-rejection' | 'react-error';
  extra?: any;
}

export async function logErrorToFirebase(
  error: Error | string,
  type: ErrorLog['type'],
  extra?: any
) {
  try {
    const user = userStore.getState().user;
    const message = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : undefined;

    const log: ErrorLog = {
      message,
      stack,
      url: window.location.href,
      userAgent: navigator.userAgent,
      userId: user?.uid,
      timestamp: serverTimestamp(),
      type,
      extra
    };

    // Only log to Firestore if db is initialized
    if (db) {
      await addDoc(collection(db, LOGS_TABLE), log);
    }

    // Also log to console in development
    if (import.meta.env.DEV) {
      console.error(`[ErrorLogger] ${type}:`, error, extra);
    }
  } catch (e) {
    console.error('Failed to log error to Firebase:', e);
  }
}

export function setupGlobalErrorHandlers() {
  window.addEventListener('error', (event) => {
    void logErrorToFirebase(event.error || event.message, 'js-error');
  });

  window.addEventListener('unhandledrejection', (event) => {
    void logErrorToFirebase(event.reason, 'promise-rejection');
  });
}
