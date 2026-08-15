import { WaterState, WaterItemKey, ItemMeta, WaterGrade } from '../types';
import { Language, translations } from './translations';

export const RATE_SHOWER_RUNNING = 10;        // 평균 물 계속 틀어놓고 샤워 10L / min
export const RATE_SHOWER_SAVING = 7.5;         // 평균 샤워 중 물 잠그며 사용 7.5L / min
export const RATE_SHOWER_MALE_RUNNING = 8.5;   // 남성 물 계속 틀어놓고 샤워 8.5L / min
export const RATE_SHOWER_MALE_SAVING = 6.0;    // 남성 샤워 중 물 잠그며 사용 6.0L / min
export const RATE_SHOWER_FEMALE_RUNNING = 11.5; // 여성 물 계속 틀어놓고 샤워 11.5L / min
export const RATE_SHOWER_FEMALE_SAVING = 8.5;  // 여성 샤워 중 물 잠그며 사용 8.5L / min
export const RATE_HANDWASH_TAP = 2.0;      // 물 계속 틀어놓고 손 씻기 2L / 회
export const RATE_HANDWASH_SAVING = 0.5;   // 비누칠 시 물 잠그기 0.5L / 회
export const RATE_LAUNDRY = 80;            // 세탁 1회당 80L
export const RATE_TOILET = 8;              // 변기 물내림 1회당 8L
export const RATE_DISH_RUNNING = 24;       // 물 틀어놓고 설거지 24L/회
export const RATE_DISH_SAVING = 8;         // 물 받아 쓰기 설거지 8L/회
export const RATE_COOKING = 6;             // 식재료 세척 및 요리 6L/회
export const RATE_TUMBLER = 2;            // 2L/회
export const RATE_BRUSH_TAP = 3.5;         // 물 틀어놓고 양치 (3.5L/회)
export const RATE_BRUSH_CUP = 0.5;         // 컵 사용 (0.5L/회)
export const RATE_CUP = 0.2;               // 200ml = 0.2L
export const RATE_DRINK = 0.3;             // 300ml = 0.3L

export const ITEM_META: Record<WaterItemKey, ItemMeta> = {
  shower: {
    key: 'shower',
    emoji: '🚿',
    category: 'personal',
  },
  handwash: {
    key: 'handwash',
    emoji: '🫧',
    category: 'personal',
  },
  laundry: {
    key: 'laundry',
    emoji: '🧺',
    category: 'housework',
  },
  toilet: {
    key: 'toilet',
    emoji: '🚽',
    category: 'housework',
  },
  dish: {
    key: 'dish',
    emoji: '🍽️',
    category: 'kitchen',
  },
  cooking: {
    key: 'cooking',
    emoji: '🍳',
    category: 'kitchen',
  },
  tumbler: {
    key: 'tumbler',
    emoji: '🧴',
    category: 'kitchen',
  },
  brush: {
    key: 'brush',
    emoji: '🪥',
    category: 'personal',
  },
  water: {
    key: 'water',
    emoji: '🥤',
    category: 'drink',
  },
  drink: {
    key: 'drink',
    emoji: '☕',
    category: 'drink',
  },
};

export function calcItemUsage(key: WaterItemKey, state: WaterState): number {
  if (!state) return 0;
  switch (key) {
    case 'shower': {
      if (!state.shower) return 0;
      let runRate = RATE_SHOWER_RUNNING;
      let saveRate = RATE_SHOWER_SAVING;
      const gender = state.shower.gender || 'male';
      if (gender === 'male') {
        runRate = RATE_SHOWER_MALE_RUNNING;
        saveRate = RATE_SHOWER_MALE_SAVING;
      } else if (gender === 'female') {
        runRate = RATE_SHOWER_FEMALE_RUNNING;
        saveRate = RATE_SHOWER_FEMALE_SAVING;
      }
      const minutes = state.shower.minutes || 0;
      const isRunningTap = state.shower.runningTap ?? true;
      return minutes * (isRunningTap ? runRate : saveRate);
    }
    case 'handwash':
      if (!state.handwash) return 0;
      return (state.handwash.count || 0) * (state.handwash.runningTap ? RATE_HANDWASH_TAP : RATE_HANDWASH_SAVING);
    case 'laundry':
      if (!state.laundry) return 0;
      return (state.laundry.count || 0) * RATE_LAUNDRY;
    case 'toilet':
      if (!state.toilet) return 0;
      return (state.toilet.count || 0) * RATE_TOILET;
    case 'dish':
      if (!state.dish) return 0;
      return (state.dish.count || 0) * (state.dish.runningTap ? RATE_DISH_RUNNING : RATE_DISH_SAVING);
    case 'cooking':
      if (!state.cooking) return 0;
      return (state.cooking.count || 0) * RATE_COOKING;
    case 'tumbler':
      if (!state.tumbler) return 0;
      return (state.tumbler.count || 0) * RATE_TUMBLER;
    case 'brush':
      if (!state.brush) return 0;
      return (state.brush.count || 0) * (state.brush.cup ? RATE_BRUSH_CUP : RATE_BRUSH_TAP);
    case 'water':
      if (!state.water) return 0;
      return (state.water.cups || 0) * RATE_CUP;
    case 'drink':
      if (!state.drink) return 0;
      return (state.drink.count || 0) * RATE_DRINK;
    default:
      return 0;
  }
}

export function calcTotalUsage(state: WaterState): number {
  const keys: WaterItemKey[] = [
    'shower',
    'handwash',
    'laundry',
    'toilet',
    'dish',
    'cooking',
    'tumbler',
    'brush',
    'water',
    'drink',
  ];
  return keys.reduce((sum, key) => sum + calcItemUsage(key, state), 0);
}

export function formatVolume(num: number): string {
  const rounded = Math.round(num * 10) / 10;
  return rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(1);
}

export function getWaterGrade(totalLiters: number, lang: Language = 'ko'): WaterGrade {
  const g = translations[lang].grades;
  if (totalLiters < 80) {
    return g.saver;
  }
  if (totalLiters < 140) {
    return g.balancer;
  }
  if (totalLiters < 220) {
    return g.spender;
  }
  return g.bigSpender;
}
