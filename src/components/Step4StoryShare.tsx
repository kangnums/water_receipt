import React, { useRef, useState, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import { safeHtml2Canvas } from '../utils/safeHtml2Canvas';
import { WaterState, WaterItemKey } from '../types';
import { calcTotalUsage, formatVolume, getWaterGrade, ITEM_META, calcItemUsage } from '../data/waterItems';
import { Language, translations } from '../data/translations';
import { recordDonationEvent } from '../utils/donationApi';
import { recordStreakCheckin, recordStreakCheckinAsync } from '../utils/streak';

interface Step4StoryShareProps {
  state: WaterState;
  onRestart: () => void;
  showToast: (msg: string) => void;
  lang: Language;
}

export const Step4StoryShare: React.FC<Step4StoryShareProps> = ({
  state,
  onRestart,
  showToast,
  lang,
}) => {
  const t = translations[lang];
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [streakDays, setStreakDays] = useState<number>(() => recordStreakCheckin());

  useEffect(() => {
    let mounted = true;
    recordStreakCheckinAsync().then((updated) => {
      if (mounted) {
        setStreakDays(updated);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const total = calcTotalUsage(state);
  const totalFormatted = formatVolume(total);
  const grade = getWaterGrade(total, lang);

  const now = useMemo(() => new Date(), []);
  const pad = (n: number) => String(n).padStart(2, '0');
  const dateStr = `${now.getFullYear()}.${pad(now.getMonth() + 1)}.${pad(now.getDate())}`;
  const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}`;

  const receiptNo = useMemo(() => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const yy = String(now.getFullYear()).slice(2);
    return `NO. ${yy}${pad(now.getMonth() + 1)}${pad(now.getDate())}-WR-${randomNum}`;
  }, [now]);

  const barcodeBars = useMemo(
    () => [1, 2, 1, 3, 1, 2, 2, 1, 3, 1, 2, 1, 3, 2, 1, 2, 1, 3, 1, 2, 1, 2, 3, 1, 2, 1, 1, 3, 2, 1],
    []
  );

  const activeItems = useMemo(() => {
    const keys = Object.keys(ITEM_META) as WaterItemKey[];
    return keys
      .map((key) => {
        const usage = calcItemUsage(key, state);
        return {
          key,
          emoji: ITEM_META[key].emoji,
          label: t.items[key]?.label || key,
          usage: Math.round(usage * 10) / 10,
        };
      })
      .filter((item) => item.usage > 0);
  }, [state, t]);

  const handleInstagramStory = async () => {
    if (!cardRef.current || isGenerating) return;

    try {
      setIsGenerating(true);

      // 1. Call Donation Accumulation API event
      const donationResult = await recordDonationEvent(100);
      if (donationResult.success) {
        showToast(t.donationSuccessToast);
      }

      // 2. Generate Story Canvas Image
      const canvas = await safeHtml2Canvas(cardRef.current, {
        backgroundColor: null,
        scale: 3,
        useCORS: true,
      });

      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
      if (!blob) return;

      const file = new File([blob], 'water-receipt-story.png', { type: 'image/png' });

      // 3. Try to copy image to clipboard so user can easily paste into Instagram Story
      if (navigator.clipboard && window.ClipboardItem) {
        try {
          await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        } catch {
          // Clipboard access skipped
        }
      }

      // 4. Try Native File Share on mobile devices (iOS Safari / Android)
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: t.appTitle,
            text: `${t.appTitle} 💧 ${totalFormatted}L (${grade.title})`,
          });
          return;
        } catch {
          // User dismissed native share sheet
        }
      }

      // 5. Deep Link to Instagram Story Camera app on mobile / fallback to Web
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      
      // Auto-download image so it's in the device gallery/downloads
      const link = document.createElement('a');
      link.download = 'water-receipt-story.png';
      link.href = canvas.toDataURL('image/png');
      link.click();

      if (isMobile) {
        const deepLink = 'instagram-stories://share';
        const fallbackDeepLink = 'instagram://story-camera';
        const startTime = Date.now();

        window.location.href = deepLink;

        setTimeout(() => {
          if (Date.now() - startTime < 1800) {
            window.location.href = fallbackDeepLink;
            setTimeout(() => {
              if (Date.now() - startTime < 2800) {
                window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer');
              }
            }, 800);
          }
        }, 800);
      } else {
        setTimeout(() => {
          window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer');
        }, 800);
      }
    } catch (err) {
      console.error('Failed to prepare Instagram story:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyImage = async () => {
    if (!cardRef.current || isGenerating) return;
    try {
      setIsGenerating(true);

      await recordDonationEvent(100);

      const canvas = await safeHtml2Canvas(cardRef.current, {
        backgroundColor: null,
        scale: 3,
        useCORS: true,
      });

      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
      if (!blob) return;

      if (navigator.clipboard && window.ClipboardItem) {
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob }),
          ]);
          showToast(t.toastImgCopySuccess);
          return;
        } catch (e) {
          console.warn('Clipboard write failed:', e);
        }
      }

      // Fallback if clipboard write not permitted: download image
      const link = document.createElement('a');
      link.download = 'water-receipt-story.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      showToast(t.toastImgSuccess);
    } catch (err) {
      console.error('Failed to copy image:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveImage = async () => {
    if (!cardRef.current || isGenerating) return;
    try {
      setIsGenerating(true);

      await recordDonationEvent(100);

      const canvas = await safeHtml2Canvas(cardRef.current, {
        backgroundColor: null,
        scale: 3,
        useCORS: true,
      });
      const link = document.createElement('a');
      link.download = 'water-receipt-story.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      showToast(t.toastImgSuccess);
    } catch (err) {
      console.error('Failed to save image:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async () => {
    if (isGenerating) return;

    try {
      setIsGenerating(true);
      const text = `${t.appTitle} 💧 ${totalFormatted}L (${grade.title})`;

      await recordDonationEvent(100);

      if (navigator.share && cardRef.current) {
        try {
          const canvas = await safeHtml2Canvas(cardRef.current, {
            backgroundColor: null,
            scale: 3,
            useCORS: true,
          });

          const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
          if (blob) {
            const file = new File([blob], 'water-receipt.png', { type: 'image/png' });
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
              try {
                await navigator.share({ text, files: [file] });
                return;
              } catch (e) {
                console.warn('File share cancelled or failed:', e);
                if (e instanceof Error && (e.name === 'AbortError' || e.name === 'InvalidStateError')) {
                  return;
                }
              }
            }
          }

          try {
            await navigator.share({ text });
          } catch (e) {
            console.warn('Text share cancelled or failed:', e);
          }
        } catch (e) {
          console.warn('Share operation cancelled or failed:', e);
        }
      } else {
        try {
          await navigator.clipboard.writeText(text);
          showToast(t.toastCopySuccess);
        } catch (e) {
          showToast(text);
        }
      }
    } catch (err) {
      console.error('Share error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      <header>
        <p className="text-[11px] tracking-[0.25em] text-emerald-400 font-mono mb-1 font-semibold">
          {t.step4Tag}
        </p>
        <div className="flex items-center gap-2.5 flex-wrap">
          <h1 className="text-2xl font-bold text-slate-100">{t.step4Title}</h1>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-cyan-950/90 text-cyan-300 border border-cyan-500/50 shadow-md">
            <span className="text-xl leading-none">💧</span>
            <span className="text-sm font-extrabold">{t.streakBadge ? t.streakBadge.replace('{days}', String(streakDays)) : `${streakDays}일 연속`}</span>
          </div>
        </div>
        <p className="text-sm text-slate-400 mt-1">
          {t.step4Desc}
        </p>
      </header>

      {/* 9:16 Instagram Story Canvas Frame */}
      <div className="mx-auto w-full max-w-[320px]">
        <div
          ref={cardRef}
          id="storyCard"
          className="story-frame w-full aspect-[9/16] rounded-[28px] overflow-hidden relative shadow-2xl p-4 flex flex-col justify-between items-center select-none border border-slate-800"
          style={{
            background: 'radial-gradient(120% 100% at 50% 10%, #1e293b 0%, #0f172a 60%, #080d1a 100%)',
          }}
        >
          {/* Top Canvas Header */}
          <div className="w-full text-center pt-0.5">
            <p className="text-[10px] tracking-[0.3em] text-emerald-400 font-mono font-bold uppercase">
              {t.receiptHeader}
            </p>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">{dateStr}</p>
          </div>

          {/* Retro Vintage Cream Receipt Paper */}
          <div className="w-full bg-[#F3EFE0] text-slate-900 rounded-lg p-4 shadow-xl font-mono border border-[#E0D9C0] flex flex-col justify-between my-2">
            {/* Receipt Title & Timestamp */}
            <div className="text-center pb-2 border-b border-slate-300">
              <div className="flex items-center justify-between gap-1 mb-1">
                <h3 className="text-xs font-black tracking-widest text-slate-900 uppercase">
                  {t.receiptHeader}
                </h3>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-cyan-100 text-cyan-900 border border-cyan-400/60 shrink-0">
                  <span className="text-sm leading-none">💧</span>
                  <span>{t.streakBadge ? t.streakBadge.replace('{days}', String(streakDays)) : `${streakDays}일 연속`}</span>
                </span>
              </div>
              <p className="text-[10px] text-slate-600 tracking-wider">
                {dateStr} &nbsp; {timeStr}
              </p>
            </div>

            {/* Receipt Itemized List */}
            <div className="py-2.5 space-y-1.5 text-xs">
              {activeItems.length > 0 ? (
                activeItems.slice(0, 6).map((item) => (
                  <div key={item.key} className="flex items-center justify-between text-slate-900">
                    <span className="truncate pr-1 font-sans font-semibold flex items-center gap-1.5">
                      <span>{item.emoji}</span>
                      <span>{item.label}</span>
                    </span>
                    <span className="flex-1 border-b border-dotted border-slate-400 mx-1 mb-1" />
                    <span className="font-extrabold shrink-0 font-mono text-slate-950">
                      {formatVolume(item.usage)} L
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center text-slate-500 py-2 text-xs">{t.noRecords}</div>
              )}
            </div>

            {/* Receipt Total */}
            <div className="border-t-2 border-slate-900 pt-2 flex items-baseline justify-between mt-1">
              <div>
                <span className="text-xs font-black font-mono tracking-wider block">TOTAL</span>
                <span className="text-[10px] font-bold text-emerald-700 font-sans">{grade.title}</span>
              </div>
              <span className="text-2xl font-black font-mono text-slate-950 tracking-tight">
                {totalFormatted}L
              </span>
            </div>

            {/* Receipt Barcode */}
            <div className="pt-2 text-center">
              <div className="flex justify-center items-center gap-[2px] h-7 mb-1">
                {barcodeBars.map((w, idx) => (
                  <div
                    key={idx}
                    className="h-full bg-slate-900 rounded-[0.5px]"
                    style={{ width: `${w}px` }}
                  />
                ))}
              </div>
              <p className="text-[9px] tracking-[0.16em] text-slate-600 font-mono">
                {receiptNo}
              </p>
            </div>
          </div>

          {/* Bottom Info Footer */}
          <div className="w-full pb-1 pt-1">
            <p className="text-[10px] text-slate-300 text-center leading-snug flex items-center justify-center gap-1.5 font-medium bg-slate-900/60 py-2 px-3 rounded-xl border border-slate-700/50">
              <span className="text-sm">💧</span> {t.donationInfo}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-3 pt-2">
        <button
          type="button"
          onClick={handleInstagramStory}
          disabled={isGenerating}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:opacity-95 text-white font-bold text-base shadow-[0_8px_20px_rgba(225,29,72,0.3)] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isGenerating ? '⏳ ...' : t.instaStoryBtn}
        </button>
        <button
          type="button"
          onClick={handleCopyImage}
          disabled={isGenerating}
          className="w-full py-3.5 rounded-2xl bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-100 font-semibold text-sm active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
        >
          {isGenerating ? '⏳ ...' : t.copyImgBtn}
        </button>
        <button
          type="button"
          onClick={handleSaveImage}
          disabled={isGenerating}
          className="w-full py-3.5 rounded-2xl bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-100 font-semibold text-sm active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
        >
          {isGenerating ? '⏳ ...' : t.saveImgBtn}
        </button>
        <button
          type="button"
          onClick={handleShare}
          disabled={isGenerating}
          className="w-full py-3.5 rounded-2xl bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 font-semibold text-sm active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
        >
          {isGenerating ? '⏳ ...' : t.shareBtn}
        </button>
        <button
          type="button"
          onClick={onRestart}
          className="w-full py-3 rounded-2xl text-slate-400 hover:text-slate-100 text-sm transition-colors cursor-pointer"
        >
          {t.restartBtn}
        </button>
      </div>
    </motion.div>
  );
};
