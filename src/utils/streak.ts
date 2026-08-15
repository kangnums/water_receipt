import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, ensureAuthUser } from '../firebase';

const STREAK_KEY = 'water_receipt_streak';

export interface StreakData {
  streak: number;
  lastDate: string; // 'YYYY-MM-DD'
  lastTimestamp: number; // Date.now() when checked in
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
 * Calculates the exact deadline (23:59:59.999 of the following day)
 * for maintaining a streak from a given lastDate ('YYYY-MM-DD').
 */
export function getStreakDeadline(lastDateStr: string): Date {
  const [year, month, day] = lastDateStr.split('-').map(Number);
  // Next day 23:59:59.999
  const deadline = new Date(year, month - 1, day + 1, 23, 59, 59, 999);
  return deadline;
}

/**
 * Reads the cached streak value synchronously from localStorage.
 */
export function getStreak(): number {
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (!raw) return 1;
    const data: StreakData = JSON.parse(raw);
    const now = new Date();

    if (!data.lastDate) return 1;

    // Deadline to maintain streak is 23:59:59 of the day following last check-in date
    const deadline = getStreakDeadline(data.lastDate);

    if (now.getTime() <= deadline.getTime()) {
      return Math.max(1, data.streak);
    }

    // If current time exceeds 23:59:59 of the next day, streak resets to 1
    return 1;
  } catch {
    return 1;
  }
}

/**
 * Synchronizes with Firestore to fetch the cloud-persisted streak data.
 */
export async function syncStreakFromCloud(): Promise<number> {
  try {
    const user = await ensureAuthUser();
    if (!user) return getStreak();

    const userDocRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userDocRef);

    const now = new Date();
    const localStreak = getStreak();

    if (docSnap.exists()) {
      const cloudData = docSnap.data() as StreakData;
      if (cloudData && cloudData.lastDate) {
        const deadline = getStreakDeadline(cloudData.lastDate);
        let effectiveStreak = 1;
        if (now.getTime() <= deadline.getTime()) {
          effectiveStreak = Math.max(1, cloudData.streak || 1);
        }

        // Merge higher streak if local was more recent
        const finalStreak = Math.max(effectiveStreak, localStreak);
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
    const user = await ensureAuthUser();
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, newRecord, { merge: true });
    }
  } catch (err) {
    console.warn('Failed saving streak to Firebase:', err);
  }

  return streak;
}

export function recordStreakCheckin(): number {
  // Synchronously compute and update local state, then kick off async Firebase update
  const localVal = getStreak();
  recordStreakCheckinAsync().catch(() => {});
  return localVal;
}
