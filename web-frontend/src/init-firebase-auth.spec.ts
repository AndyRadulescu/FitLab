/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach, Mock, afterEach } from 'vitest';

// Use vi.mock for dynamic mocking
vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({})),
}));

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({})),
  onAuthStateChanged: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({})),
}));

vi.mock('firebase/storage', () => ({
  getStorage: vi.fn(() => ({})),
}));

vi.mock('firebase/analytics', () => ({
  getAnalytics: vi.fn(),
  isSupported: vi.fn(() => Promise.resolve(true)),
}));

// Mock Zustand stores
const mockUserStoreState = {
  setUser: vi.fn(),
  delete: vi.fn(),
};

const mockCheckinStoreState = {
  delete: vi.fn(),
};

vi.mock('./app/store/user.store', () => ({
  userStore: {
    getState: vi.fn(() => mockUserStoreState),
  },
}));

vi.mock('./app/store/checkin.store', () => ({
  checkinStore: {
    getState: vi.fn(() => mockCheckinStoreState),
  },
}));

describe('init-firebase-auth', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    vi.stubEnv('VITE_FIREBASE_API_KEY', 'test-api-key');
    vi.stubEnv('VITE_FIREBASE_AUTH_DOMAIN', 'test-auth-domain');
    vi.stubEnv('VITE_FIREBASE_PROJECT_ID', 'test-project-id');
    vi.stubEnv('VITE_FIREBASE_STORAGE_BUCKET', 'test-storage-bucket');
    vi.stubEnv('VITE_FIREBASE_MESSAGING_SENDER_ID', 'test-sender-id');
    vi.stubEnv('VITE_FIREBASE_APP_ID', 'test-app-id');
    vi.stubEnv('VITE_FIREBASE_MEASUREMENT_ID', 'test-measurement-id');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('should not initialize analytics if not in production', async () => {
    vi.stubEnv('PROD', ''); 
    await import('./init-firebase-auth');
    const { getAnalytics } = await import('firebase/analytics');
    
    // Give any potential async calls a chance to happen (though they shouldn't)
    await new Promise(resolve => setTimeout(resolve, 10));
    expect(getAnalytics).not.toHaveBeenCalled();
  });

  it('should initialize Firebase and setup sync', async () => {
    const { initFirebaseAuth, firebaseApp } = await import('./init-firebase-auth');
    const { initializeApp } = await import('firebase/app');
    const { onAuthStateChanged } = await import('firebase/auth');

    expect(initializeApp).toHaveBeenCalledWith({
      apiKey: 'test-api-key',
      authDomain: 'test-auth-domain',
      projectId: 'test-project-id',
      storageBucket: 'test-storage-bucket',
      messagingSenderId: 'test-sender-id',
      appId: 'test-app-id',
      measurementId: 'test-measurement-id',
    });
    expect(firebaseApp).toBeDefined();

    await initFirebaseAuth();
    
    expect(onAuthStateChanged).toHaveBeenCalled();
    
    const authCallback = (onAuthStateChanged as Mock).mock.calls[0][1];
    
    const mockUser = { uid: '123' };
    await authCallback(mockUser);
    expect(mockUserStoreState.setUser).toHaveBeenCalledWith(mockUser);
    
    await authCallback(null);
    expect(mockUserStoreState.delete).toHaveBeenCalled();
    expect(mockCheckinStoreState.delete).toHaveBeenCalled();
  });

  it('should initialize analytics in production if supported', async () => {
    vi.stubEnv('PROD', 'true');
    const { firebaseApp } = await import('./init-firebase-auth');
    const { getAnalytics } = await import('firebase/analytics');
    
    await vi.waitFor(() => {
        expect(getAnalytics).toHaveBeenCalledWith(firebaseApp);
    }, { timeout: 1000 });
  });
});
