import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { WaterState } from '../types';
import { calcTotalUsage, formatVolume, getWaterGrade } from '../data/waterItems';
import { Language, translations } from '../data/translations';
import { CountryKey, COUNTRY_LIST } from '../data/countryData';
import { getStreak } from '../utils/streak';

interface Step3AnalysisProps {
  state: WaterState;
  onNext: () => void;
  lang: Language;
  countryKey: CountryKey;
  onSelectCountryKey: (key: CountryKey) => void;
}

export const Step3Analysis: React.FC<Step3AnalysisProps> = ({
  state,
  onNext,
  lang,
  countryKey,
  onSelectCountryKey,
}) => {
  const t = translations[lang];
  const streakDays = useMemo(() => getStreak(), []);
  const total = calcTotalUsage(state);
  const totalFormatted = formatVolume(total);
  const grade = getWaterGrade(total, lang);

  // Selected country daily benchmark average
  const countryInfo = useMemo(() => {
    return COUNTRY_LIST.find((c) => c.id === countryKey) || COUNTRY_LIST[0];
  }, [countryKey]);

  const avgOthers = countryInfo.amount;

  const maxScale = Math.max(total, avgOthers, 80) * 1.15;
  const myPercent = (total / maxScale) * 100;
  const avgPercent = (avgOthers / maxScale) * 100;

  const diff = total - avgOthers;
  const diffAbs = Math.abs(diff);
  const diffPct = Math.round((diffAbs / avgOthers) * 100);

  // Water scarcity calculation (5-person family daily supply in water-scarce regions = ~30L)
  const familyDaily = 30;
  const familyDays = total / familyDaily;
  const daysLo = Math.max(1, Math.floor(familyDays));
  const daysHi = Math.max(daysLo + 1, Math.ceil(familyDays));

  const reflectionText = useMemo(() => {
    if (total >= 150) return t.reflectionHigh;
    if (total >= 90) return t.reflectionMid;
    return t.reflectionLow;
  }, [total, t]);

  const scarcityText = useMemo(() => {
    return t.scarcityMsg
      .replace('{total}', totalFormatted)
      .replace('{daysLo}', String(daysLo))
      .replace('{daysHi}', String(daysHi));
  }, [t, totalFormatted, daysLo, daysHi]);

  const diffText = useMemo(() => {
    if (diff >= 0) {
      return `+${formatVolume(diff)}L · ${t.moreThanAvg.replace('{diff}', formatVolume(diff)).replace('{pct}', String(diffPct))}`;
    } else {
      return `-${formatVolume(diffAbs)}L · ${t.lessThanAvg.replace('{diff}', formatVolume(diffAbs)).replace('{pct}', String(diffPct))}`;
    }
  }, [diff, diffAbs, diffPct, t]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className="space-y-5"
    >
      <header>
        <p className="text-[11px] tracking-[0.25em] text-emerald-400 font-mono mb-1 font-semibold">
          {t.step3Tag}
        </p>
        <h1 className="text-2xl font-bold text-slate-100 whitespace-pre-line">
          {t.step3Title}
        </h1>
      </header>

      {/* Grade Title Card */}
      <div className="rounded-2xl bg-slate-800/90 border border-slate-700/80 p-5 shadow-sm">
        <p className="text-[11px] text-slate-400 font-mono mb-1 uppercase tracking-wider">
          {grade.sub}
        </p>
        <p className="text-3xl font-extrabold mb-1 text-emerald-400">{grade.title}</p>
        <p className="text-sm text-slate-300">{grade.pct}</p>
      </div>

      {/* Comparison Bar Chart */}
      <div className="rounded-2xl bg-slate-800/90 border border-slate-700/80 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-700/60">
          <div>
            <p className="text-[11px] text-slate-400 font-mono uppercase tracking-wider">
              {t.vsAverageLabel}
            </p>
            <p className="text-xs text-slate-300 font-medium mt-0.5">
              {t.compareCountryLabel}: <span className="text-emerald-400 font-bold">{countryInfo.flag} {countryInfo.name[lang]} ({countryInfo.amount}L)</span>
            </p>
          </div>
          <select
            value={countryKey}
            onChange={(e) => onSelectCountryKey(e.target.value as CountryKey)}
            className="bg-slate-900 text-slate-200 text-xs py-1.5 px-2.5 rounded-xl border border-slate-700 font-medium focus:outline-none focus:border-emerald-500 cursor-pointer shadow-sm hover:border-slate-600 transition-colors"
          >
            {COUNTRY_LIST.map((c) => (
              <option key={c.id} value={c.id}>
                {c.flag} {c.name[lang]} ({c.amount}L)
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs mb-1 text-slate-200">
              <span>{t.meLabel}</span>
              <span className="font-mono font-bold text-slate-100">{totalFormatted}L</span>
            </div>
            <div className="h-3 rounded-full bg-slate-900 overflow-hidden border border-slate-700/50">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${myPercent}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-emerald-500 rounded-full"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1 text-slate-400">
              <span>{t.avgLabel} <span className="text-[10px] text-slate-400 font-normal">({countryInfo.flag} {countryInfo.name[lang]})</span></span>
              <span className="font-mono">{avgOthers}L</span>
            </div>
            <div className="h-3 rounded-full bg-slate-900 overflow-hidden border border-slate-700/50">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${avgPercent}%` }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
                className="h-full bg-slate-500 rounded-full"
              />
            </div>
          </div>
        </div>

        <p className="text-sm font-bold mt-4 text-center">
          <span className="text-emerald-400">
            {diffText}
          </span>
        </p>

        {countryInfo.source && (
          <div className="mt-3.5 pt-2.5 border-t border-slate-700/50 flex items-start gap-1.5 text-[10px] text-slate-400">
            <span className="font-mono text-emerald-400 shrink-0 font-semibold">[{t.statSourcePrefix || '출처'}]</span>
            <span className="leading-tight text-slate-400">{countryInfo.source[lang]}</span>
          </div>
        )}
      </div>

      {/* Water Scarcity Check */}
      <div className="rounded-2xl bg-slate-900 border-2 border-emerald-500/40 p-5 shadow-sm">
        <p className="text-[11px] text-emerald-400 font-mono mb-2 tracking-wider font-semibold">
          {t.scarcityTag}
        </p>
        <p className="text-base leading-relaxed text-slate-200">
          {scarcityText}
        </p>
        <p className="text-[11px] text-slate-400 mt-3 leading-relaxed">
          {t.scarcityFootnote}
        </p>
      </div>

      <p className="text-center text-slate-400 text-sm py-1">{reflectionText}</p>

      <button
        type="button"
        onClick={onNext}
        className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-base tracking-wide active:scale-[0.98] transition-all cursor-pointer shadow-[0_8px_24px_rgba(16,185,129,0.25)] flex items-center justify-center gap-2"
      >
        <span>{t.toShareBtn}</span>
        <span className="inline-flex items-center gap-1 bg-slate-950/20 text-slate-950 px-2.5 py-1 rounded-full text-xs font-black">
          <span className="text-base leading-none">💧</span>
          <span>{streakDays}일 연속</span>
        </span>
      </button>
    </motion.div>
  );
};

