import { getRedirectResult, onAuthStateChanged, getAuth } from 'firebase/auth';
import { getAnalytics, isSupported } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { userStore } from './app/store/user.store';
// import { redirect } from 'react-router';
let initialized = false;

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp)

// Optional: Enable analytics only in production + browser
let analytics: ReturnType<typeof getAnalytics> | null = null;

if (import.meta.env.PROD) {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(firebaseApp);
    }
  });
}

export { firebaseApp, analytics, auth };


export async function initFirebaseAuth() {
  if (initialized) return;
  initialized = true;

  // Handle redirect result
  await getRedirectResult(auth).catch(console.error);

  // Sync Firebase → Zustand
  setTimeout(() => {
    onAuthStateChanged(auth, async (user) => {
      const store = userStore.getState();

      if (user) {
        store.setUser(user as any);
        // return redirect("/");
      } else {
        store.setUser(undefined);
        // return redirect("/login");
      }
    });
  }, 0);
}
