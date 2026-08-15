import React, { useRef, useState, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import { safeHtml2Canvas } from '../utils/safeHtml2Canvas';
import { WaterState, WaterItemKey } from '../types';
import { calcTotalUsage, formatVolume, getWaterGrade, ITEM_META, calcItemUsage } from '../data/waterItems';
import { Language, translations } from '../data/translations';
import { recordDonationEvent } from '../utils/donationApi';
import { recordStreakCheckin, recordStreakCheckinAsync } from '../utils/streak';
import { auth, onAuthStateChanged, getSavedRegisteredUser, User } from '../firebase';
import { AuthModal } from './AuthModal';

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
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [savedUser, setSavedUser] = useState(() => getSavedRegisteredUser());

  useEffect(() => {
    let mounted = true;
    recordStreakCheckinAsync().then((updated) => {
      if (mounted) {
        setStreakDays(updated);
      }
    });

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (mounted) {
        setCurrentUser(user);
        setSavedUser(getSavedRegisteredUser());
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const isUserRegistered = !!savedUser;

  const total = calcTotalUsage(state);
  const totalFormatted = formatVolume(total);
  const grade = getWaterGrade(total, lang);

  const now = useMemo(() => new Date(), []);
  const pad = (n: number) => String(n).padStart(2, '0');
  const dateStr = `${now.getFullYear()}.${pad(now.getMonth() + 1)}.${pad(now.getDate())}`;
  const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  const receiptNo = useMemo(
    () => `WR-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${Math.floor(1000 + Math.random() * 9000)}`,
    [now]
  );

  const activeItems = useMemo(() => {
    return (Object.keys(ITEM_META) as WaterItemKey[])
      .map((k) => ({
        key: k,
        label: t.items[k]?.label || k,
        emoji: ITEM_META[k].emoji,
        usage: calcItemUsage(k, state),
      }))
      .filter((i) => i.usage > 0);
  }, [state, t]);

  const barcodeBars = useMemo(
    () => [
      2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 4, 1, 2, 3, 1, 2, 1, 4, 2, 1, 3, 1,
      2, 1, 4, 2, 1, 3, 2, 1, 4, 1, 2, 3, 1, 2, 1, 3, 2, 1, 4, 1, 2, 1, 3,
    ],
    []
  );

  const generateBlob = async (): Promise<Blob | null> => {
    if (!cardRef.current) return null;
    const canvas = await safeHtml2Canvas(cardRef.current, {
      scale: 3,
      useCORS: true,
      backgroundColor: undefined,
    });
    return new Promise<Blob | null>((resolve) => {
      canvas.toBlob((b) => resolve(b), 'image/png', 1.0);
    });
  };

  const handleInstagramStory = async () => {
    setIsGenerating(true);
    try {
      recordDonationEvent(100);

      const blob = await generateBlob();
      if (!blob) {
        showToast(t.donationSuccessToast);
        setTimeout(() => {
          window.location.href = 'https://www.instagram.com/';
        }, 1200);
        return;
      }

      const file = new File([blob], `water_receipt_${receiptNo}.png`, { type: 'image/png' });
      const nav = navigator as any;

      if (nav.canShare && nav.canShare({ files: [file] })) {
        try {
          await nav.share({
            files: [file],
            title: t.appTitle,
            text: `💧 ${t.receiptHeader} | ${t.streakBadge ? t.streakBadge.replace('{days}', String(streakDays)) : `${streakDays}일 연속`} @GoodNeighbors #물사용량영수증 #식수지원캠페인`,
          });
          return;
        } catch (err: any) {
          if (err.name === 'AbortError') return;
        }
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `water_receipt_story_${receiptNo}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showToast(t.donationSuccessToast);
      setTimeout(() => {
        window.location.href = 'https://www.instagram.com/';
      }, 1200);
    } catch (err) {
      console.error('Instagram story share failed:', err);
      showToast(t.toastInstaRedirect);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveImage = async () => {
    setIsGenerating(true);
    try {
      const blob = await generateBlob();
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `water_receipt_${receiptNo}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast(t.toastImgSuccess);
    } catch (err) {
      console.error('Save image error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyImage = async () => {
    setIsGenerating(true);
    try {
      const blob = await generateBlob();
      if (!blob) return;

      if (navigator.clipboard && window.ClipboardItem) {
        try {
          const item = new window.ClipboardItem({ 'image/png': blob });
          await navigator.clipboard.write([item]);
          showToast(t.toastImgCopySuccess);
          return;
        } catch (clipboardErr) {
          console.warn('Clipboard write failed, fallback to download:', clipboardErr);
        }
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `water_receipt_${receiptNo}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast(t.toastImgSuccess);
    } catch (err) {
      console.error('Copy image error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async () => {
    setIsGenerating(true);
    try {
      const text = `💧 ${t.receiptHeader}\n${dateStr} 총 물 사용량: ${totalFormatted}L (${grade.title})\n💧 ${t.streakBadge ? t.streakBadge.replace('{days}', String(streakDays)) : `${streakDays}일 연속 기록 중!`}\n\n👉 나의 물 사용량도 계산해보기:\n${window.location.href}`;
      const nav = navigator as any;

      if (nav.share) {
        try {
          await nav.share({
            title: t.appTitle,
            text,
            url: window.location.href,
          });
          return;
        } catch (err: any) {
          if (err.name === 'AbortError') return;
        }
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        showToast(t.toastCopySuccess);
      } else {
        try {
          const textArea = document.createElement('textarea');
          textArea.value = text;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
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

      {/* Streak Protection / Cloud Sync Retention Card */}
      <div className="bg-gradient-to-br from-cyan-950/70 via-slate-900 to-slate-950 border border-cyan-500/40 rounded-3xl p-4 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3 relative overflow-hidden">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {isUserRegistered && (
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-400/40 flex items-center justify-center text-lg shrink-0">
              ✅
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-slate-100">
                {t.saveStreakBannerTitle ? t.saveStreakBannerTitle.replace('{days}', String(streakDays)) : `연속 ${streakDays}일 기록 중!`}
              </h4>
              {isUserRegistered && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                  {t.accountBadge || '동기화 계정'}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5 leading-snug">
              {isUserRegistered
                ? (t.saveStreakBannerLoggedIn || '연속 기록이 클라우드 계정에 안전하게 동기화 중입니다.')
                : (t.saveStreakBannerDesc || '아이디만 등록하면 기기가 바뀌어도 연속 기록을 영구 보관해요.')}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsAuthModalOpen(true)}
          className={`w-full sm:w-auto px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer shrink-0 shadow-md ${
            isUserRegistered
              ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              : 'bg-gradient-to-r from-cyan-500 to-emerald-500 hover:opacity-95 text-slate-950 shadow-[0_4px_14px_rgba(6,182,212,0.3)] active:scale-95'
          }`}
        >
          {isUserRegistered ? (t.authAccountTitle || '내 계정 관리') : (t.saveStreakBannerBtn || '내 연속 기록 저장하기')}
        </button>
      </div>

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

      {/* Account / Streak Retention Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setSavedUser(getSavedRegisteredUser());
        }}
        lang={lang}
        streakDays={streakDays}
        currentUser={currentUser}
        showToast={showToast}
      />
    </motion.div>
  );
};
