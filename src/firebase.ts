import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

// Use custom Firestore database ID if provided in config, otherwise default
const db: Firestore =
  firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
    ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
    : getFirestore(app);

let authInitPromise: Promise<User | null> | null = null;

export async function ensureAuthUser(): Promise<User | null> {
  if (auth.currentUser) return auth.currentUser;
  if (!authInitPromise) {
    authInitPromise = new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          unsubscribe();
          resolve(user);
        } else {
          try {
            const credential = await signInAnonymously(auth);
            unsubscribe();
            resolve(credential.user);
          } catch (err) {
            console.warn('Anonymous auth failed, fallback to local:', err);
            unsubscribe();
            resolve(null);
          }
        }
      });
    });
  }
  return authInitPromise;
}

export { app, auth, db, signInAnonymously, onAuthStateChanged };
export type { User };
