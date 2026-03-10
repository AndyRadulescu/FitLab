import { Auth, getAuth, onAuthStateChanged } from 'firebase/auth';
import { Analytics, getAnalytics, isSupported } from 'firebase/analytics';
import { Firestore, getFirestore } from "firebase/firestore";
import { FirebaseApp, initializeApp } from 'firebase/app';
import { FirebaseStorage, getStorage } from 'firebase/storage';
import { userStore } from './app/store/user.store';

let firebaseApp: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;
let analytics: Analytics | null = null;
let initialized = false;

export async function initFirebaseAuth() {
  if (initialized) return;

  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_ADMIN_API_KEY,
    authDomain: window.location.hostname === 'localhost'
      ? import.meta.env.VITE_FIREBASE_AUTH_DOMAIN
      : window.location.hostname,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_ADMIN_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_ADMIN_MEASUREMENT_ID
  };

  console.log(firebaseConfig);

  firebaseApp = initializeApp(firebaseConfig);
  auth = getAuth(firebaseApp);
  db = getFirestore(firebaseApp);
  storage = getStorage(firebaseApp);

  if (import.meta.env.PROD) {
    const supported = await isSupported();
    if (supported) {
      analytics = getAnalytics(firebaseApp);
    }
  }

  const userSt = userStore.getState();

  // Sync Firebase → Zustand
  onAuthStateChanged(auth, (user) => {
    if (user) {
      userSt.setUser(user);
    } else {
      userSt.delete();
    }
  });

  initialized = true;
}

export { firebaseApp, analytics, auth, db, storage };
