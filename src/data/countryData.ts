import { Language } from './translations';

export type CountryKey = 'kr' | 'us' | 'jp' | 'uk' | 'de' | 'fr' | 'cn' | 'global';

export interface CountryInfo {
  id: CountryKey;
  flag: string;
  amount: number;
  name: Record<Language, string>;
  source: Record<Language, string>;
}

export const COUNTRY_LIST: CountryInfo[] = [
  {
    id: 'kr',
    flag: '🇰🇷',
    amount: 214,
    name: {
      ko: '대한민국',
      en: 'South Korea',
      ja: '韓国',
      zh: '韩国',
    },
    source: {
      ko: '환경부·통계청(KOSIS) 상수도통계 (가정용수 기준)',
      en: 'Ministry of Environment & KOSIS Waterworks Statistics',
      ja: '環境部・統計庁(KOSIS) 上水道統計 (家庭用水基準)',
      zh: '环境部与国家统计门户(KOSIS) 自来水统计',
    },
  },
  {
    id: 'us',
    flag: '🇺🇸',
    amount: 310,
    name: {
      ko: '미국',
      en: 'United States',
      ja: 'アメリカ',
      zh: '美国',
    },
    source: {
      ko: '미국 지질조사국(USGS) & 환경청(EPA) WaterSense',
      en: 'USGS Domestic Water Use & EPA WaterSense Statistics',
      ja: '米国地質調査所(USGS) & 環境保護庁(EPA) 統計',
      zh: '美国地质调查局(USGS) 与 环保署(EPA) 统计',
    },
  },
  {
    id: 'jp',
    flag: '🇯🇵',
    amount: 214,
    name: {
      ko: '일본',
      en: 'Japan',
      ja: '日本',
      zh: '日本',
    },
    source: {
      ko: '일본 국토교통성(MLIT) 수자원백서 & 도쿄도 수도국',
      en: 'Japan Ministry of Land, Infrastructure, Transport (MLIT)',
      ja: '国土交通省 水資源白書 & 東京都水道局 統計',
      zh: '日本国土交通省 水资源白皮书 与 东京都水道局',
    },
  },
  {
    id: 'uk',
    flag: '🇬🇧',
    amount: 144,
    name: {
      ko: '영국',
      en: 'United Kingdom',
      ja: 'イギリス',
      zh: '英国',
    },
    source: {
      ko: '영국 환경식품농무부(Defra) & Discover Water(Water UK)',
      en: 'UK Dept. for Environment, Food & Rural Affairs (Defra)',
      ja: '英国 環境・食糧・農村地域省(Defra) & Water UK',
      zh: '英国 环境、食品和农村事务部(Defra) & Water UK',
    },
  },
  {
    id: 'de',
    flag: '🇩🇪',
    amount: 128,
    name: {
      ko: '독일',
      en: 'Germany',
      ja: 'ドイツ',
      zh: '德国',
    },
    source: {
      ko: '독일 연방통계청(Destatis) & 에너지수자원경제협회(BDEW)',
      en: 'Federal Statistical Office of Germany (Destatis) & BDEW',
      ja: 'ドイツ連邦統計庁(Destatis) & 水道事業連盟(BDEW)',
      zh: '德国联邦统计局(Destatis) 与 水行业协会(BDEW)',
    },
  },
  {
    id: 'fr',
    flag: '🇫🇷',
    amount: 149,
    name: {
      ko: '프랑스',
      en: 'France',
      ja: 'フランス',
      zh: '法国',
    },
    source: {
      ko: '프랑스 국립통계경제연구원(INSEE) & 정보물센터(CIEAU)',
      en: 'National Institute of Statistics (INSEE) & CIEAU',
      ja: 'フランス国立統計経済研究所(INSEE) & CIEAU',
      zh: '法国国家统计与经济研究所(INSEE) 与 CIEAU',
    },
  },
  {
    id: 'cn',
    flag: '🇨🇳',
    amount: 178,
    name: {
      ko: '중국',
      en: 'China',
      ja: '中国',
      zh: '中国',
    },
    source: {
      ko: '중국 국가통계국(NBS) & 수리부 중국수자원공보',
      en: 'National Bureau of Statistics of China (NBS) & MWR',
      ja: '中国 国家統計局(NBS) & 水利部 水資源公報',
      zh: '中国 国家统计局(NBS) 与 水利部《中国水资源公报》',
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
    source: {
      ko: 'UN-Water & 세계보건기구(WHO) 국제 보고서',
      en: 'UN-Water & World Health Organization (WHO) Data',
      ja: 'UN-Water & 世界保健機関(WHO) 国際統計',
      zh: '联合国水机制(UN-Water) 与 世界卫生组织(WHO) 数据',
    },
  },
];

export const DEFAULT_COUNTRY_KEY: CountryKey = 'kr';
