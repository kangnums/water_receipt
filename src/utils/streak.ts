import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, ensureAuthUser, getOrCreateClientId, getSavedRegisteredUser } from '../firebase';

export const STREAK_KEY = 'water_receipt_streak';

export interface StreakData {
  streak: number;
  lastDate: string; // YYYY-MM-DD
  lastTimestamp: number;
  updatedAt?: string;
}

export function getTodayStr(d = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getYesterdayStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return getTodayStr(d);
}

/**
 * Returns a cutoff timestamp (today's midnight) for streak validation.
 */
export function getStreakDeadline(lastDateStr: string): Date {
  const [year, month, day] = lastDateStr.split('-').map(Number);
  // Valid until 23:59:59 of the day AFTER last checkin
  const deadline = new Date(year, month - 1, day);
  deadline.setDate(deadline.getDate() + 2); // Allows full next day
  deadline.setHours(3, 59, 59, 999); // 4am grace period
  return deadline;
}

/**
 * Reads the local streak without side-effects.
 */
export function getStreak(): number {
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (!raw) return 1;
    const data: StreakData = JSON.parse(raw);
    if (!data || typeof data.streak !== 'number') return 1;

    const now = new Date();
    if (data.lastDate) {
      const deadline = getStreakDeadline(data.lastDate);
      if (now.getTime() > deadline.getTime()) {
        return 1; // Expired streak
      }
    }
    return Math.max(1, data.streak);
  } catch {
    return 1;
  }
}

/**
 * Syncs streak from Firestore if user has a remote profile, merging the highest streak.
 */
export async function syncStreakFromCloud(): Promise<number> {
  try {
    const authUser = await ensureAuthUser();
    const savedUser = getSavedRegisteredUser();
    const effectiveUid = savedUser?.uid || authUser?.uid || getOrCreateClientId();

    const userDocRef = doc(db, 'users', effectiveUid);
    const docSnap = await getDoc(userDocRef);
    const now = new Date();
    const localStreak = getStreak();

    if (docSnap.exists()) {
      const cloudData = docSnap.data() as StreakData;
      if (cloudData && typeof cloudData.streak === 'number') {
        const finalStreak = Math.max(localStreak, cloudData.streak);
        const mergedData: StreakData = {
          streak: finalStreak,
          lastDate: cloudData.lastDate || getTodayStr(now),
          lastTimestamp: cloudData.lastTimestamp || now.getTime(),
          updatedAt: new Date().toISOString(),
        };
        localStorage.setItem(STREAK_KEY, JSON.stringify(mergedData));
        return finalStreak;
      }
    } else {
      // Initialize Firestore document with existing local state
      const initialData: StreakData = {
        streak: localStreak,
        lastDate: getTodayStr(now),
        lastTimestamp: now.getTime(),
        updatedAt: new Date().toISOString(),
      };
      await setDoc(userDocRef, initialData, { merge: true });
    }

    return localStreak;
  } catch (err) {
    console.warn('Could not sync streak from Firebase:', err);
    return getStreak();
  }
}

/**
 * Records a streak check-in both locally and in Firebase Firestore.
 */
export async function recordStreakCheckinAsync(): Promise<number> {
  const now = new Date();
  const today = getTodayStr(now);
  const yesterday = getYesterdayStr();

  let currentLocalData: StreakData | null = null;
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (raw) currentLocalData = JSON.parse(raw);
  } catch {
    // Ignore parse error
  }

  let streak = 1;
  if (currentLocalData && currentLocalData.lastDate) {
    const deadline = getStreakDeadline(currentLocalData.lastDate);
    if (now.getTime() <= deadline.getTime()) {
      if (currentLocalData.lastDate === today) {
        streak = Math.max(1, currentLocalData.streak);
      } else if (currentLocalData.lastDate === yesterday) {
        streak = Math.max(1, currentLocalData.streak + 1);
      } else {
        streak = Math.max(1, currentLocalData.streak + 1);
      }
    } else {
      streak = 1;
    }
  }

  const newRecord: StreakData = {
    streak,
    lastDate: today,
    lastTimestamp: now.getTime(),
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem(STREAK_KEY, JSON.stringify(newRecord));

  // Save to Firebase Firestore asynchronously
  try {
    const authUser = await ensureAuthUser();
    const savedUser = getSavedRegisteredUser();
    const effectiveUid = savedUser?.uid || authUser?.uid || getOrCreateClientId();

    const userDocRef = doc(db, 'users', effectiveUid);
    await setDoc(userDocRef, newRecord, { merge: true });
  } catch (err) {
    console.warn('Firebase streak sync error (local streak preserved):', err);
  }

  return streak;
}

export function recordStreakCheckin(): number {
  const now = new Date();
  const today = getTodayStr(now);
  const yesterday = getYesterdayStr();

  let currentLocalData: StreakData | null = null;
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (raw) currentLocalData = JSON.parse(raw);
  } catch {
    // Ignore parse error
  }

  let streak = 1;
  if (currentLocalData && currentLocalData.lastDate) {
    const deadline = getStreakDeadline(currentLocalData.lastDate);
    if (now.getTime() <= deadline.getTime()) {
      if (currentLocalData.lastDate === today) {
        streak = Math.max(1, currentLocalData.streak);
      } else if (currentLocalData.lastDate === yesterday) {
        streak = Math.max(1, currentLocalData.streak + 1);
      } else {
        streak = Math.max(1, currentLocalData.streak + 1);
      }
    } else {
      streak = 1;
    }
  }

  const newRecord: StreakData = {
    streak,
    lastDate: today,
    lastTimestamp: now.getTime(),
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem(STREAK_KEY, JSON.stringify(newRecord));
  return streak;
}
