/**
 * VOUCH — Firebase Client Authentication Service
 * 
 * Provides isolated Google Sign-In identity provider integration.
 * Obtains verified Firebase ID tokens to authenticate against the VOUCH FastAPI backend.
 * Never stores or manages user sessions directly — VOUCH backend session is the source of truth.
 */
import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  Auth
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyBytrdbP0jEGIScXuM-PY85cqx6NYrGguw',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'vouch-app1.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'vouch-app1',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'vouch-app1.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '384854088930',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:384854088930:web:5b9a15a82110a952e992bb',
};

// Initialize Firebase App safely (singleton)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth: Auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

/**
 * Triggers Google Sign-In popup and retrieves a cryptographically verified Firebase ID token.
 * 
 * @returns {Promise<string>} The Firebase ID Token to be sent to VOUCH backend for verification.
 */
export async function signInWithGoogle(): Promise<string> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const idToken = await result.user.getIdToken(true);
    return idToken;
  } catch (err: any) {
    if (err?.code === 'auth/popup-closed-by-user') {
      throw new Error('Google sign-in was cancelled.');
    }
    if (err?.code === 'auth/cancelled-popup-request') {
      throw new Error('Sign-in already in progress. Please complete the current window.');
    }
    if (err?.code === 'auth/popup-blocked') {
      throw new Error('Sign-in popup was blocked by your browser. Please allow popups for this site.');
    }
    throw new Error(err?.message || 'Google sign-in failed. Please try again.');
  }
}

/**
 * Signs out from Firebase client auth state.
 */
export async function signOutFirebase(): Promise<void> {
  try {
    if (auth.currentUser) {
      await firebaseSignOut(auth);
    }
  } catch (err) {
    console.warn('Firebase sign-out non-critical error:', err);
  }
}
