import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { WaterState, WaterItemKey } from '../types';
import { calcItemUsage, calcTotalUsage, formatVolume, ITEM_META } from '../data/waterItems';
import { Language, translations } from '../data/translations';

interface Step2ReceiptProps {
  state: WaterState;
  onNext: () => void;
  onBack: () => void;
  lang: Language;
}

export const Step2Receipt: React.FC<Step2ReceiptProps> = ({ state, onNext, onBack, lang }) => {
  const t = translations[lang];
  const total = calcTotalUsage(state);
  const totalFormatted = formatVolume(total);

  const now = useMemo(() => new Date(), []);
  const pad = (n: number) => String(n).padStart(2, '0');
  const dateStr = `${now.getFullYear()}.${pad(now.getMonth() + 1)}.${pad(now.getDate())} ${pad(
    now.getHours()
  )}:${pad(now.getMinutes())}`;

  const receiptNo = useMemo(() => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `NO. ${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${randomNum}`;
  }, [now]);

  // Generate deterministic barcode bar widths
  const barcodeBars = useMemo(() => {
    return [1, 1, 2, 1, 3, 2, 1, 2, 3, 1, 2, 1, 1, 3, 2, 1, 2, 1, 3, 1, 2, 2, 1, 3, 1, 2, 1, 3, 2, 1, 2, 1, 3, 1, 2, 1, 2, 1];
  }, []);

  const activeKeys = (Object.keys(ITEM_META) as WaterItemKey[]).filter(
    (key) => calcItemUsage(key, state) > 0
  );

  const getItemDetailText = (key: WaterItemKey): string => {
    const itemInfo = t.items[key];
    switch (key) {
      case 'shower':
        return `${state.shower.minutes}${itemInfo.unit} ${state.shower.runningTap ? '🚰' : '🚿'}`;
      case 'handwash':
        return `${state.handwash.count}${itemInfo.unit} ${state.handwash.runningTap ? '🚰' : '🫧'}`;
      case 'laundry':
        return `${state.laundry.count}${itemInfo.unit}`;
      case 'toilet':
        return `${state.toilet.count}${itemInfo.unit}`;
      case 'dish':
        return `${state.dish.count}${itemInfo.unit} ${state.dish.runningTap ? '🚰' : '🥣'}`;
      case 'cooking':
        return `${state.cooking.count}${itemInfo.unit}`;
      case 'tumbler':
        return `${state.tumbler.count}${itemInfo.unit}`;
      case 'brush':
        return `${state.brush.count}${itemInfo.unit} ${state.brush.cup ? '💧' : '🚰'}`;
      case 'water':
        return `${state.water.cups}${itemInfo.unit}`;
      case 'drink':
        return `${state.drink.count}${itemInfo.unit}`;
      default:
        return '';
    }
  };

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
          {t.step2Tag}
        </p>
        <h1 className="text-2xl font-bold text-slate-100">{t.step2Title}</h1>
      </header>

      {/* Perforated Receipt Card */}
      <div className="receipt bg-slate-50 text-slate-900 rounded-sm mx-1 px-6 pt-8 pb-7 shadow-2xl font-mono">
        <div className="text-center mb-4">
          <p className="text-[10px] tracking-[0.3em] text-slate-500">※ ※ ※ ※ ※ ※ ※ ※ ※</p>
          <h2 className="text-lg font-bold tracking-wide mt-2 text-slate-900">{t.receiptHeader}</h2>
          <p className="text-[11px] text-slate-600 mt-1">{dateStr}</p>
        </div>

        <div className="border-t border-b border-dashed border-slate-300 py-3 my-3 text-[13px] space-y-2">
          {activeKeys.length > 0 ? (
            activeKeys.map((key) => {
              const meta = ITEM_META[key];
              const detailText = getItemDetailText(key);
              return (
                <div key={key} className="flex items-end gap-1.5">
                  <span className="shrink-0 text-slate-800 font-semibold">
                    {meta.emoji} {t.items[key].label}
                  </span>
                  <span className="flex-1 border-b border-dotted border-slate-300 mb-1" />
                  <span className="shrink-0 font-bold text-slate-900">{detailText}</span>
                </div>
              );
            })
          ) : (
            <p className="text-center text-slate-400 py-2">{t.noRecords}</p>
          )}
        </div>

        <div className="flex items-end justify-between mt-2 mb-4">
          <span className="text-sm font-bold text-slate-900">{t.totalLabel}</span>
          <span className="flex-1 mx-2 border-b border-dotted border-slate-400 mb-1" />
          <span className="text-xl font-extrabold text-slate-900">{totalFormatted} L</span>
        </div>

        {/* Barcode */}
        <div className="flex justify-center gap-[2px] h-11 mb-2 items-center">
          {barcodeBars.map((w, idx) => (
            <div
              key={idx}
              className="barcode-bar h-full rounded-xs bg-slate-900"
              style={{ width: `${w}px` }}
            />
          ))}
        </div>
        <p className="text-center text-[10px] tracking-[0.15em] text-slate-500">
          {receiptNo}
        </p>
      </div>

      <div className="mt-6 rounded-2xl bg-slate-800/90 border border-slate-700/80 px-5 py-4 text-center shadow-sm">
        <p className="text-sm text-slate-300">{t.todayTotalMsg1}</p>
        <p className="text-2xl font-extrabold my-1 text-slate-100">
          <span className="text-emerald-400">{totalFormatted}</span> {t.todayTotalMsg2}
        </p>
      </div>

      <div className="space-y-3 pt-2">
        <button
          type="button"
          onClick={onNext}
          className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-base tracking-wide shadow-[0_8px_20px_rgba(16,185,129,0.25)] active:scale-[0.98] transition-all cursor-pointer"
        >
          {t.toAnalysisBtn}
        </button>
        <button
          type="button"
          onClick={onBack}
          className="w-full py-3 rounded-2xl border border-slate-700 text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 text-sm transition-colors cursor-pointer"
        >
          {t.backToChecklistBtn}
        </button>
      </div>
    </motion.div>
  );
};
