import React from 'react';
import { motion } from 'motion/react';
import { WaterState } from '../types';
import { ITEM_META } from '../data/waterItems';
import { Language, translations } from '../data/translations';

interface Step1ChecklistProps {
  state: WaterState;
  onChangeState: (newState: WaterState) => void;
  onIssueReceipt: () => void;
  lang: Language;
}

export const Step1Checklist: React.FC<Step1ChecklistProps> = ({
  state,
  onChangeState,
  onIssueReceipt,
  lang,
}) => {
  const t = translations[lang];

  // Handlers
  const updateShowerMinutes = (minutes: number) => {
    onChangeState({ ...state, shower: { ...state.shower, minutes } });
  };

  const updateShowerGender = (gender: 'male' | 'female') => {
    onChangeState({ ...state, shower: { ...state.shower, gender } });
  };

  const toggleShowerRunningTap = () => {
    onChangeState({ ...state, shower: { ...state.shower, runningTap: !state.shower.runningTap } });
  };

  const updateHandwash = (delta: number) => {
    const nextCount = Math.max(0, Math.min(20, state.handwash.count + delta));
    onChangeState({ ...state, handwash: { ...state.handwash, count: nextCount } });
  };

  const toggleHandwashRunningTap = () => {
    onChangeState({ ...state, handwash: { ...state.handwash, runningTap: !state.handwash.runningTap } });
  };

  const updateLaundry = (delta: number) => {
    const nextCount = Math.max(0, Math.min(5, state.laundry.count + delta));
    onChangeState({ ...state, laundry: { count: nextCount } });
  };

  const updateToilet = (delta: number) => {
    const nextCount = Math.max(0, Math.min(15, state.toilet.count + delta));
    onChangeState({ ...state, toilet: { count: nextCount } });
  };

  const updateDish = (delta: number) => {
    const nextCount = Math.max(0, Math.min(5, state.dish.count + delta));
    onChangeState({ ...state, dish: { count: nextCount } });
  };

  const toggleDishRunningTap = () => {
    onChangeState({ ...state, dish: { ...state.dish, runningTap: !state.dish.runningTap } });
  };

  const updateCooking = (delta: number) => {
    const nextCount = Math.max(0, Math.min(10, state.cooking.count + delta));
    onChangeState({ ...state, cooking: { count: nextCount } });
  };

  const updateTumbler = (delta: number) => {
    const nextCount = Math.max(0, Math.min(10, state.tumbler.count + delta));
    onChangeState({ ...state, tumbler: { ...state.tumbler, count: nextCount } });
  };

  const updateBrush = (delta: number) => {
    const nextCount = Math.max(0, Math.min(8, state.brush.count + delta));
    onChangeState({ ...state, brush: { ...state.brush, count: nextCount } });
  };

  const toggleBrushCup = () => {
    onChangeState({ ...state, brush: { ...state.brush, cup: !state.brush.cup } });
  };

  const updateWaterCups = (delta: number) => {
    const nextCups = Math.max(0, Math.min(15, state.water.cups + delta));
    onChangeState({ ...state, water: { ...state.water, cups: nextCups } });
  };

  const updateDrink = (delta: number) => {
    const nextCount = Math.max(0, Math.min(8, state.drink.count + delta));
    onChangeState({ ...state, drink: { ...state.drink, count: nextCount } });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className="space-y-6 pb-20"
    >
      <header>
        <p className="text-[11px] tracking-[0.25em] text-emerald-400 font-mono mb-1 font-semibold">
          {t.step1Tag}
        </p>
        <h1 className="text-2xl font-bold leading-snug text-slate-100 whitespace-pre-line">
          {t.step1Title}
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          {t.step1Desc}
        </p>
      </header>

      {/* Group 1: Personal Hygiene */}
      <section className="space-y-3">
        <h2 className="text-xs font-mono font-bold text-slate-400 tracking-wider uppercase px-1">
          {t.categoryPersonal}
        </h2>

        {/* 1. Shower */}
        <div className="rounded-2xl bg-slate-800/90 border border-slate-700/80 px-4 py-3.5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xl">{ITEM_META.shower.emoji}</span>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-100">{t.items.shower.label}</p>
                <p className="text-[11px] text-slate-400">{t.items.shower.sub}</p>
              </div>
            </div>
            <div className="shrink-0 font-mono font-bold text-emerald-400 text-sm">
              {state.shower.minutes} {t.showerMinutes.minUnit}
            </div>
          </div>

          {/* Gender selection button row */}
          <div className="mt-3 pt-2.5 border-t border-slate-700/50">
            <p className="text-[11px] font-bold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>{t.items.shower.genderLabel}</span>
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => updateShowerGender('male')}
                className={`py-1.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  state.shower.gender === 'male' || !state.shower.gender
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60 shadow-sm'
                    : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-200'
                }`}
              >
                {t.items.shower.genderMale}
              </button>
              <button
                type="button"
                onClick={() => updateShowerGender('female')}
                className={`py-1.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  state.shower.gender === 'female'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60 shadow-sm'
                    : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-200'
                }`}
              >
                {t.items.shower.genderFemale}
              </button>
            </div>
          </div>

          <div className="mt-3.5 space-y-3">
            <input
              type="range"
              min={0}
              max={60}
              step={1}
              value={state.shower.minutes}
              onChange={(e) => updateShowerMinutes(Number(e.target.value))}
              className="w-full cursor-pointer accent-emerald-500 h-1.5 rounded-lg bg-slate-900"
            />

            <div className="relative w-full h-7">
              {[
                { val: 0, label: t.showerMinutes.zero },
                { val: 10, label: t.showerMinutes.m10 },
                { val: 20, label: t.showerMinutes.m20 },
                { val: 30, label: t.showerMinutes.m30 },
                { val: 40, label: t.showerMinutes.m40 },
                { val: 50, label: t.showerMinutes.m50 },
                { val: 60, label: t.showerMinutes.m60 },
              ].map((item) => {
                const pct = (item.val / 60) * 100;
                const isSelected = state.shower.minutes === item.val;

                let transformStyle = '-translate-x-1/2';
                if (item.val === 0) transformStyle = 'translate-x-0';
                if (item.val === 60) transformStyle = '-translate-x-full';

                return (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => updateShowerMinutes(item.val)}
                    style={{ left: `${pct}%` }}
                    className={`absolute top-0 py-0.5 px-1.5 sm:px-2 rounded-full text-[9px] sm:text-[10px] font-bold border transition-all cursor-pointer whitespace-nowrap ${transformStyle} ${
                      isSelected
                        ? 'bg-emerald-500 text-slate-950 border-emerald-500 shadow-sm z-10 scale-105'
                        : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {state.shower.minutes > 0 && (
            <div className="mt-2.5 pt-2 border-t border-slate-700/50 flex justify-end">
              <button
                type="button"
                onClick={toggleShowerRunningTap}
                className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                  state.shower.runningTap
                    ? 'bg-rose-500/10 text-rose-300 border-rose-500/30 hover:bg-rose-500/20'
                    : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
                }`}
              >
                {state.shower.runningTap ? t.items.shower.runningTapOn : t.items.shower.runningTapOff}
              </button>
            </div>
          )}
        </div>

        {/* 2. Handwashing */}
        <div className="rounded-2xl bg-slate-800/90 border border-slate-700/80 px-4 py-3.5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xl">{ITEM_META.handwash.emoji}</span>
              <div className="min-w-0">
                <p className="text-sm font-bold truncate text-slate-100">{t.items.handwash.label}</p>
                <p className="text-[11px] text-slate-400 truncate">{t.items.handwash.sub}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => updateHandwash(-1)}
                disabled={state.handwash.count <= 0}
                className="h-8 w-8 rounded-full bg-slate-900 border border-slate-700 text-slate-100 text-lg font-bold flex items-center justify-center active:scale-90 transition-transform disabled:opacity-40 hover:bg-slate-700 cursor-pointer"
              >
                −
              </button>
              <span className="w-5 text-center font-mono font-bold text-slate-100">{state.handwash.count}</span>
              <button
                type="button"
                onClick={() => updateHandwash(1)}
                className="h-8 w-8 rounded-full bg-slate-900 border border-slate-700 text-slate-100 text-lg font-bold flex items-center justify-center active:scale-90 transition-transform hover:bg-slate-700 cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {state.handwash.count > 0 && (
            <div className="mt-2.5 pt-2 border-t border-slate-700/50 flex justify-end">
              <button
                type="button"
                onClick={toggleHandwashRunningTap}
                className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                  state.handwash.runningTap
                    ? 'bg-rose-500/10 text-rose-300 border-rose-500/30 hover:bg-rose-500/20'
                    : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
                }`}
              >
                {state.handwash.runningTap ? t.items.handwash.runningTapOn : t.items.handwash.runningTapOff}
              </button>
            </div>
          )}
        </div>

        {/* 3. Tooth Brushing */}
        <div className="rounded-2xl bg-slate-800/90 border border-slate-700/80 px-4 py-3.5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xl">{ITEM_META.brush.emoji}</span>
              <div className="min-w-0">
                <p className="text-sm font-bold truncate text-slate-100">{t.items.brush.label}</p>
                <p className="text-[11px] text-slate-400 truncate">{t.items.brush.sub}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => updateBrush(-1)}
                disabled={state.brush.count <= 0}
                className="h-8 w-8 rounded-full bg-slate-900 border border-slate-700 text-slate-100 text-lg font-bold flex items-center justify-center active:scale-90 transition-transform disabled:opacity-40 hover:bg-slate-700 cursor-pointer"
              >
                −
              </button>
              <span className="w-5 text-center font-mono font-bold text-slate-100">{state.brush.count}</span>
              <button
                type="button"
                onClick={() => updateBrush(1)}
                className="h-8 w-8 rounded-full bg-slate-900 border border-slate-700 text-slate-100 text-lg font-bold flex items-center justify-center active:scale-90 transition-transform hover:bg-slate-700 cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {state.brush.count > 0 && (
            <div className="mt-2.5 pt-2 border-t border-slate-700/50 flex justify-end">
              <button
                type="button"
                onClick={toggleBrushCup}
                className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                  state.brush.cup
                    ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-300 border-rose-500/30 hover:bg-rose-500/20'
                }`}
              >
                {state.brush.cup ? t.items.brush.cupOn : t.items.brush.cupOff}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Group 2: Bathroom & Housework */}
      <section className="space-y-3 pt-2">
        <h2 className="text-xs font-mono font-bold text-slate-400 tracking-wider uppercase px-1">
          {t.categoryHousework}
        </h2>

        {/* 1. Toilet Flush */}
        <div className="rounded-2xl bg-slate-800/90 border border-slate-700/80 px-4 py-3.5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xl">{ITEM_META.toilet.emoji}</span>
              <div className="min-w-0">
                <p className="text-sm font-bold truncate text-slate-100">{t.items.toilet.label}</p>
                <p className="text-[11px] text-slate-400 truncate">{t.items.toilet.sub}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => updateToilet(-1)}
                disabled={state.toilet.count <= 0}
                className="h-8 w-8 rounded-full bg-slate-900 border border-slate-700 text-slate-100 text-lg font-bold flex items-center justify-center active:scale-90 transition-transform disabled:opacity-40 hover:bg-slate-700 cursor-pointer"
              >
                −
              </button>
              <span className="w-5 text-center font-mono font-bold text-slate-100">{state.toilet.count}</span>
              <button
                type="button"
                onClick={() => updateToilet(1)}
                className="h-8 w-8 rounded-full bg-slate-900 border border-slate-700 text-slate-100 text-lg font-bold flex items-center justify-center active:scale-90 transition-transform hover:bg-slate-700 cursor-pointer"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* 2. Laundry Machine */}
        <div className="rounded-2xl bg-slate-800/90 border border-slate-700/80 px-4 py-3.5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xl">{ITEM_META.laundry.emoji}</span>
              <div className="min-w-0">
                <p className="text-sm font-bold truncate text-slate-100">{t.items.laundry.label}</p>
                <p className="text-[11px] text-slate-400 truncate">{t.items.laundry.sub}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => updateLaundry(-1)}
                disabled={state.laundry.count <= 0}
                className="h-8 w-8 rounded-full bg-slate-900 border border-slate-700 text-slate-100 text-lg font-bold flex items-center justify-center active:scale-90 transition-transform disabled:opacity-40 hover:bg-slate-700 cursor-pointer"
              >
                −
              </button>
              <span className="w-5 text-center font-mono font-bold text-slate-100">{state.laundry.count}</span>
              <button
                type="button"
                onClick={() => updateLaundry(1)}
                className="h-8 w-8 rounded-full bg-slate-900 border border-slate-700 text-slate-100 text-lg font-bold flex items-center justify-center active:scale-90 transition-transform hover:bg-slate-700 cursor-pointer"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Group 3: Kitchen & Cooking */}
      <section className="space-y-3 pt-2">
        <h2 className="text-xs font-mono font-bold text-slate-400 tracking-wider uppercase px-1">
          {t.categoryKitchen}
        </h2>

        {/* 1. Dishwashing */}
        <div className="rounded-2xl bg-slate-800/90 border border-slate-700/80 px-4 py-3.5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xl">{ITEM_META.dish.emoji}</span>
              <div className="min-w-0">
                <p className="text-sm font-bold truncate text-slate-100">{t.items.dish.label}</p>
                <p className="text-[11px] text-slate-400 truncate">{t.items.dish.sub}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => updateDish(-1)}
                disabled={state.dish.count <= 0}
                className="h-8 w-8 rounded-full bg-slate-900 border border-slate-700 text-slate-100 text-lg font-bold flex items-center justify-center active:scale-90 transition-transform disabled:opacity-40 hover:bg-slate-700 cursor-pointer"
              >
                −
              </button>
              <span className="w-5 text-center font-mono font-bold text-slate-100">{state.dish.count}</span>
              <button
                type="button"
                onClick={() => updateDish(1)}
                className="h-8 w-8 rounded-full bg-slate-900 border border-slate-700 text-slate-100 text-lg font-bold flex items-center justify-center active:scale-90 transition-transform hover:bg-slate-700 cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {state.dish.count > 0 && (
            <div className="mt-2.5 pt-2 border-t border-slate-700/50 flex justify-end">
              <button
                type="button"
                onClick={toggleDishRunningTap}
                className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                  state.dish.runningTap
                    ? 'bg-rose-500/10 text-rose-300 border-rose-500/30 hover:bg-rose-500/20'
                    : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
                }`}
              >
                {state.dish.runningTap ? t.items.dish.runningTapOn : t.items.dish.runningTapOff}
              </button>
            </div>
          )}
        </div>

        {/* 2. Food Prep & Cooking */}
        <div className="rounded-2xl bg-slate-800/90 border border-slate-700/80 px-4 py-3.5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xl">{ITEM_META.cooking.emoji}</span>
              <div className="min-w-0">
                <p className="text-sm font-bold truncate text-slate-100">{t.items.cooking.label}</p>
                <p className="text-[11px] text-slate-400 truncate">{t.items.cooking.sub}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => updateCooking(-1)}
                disabled={state.cooking.count <= 0}
                className="h-8 w-8 rounded-full bg-slate-900 border border-slate-700 text-slate-100 text-lg font-bold flex items-center justify-center active:scale-90 transition-transform disabled:opacity-40 hover:bg-slate-700 cursor-pointer"
              >
                −
              </button>
              <span className="w-5 text-center font-mono font-bold text-slate-100">{state.cooking.count}</span>
              <button
                type="button"
                onClick={() => updateCooking(1)}
                className="h-8 w-8 rounded-full bg-slate-900 border border-slate-700 text-slate-100 text-lg font-bold flex items-center justify-center active:scale-90 transition-transform hover:bg-slate-700 cursor-pointer"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* 3. Tumbler / Cup Washing */}
        <div className="rounded-2xl bg-slate-800/90 border border-slate-700/80 px-4 py-3.5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xl">{ITEM_META.tumbler.emoji}</span>
              <div className="min-w-0">
                <p className="text-sm font-bold truncate text-slate-100">{t.items.tumbler.label}</p>
                <p className="text-[11px] text-slate-400 truncate">{t.items.tumbler.sub}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => updateTumbler(-1)}
                disabled={state.tumbler.count <= 0}
                className="h-8 w-8 rounded-full bg-slate-900 border border-slate-700 text-slate-100 text-lg font-bold flex items-center justify-center active:scale-90 transition-transform disabled:opacity-40 hover:bg-slate-700 cursor-pointer"
              >
                −
              </button>
              <span className="w-5 text-center font-mono font-bold text-slate-100">{state.tumbler.count}</span>
              <button
                type="button"
                onClick={() => updateTumbler(1)}
                className="h-8 w-8 rounded-full bg-slate-900 border border-slate-700 text-slate-100 text-lg font-bold flex items-center justify-center active:scale-90 transition-transform hover:bg-slate-700 cursor-pointer"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Group 2: Drinking Water */}
      <section className="space-y-3 pt-2">
        <h2 className="text-xs font-mono font-bold text-slate-400 tracking-wider uppercase px-1">
          {t.categoryDrink}
        </h2>

        {/* 7. Drinking Water */}
        <div className="rounded-2xl bg-slate-800/90 border border-slate-700/80 px-4 py-3.5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xl">{ITEM_META.water.emoji}</span>
              <div className="min-w-0">
                <p className="text-sm font-bold truncate text-slate-100">{t.items.water.label}</p>
                <p className="text-[11px] text-slate-400 truncate">{t.items.water.sub}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => updateWaterCups(-1)}
                disabled={state.water.cups <= 0}
                className="h-8 w-8 rounded-full bg-slate-900 border border-slate-700 text-slate-100 text-lg font-bold flex items-center justify-center active:scale-90 transition-transform disabled:opacity-40 hover:bg-slate-700 cursor-pointer"
              >
                −
              </button>
              <span className="w-5 text-center font-mono font-bold text-slate-100">{state.water.cups}</span>
              <button
                type="button"
                onClick={() => updateWaterCups(1)}
                className="h-8 w-8 rounded-full bg-slate-900 border border-slate-700 text-slate-100 text-lg font-bold flex items-center justify-center active:scale-90 transition-transform hover:bg-slate-700 cursor-pointer"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* 8. Coffee & Other Drinks */}
        <div className="rounded-2xl bg-slate-800/90 border border-slate-700/80 px-4 py-3.5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xl">{ITEM_META.drink.emoji}</span>
              <div className="min-w-0">
                <p className="text-sm font-bold truncate text-slate-100">{t.items.drink.label}</p>
                <p className="text-[11px] text-slate-400 truncate">{t.items.drink.sub}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => updateDrink(-1)}
                disabled={state.drink.count <= 0}
                className="h-8 w-8 rounded-full bg-slate-900 border border-slate-700 text-slate-100 text-lg font-bold flex items-center justify-center active:scale-90 transition-transform disabled:opacity-40 hover:bg-slate-700 cursor-pointer"
              >
                −
              </button>
              <span className="w-5 text-center font-mono font-bold text-slate-100">{state.drink.count}</span>
              <button
                type="button"
                onClick={() => updateDrink(1)}
                className="h-8 w-8 rounded-full bg-slate-900 border border-slate-700 text-slate-100 text-lg font-bold flex items-center justify-center active:scale-90 transition-transform hover:bg-slate-700 cursor-pointer"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Bottom Bar for Receipt Generation */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 z-30">
        <div className="max-w-md mx-auto">
          <button
            type="button"
            onClick={onIssueReceipt}
            className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-base tracking-wide shadow-[0_8px_24px_rgba(16,185,129,0.3)] active:scale-[0.98] transition-all cursor-pointer"
          >
            {t.issueReceiptBtn}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
