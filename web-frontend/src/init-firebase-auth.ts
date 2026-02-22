import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getFirestore } from "firebase/firestore";
import { initializeApp } from 'firebase/app';
import { userStore } from './app/store/user.store';
import { checkinStore } from './app/store/checkin.store';
import { getStorage } from 'firebase/storage';

let initialized = false;

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: window.location.hostname === 'localhost' 
    ? import.meta.env.VITE_FIREBASE_AUTH_DOMAIN 
    : window.location.hostname,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp)

// Optional: Enable analytics only in production + browser
let analytics: ReturnType<typeof getAnalytics> | null = null;

if (import.meta.env.PROD) {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(firebaseApp);
    }
  });
}
const userSt = userStore.getState();
const checkinSt = checkinStore.getState();
export async function initFirebaseAuth() {
  if (initialized) return;
  initialized = true;

  // Sync Firebase → Zustand
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      userSt.setUser(user as any);
    } else {
      userSt.delete();
      checkinSt.delete();
    }
  });
}

export { firebaseApp, analytics, auth, db, storage };
