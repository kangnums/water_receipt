export interface WaterState {
  shower: { minutes: number; runningTap: boolean; gender?: 'male' | 'female' };
  handwash: { count: number; runningTap: boolean };
  laundry: { count: number };
  toilet: { count: number };
  dish: { count: number; runningTap: boolean };
  cooking: { count: number };
  tumbler: { count: number };
  brush: { count: number; cup: boolean };
  water: { cups: number };
  drink: { count: number };
}

export type WaterItemKey = keyof WaterState;

export interface ItemMeta {
  key: WaterItemKey;
  emoji: string;
  category: 'personal' | 'housework' | 'kitchen' | 'drink';
}

export interface WaterGrade {
  title: string;
  sub: string;
  pct: string;
}
