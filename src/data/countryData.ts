import { Language } from './translations';

export type CountryKey = 'kr' | 'us' | 'jp' | 'uk' | 'de' | 'fr' | 'cn' | 'global';

export interface CountryInfo {
  id: CountryKey;
  flag: string;
  amount: number;
  name: Record<Language, string>;
}

export const COUNTRY_LIST: CountryInfo[] = [
  {
    id: 'kr',
    flag: '🇰🇷',
    amount: 125,
    name: {
      ko: '대한민국',
      en: 'South Korea',
      ja: '韓国',
      zh: '韩国',
    },
  },
  {
    id: 'us',
    flag: '🇺🇸',
    amount: 300,
    name: {
      ko: '미국',
      en: 'United States',
      ja: 'アメリカ',
      zh: '美国',
    },
  },
  {
    id: 'jp',
    flag: '🇯🇵',
    amount: 180,
    name: {
      ko: '일본',
      en: 'Japan',
      ja: '日本',
      zh: '日本',
    },
  },
  {
    id: 'uk',
    flag: '🇬🇧',
    amount: 150,
    name: {
      ko: '영국',
      en: 'United Kingdom',
      ja: 'イギリス',
      zh: '英国',
    },
  },
  {
    id: 'de',
    flag: '🇩🇪',
    amount: 120,
    name: {
      ko: '독일',
      en: 'Germany',
      ja: 'ドイツ',
      zh: '德国',
    },
  },
  {
    id: 'fr',
    flag: '🇫🇷',
    amount: 150,
    name: {
      ko: '프랑스',
      en: 'France',
      ja: 'フランス',
      zh: '法国',
    },
  },
  {
    id: 'cn',
    flag: '🇨🇳',
    amount: 100,
    name: {
      ko: '중국',
      en: 'China',
      ja: '中国',
      zh: '中国',
    },
  },
  {
    id: 'global',
    flag: '🌍',
    amount: 150,
    name: {
      ko: '세계 평균',
      en: 'Global Average',
      ja: '世界平均',
      zh: '全球平均',
    },
  },
];

export const DEFAULT_COUNTRY_KEY: CountryKey = 'kr';
