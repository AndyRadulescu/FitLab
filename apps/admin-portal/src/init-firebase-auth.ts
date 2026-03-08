import { Auth, getAuth, onAuthStateChanged, getRedirectResult } from 'firebase/auth';
import { Analytics, getAnalytics, isSupported } from 'firebase/analytics';
import { Firestore, getFirestore } from "firebase/firestore";
import { FirebaseApp, initializeApp } from 'firebase/app';
import { FirebaseStorage, getStorage } from 'firebase/storage';
import i18next from 'i18next';

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

  initialized = true;

  // try {
  //   const result = await getRedirectResult(auth);
  //   console.log(result);
  // } catch (err: any) {
  //   console.log(err);
  //   handleAuthErrors(err, i18next.t);
  // }
  //
  // const userSt = userStore.getState();
  //
  // // Sync Firebase → Zustand
  // onAuthStateChanged(auth, async (user) => {
  //   if (user) {
  //     userSt.setUser(user as any);
  //   } else {
  //     userSt.delete();
  //   }
  // });
}

export { firebaseApp, analytics, auth, db, storage };
