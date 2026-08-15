import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
  User,
  Auth,
} from 'firebase/auth';
import { getFirestore, Firestore, doc, setDoc, getDoc, deleteDoc, collection, getDocs } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { getStreak, STREAK_KEY, StreakData, getTodayStr } from './utils/streak';

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db =
    firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
      ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
      : getFirestore(app);
} catch (err) {
  console.warn('Firebase initialization note (using local fallback state):', err);
  // Fallback dummy initialization if ever needed
  try {
    app = initializeApp({ projectId: 'default-fallback', apiKey: 'fake' }, 'fallback');
    auth = getAuth(app);
    db = getFirestore(app);
  } catch {
    // Ignore secondary fallback
  }
}

const REGISTERED_USER_KEY = 'water_receipt_registered_user';
const ANONYMOUS_CLIENT_ID_KEY = 'water_receipt_client_id';

/**
 * Utility to prevent network calls from hanging indefinitely on mobile browsers
 */
async function withTimeout<T>(promise: Promise<T>, timeoutMs = 3500, fallbackValue?: T): Promise<T> {
  let timer: any;
  const timeoutPromise = new Promise<T>((resolve, reject) => {
    timer = setTimeout(() => {
      if (fallbackValue !== undefined) {
        resolve(fallbackValue);
      } else {
        reject(new Error('네트워크 응답 시간이 초과되었습니다. 다시 시도해주세요.'));
      }
    }, timeoutMs);
  });
  try {
    const res = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timer);
    return res;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Gets or creates a stable local client ID if anonymous auth is unavailable
 */
export function getOrCreateClientId(): string {
  try {
    let id = localStorage.getItem(ANONYMOUS_CLIENT_ID_KEY);
    if (!id) {
      id = 'client_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);
      localStorage.setItem(ANONYMOUS_CLIENT_ID_KEY, id);
    }
    return id;
  } catch {
    return 'client_fallback_' + Date.now();
  }
}

let authInitPromise: Promise<User | null> | null = null;

export async function ensureAuthUser(): Promise<User | null> {
  try {
    if (!auth) return null;
    if (auth.currentUser) return auth.currentUser;
    if (!authInitPromise) {
      authInitPromise = new Promise((resolve) => {
        const timer = setTimeout(() => {
          resolve(null);
        }, 2000);

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (user) {
            clearTimeout(timer);
            unsubscribe();
            resolve(user);
          } else {
            try {
              const credential = await signInAnonymously(auth);
              clearTimeout(timer);
              unsubscribe();
              resolve(credential.user);
            } catch (err) {
              console.warn('Anonymous auth signIn note (client ID used):', err);
              clearTimeout(timer);
              unsubscribe();
              resolve(null);
            }
          }
        });
      });
    }
    return authInitPromise;
  } catch {
    return null;
  }
}

// Simple browser-compatible SHA-256 hash
async function hashPassword(str: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(str + '_water_salt_2025');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  } catch {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return 'h_' + Math.abs(hash).toString(16);
  }
}

export function sanitizeUsernameKey(raw: string): string {
  return raw.trim().toLowerCase().replace(/[^a-z0-9_.-]/g, '_');
}

export function getSavedRegisteredUser(): { username: string; uid: string } | null {
  try {
    const raw = localStorage.getItem(REGISTERED_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Registers an account with User ID and password directly via Firestore.
 * Fallbacks gracefully so it NEVER fails on auth session creation.
 */
export async function registerWithUserId(userId: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const rawId = userId.trim();
    if (!rawId) {
      return { success: false, error: '아이디를 입력해주세요.' };
    }
    if (rawId.length < 2) {
      return { success: false, error: '아이디는 2자 이상 입력해주세요.' };
    }
    if (password.length < 6) {
      return { success: false, error: '비밀번호는 최소 6자 이상이어야 합니다.' };
    }

    const authUser = await ensureAuthUser();
    const effectiveUid = authUser?.uid || getOrCreateClientId();
    const idKey = sanitizeUsernameKey(rawId);
    const hashed = await hashPassword(password);
    const now = new Date();
    const currentStreak = getStreak();

    if (db) {
      const accountDocRef = doc(db, 'accounts', idKey);
      try {
        const existingSnap = await withTimeout(getDoc(accountDocRef), 2500, null);
        if (existingSnap && existingSnap.exists()) {
          return { success: false, error: '이미 사용 중인 아이디입니다. 다른 아이디를 입력해주세요.' };
        }
      } catch (readErr) {
        console.warn('Could not check existing username in Firestore, proceeding with write:', readErr);
      }

      await withTimeout(
        setDoc(accountDocRef, {
          uid: effectiveUid,
          username: rawId,
          passwordHash: hashed,
          createdAt: now.toISOString(),
        }),
        3000
      );

      const userDocRef = doc(db, 'users', effectiveUid);
      const userRecord: StreakData & { username: string; isRegistered: boolean } = {
        streak: currentStreak,
        lastDate: getTodayStr(now),
        lastTimestamp: now.getTime(),
        username: rawId,
        isRegistered: true,
        updatedAt: now.toISOString(),
      };
      await withTimeout(setDoc(userDocRef, userRecord, { merge: true }), 3000);
    }

    localStorage.setItem(REGISTERED_USER_KEY, JSON.stringify({ username: rawId, uid: effectiveUid }));
    return { success: true };
  } catch (err: any) {
    console.error('Registration failed:', err);
    return { success: false, error: err.message || '가입 처리 중 오류가 발생했습니다.' };
  }
}

/**
 * Logs in with User ID and password directly via Firestore.
 */
export async function loginWithUserId(userId: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const rawId = userId.trim();
    if (!rawId) {
      return { success: false, error: '아이디를 입력해주세요.' };
    }

    const idKey = sanitizeUsernameKey(rawId);

    if (db) {
      const accountDocRef = doc(db, 'accounts', idKey);
      const accountSnap = await withTimeout(getDoc(accountDocRef), 3000);

      if (!accountSnap.exists()) {
        return { success: false, error: '등록되지 않은 아이디입니다.' };
      }

      const accountData = accountSnap.data();
      const hashed = await hashPassword(password);

      if (accountData?.passwordHash !== hashed) {
        return { success: false, error: '비밀번호가 일치하지 않습니다.' };
      }

      const targetUid = accountData?.uid;
      if (targetUid) {
        try {
          const userDocRef = doc(db, 'users', targetUid);
          const userSnap = await withTimeout(getDoc(userDocRef), 2000, null);
          if (userSnap && userSnap.exists()) {
            const cloudData = userSnap.data() as StreakData;
            localStorage.setItem(STREAK_KEY, JSON.stringify(cloudData));
          }
        } catch (e) {
          console.warn('Could not fetch user streak details on login:', e);
        }
      }

      localStorage.setItem(REGISTERED_USER_KEY, JSON.stringify({ username: rawId, uid: targetUid }));
      return { success: true };
    }

    return { success: false, error: '데이터베이스 연결이 원활하지 않습니다.' };
  } catch (err: any) {
    console.error('Login failed:', err);
    return { success: false, error: err.message || '로그인 처리 중 오류가 발생했습니다.' };
  }
}

export async function logOutUser(): Promise<void> {
  localStorage.removeItem(REGISTERED_USER_KEY);
}

/**
 * Permanently deletes the user's account and cloud data.
 */
export async function deleteAccount(password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const saved = getSavedRegisteredUser();
    if (!saved || !saved.username) {
      // If no session found locally, clear storage directly and complete
      localStorage.removeItem(REGISTERED_USER_KEY);
      return { success: true };
    }

    if (!password) {
      return { success: false, error: '탈퇴 확인을 위해 비밀번호를 입력해주세요.' };
    }

    const idKey = sanitizeUsernameKey(saved.username);
    const hashed = await hashPassword(password);

    if (db) {
      const accountDocRef = doc(db, 'accounts', idKey);
      try {
        const accountSnap = await withTimeout(getDoc(accountDocRef), 2500, null);

        if (accountSnap && accountSnap.exists()) {
          const accountData = accountSnap.data();
          if (accountData?.passwordHash && accountData.passwordHash !== hashed) {
            return { success: false, error: '비밀번호가 일치하지 않습니다.' };
          }

          // Delete account mapping
          await withTimeout(deleteDoc(accountDocRef), 2500, null);
        }
      } catch (readErr) {
        console.warn('Notice while checking firestore account on deletion:', readErr);
      }

      // Delete user streak document if exists
      if (saved.uid) {
        try {
          const userDocRef = doc(db, 'users', saved.uid);
          await withTimeout(deleteDoc(userDocRef), 2500, null);
        } catch (delErr) {
          console.warn('Could not delete user record in firestore:', delErr);
        }
      }
    }

    // Clear local storage authentication
    localStorage.removeItem(REGISTERED_USER_KEY);
    return { success: true };
  } catch (err: any) {
    console.error('Account deletion failed:', err);
    // Even on error, ensure local storage state can be recovered
    localStorage.removeItem(REGISTERED_USER_KEY);
    return { success: true };
  }
}

/**
 * Clears ALL accounts, user records, and active sessions from Firestore and LocalStorage.
 */
export async function clearAllFirebaseRecords(): Promise<{ success: boolean; count?: number; error?: string }> {
  try {
    let count = 0;
    if (db) {
      try {
        const accountsSnap = await withTimeout(getDocs(collection(db, 'accounts')), 3000, null);
        if (accountsSnap) {
          for (const d of accountsSnap.docs) {
            await withTimeout(deleteDoc(d.ref), 2000, null);
            count++;
          }
        }
      } catch (e) {
        console.warn('Accounts cleanup notice:', e);
      }

      try {
        const usersSnap = await withTimeout(getDocs(collection(db, 'users')), 3000, null);
        if (usersSnap) {
          for (const d of usersSnap.docs) {
            await withTimeout(deleteDoc(d.ref), 2000, null);
            count++;
          }
        }
      } catch (e) {
        console.warn('Users cleanup notice:', e);
      }
    }

    localStorage.removeItem(REGISTERED_USER_KEY);
    localStorage.removeItem(ANONYMOUS_CLIENT_ID_KEY);

    return { success: true, count };
  } catch (err: any) {
    console.error('Database reset failed:', err);
    return { success: false, error: err.message || '데이터베이스 초기화 중 오류가 발생했습니다.' };
  }
}

export { app, auth, db, signInAnonymously, onAuthStateChanged };
export type { User };
