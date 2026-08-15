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
  switch (key) {
    case 'shower': {
      let runRate = RATE_SHOWER_RUNNING;
      let saveRate = RATE_SHOWER_SAVING;
      if (state.shower.gender === 'male') {
        runRate = RATE_SHOWER_MALE_RUNNING;
        saveRate = RATE_SHOWER_MALE_SAVING;
      } else if (state.shower.gender === 'female') {
        runRate = RATE_SHOWER_FEMALE_RUNNING;
        saveRate = RATE_SHOWER_FEMALE_SAVING;
      }
      return state.shower.minutes * (state.shower.runningTap ? runRate : saveRate);
    }
    case 'handwash':
      return state.handwash.count * (state.handwash.runningTap ? RATE_HANDWASH_TAP : RATE_HANDWASH_SAVING);
    case 'laundry':
      return state.laundry.count * RATE_LAUNDRY;
    case 'toilet':
      return state.toilet.count * RATE_TOILET;
    case 'dish':
      return state.dish.count * (state.dish.runningTap ? RATE_DISH_RUNNING : RATE_DISH_SAVING);
    case 'cooking':
      return state.cooking.count * RATE_COOKING;
    case 'tumbler':
      return state.tumbler.count * RATE_TUMBLER;
    case 'brush':
      return state.brush.count * (state.brush.cup ? RATE_BRUSH_CUP : RATE_BRUSH_TAP);
    case 'water':
      return state.water.cups * RATE_CUP;
    case 'drink':
      return state.drink.count * RATE_DRINK;
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
