import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Language, translations } from '../data/translations';
import { registerWithUserId, loginWithUserId, logOutUser, getSavedRegisteredUser, User } from '../firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  streakDays: number;
  currentUser: User | null;
  onAuthSuccess?: (user: User) => void;
  showToast: (msg: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  lang,
  streakDays,
  showToast,
}) => {
  const t = translations[lang];
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const savedUser = getSavedRegisteredUser();
  const isAlreadyLoggedIn = !!savedUser;
  const displayUsername = savedUser?.username || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId.trim() || !password) {
      setErrorMsg('아이디와 비밀번호를 입력해주세요.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      if (isLoginMode) {
        const res = await loginWithUserId(userId, password);
        if (res.success) {
          showToast(t.authLoginSuccess || '로그인되었습니다! 연속일수가 동기화되었습니다.');
          onClose();
        } else {
          setErrorMsg(res.error || '로그인에 실패했습니다.');
        }
      } else {
        const res = await registerWithUserId(userId, password);
        if (res.success) {
          showToast(t.authRegisterSuccess || '등록 완료! 연속 기록이 안전하게 보관됩니다.');
          onClose();
        } else {
          setErrorMsg(res.error || '등록에 실패했습니다.');
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logOutUser();
      showToast('로그아웃되었습니다.');
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-sm bg-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-2xl text-slate-100"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 p-1.5 rounded-full hover:bg-slate-800 transition-colors"
          >
            ✕
          </button>

          {/* Header */}
          <div className="text-center mb-5">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 text-2xl mb-3 shadow-inner">
              💧
            </div>
            <h2 className="text-xl font-black text-slate-100 tracking-tight">
              {isAlreadyLoggedIn
                ? (t.authAccountTitle || '내 물 기록 계정')
                : isLoginMode
                ? (t.authLoginTitle || '로그인')
                : (t.authModalTitle || '연속일수 영구 보관하기')}
            </h2>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              {isAlreadyLoggedIn
                ? (t.authLoggedInDesc || '아이디가 연결되어 연속일수가 클라우드에 실시간 보관 중입니다.')
                : (t.authModalDesc || '아이디를 생성하면 기기가 바뀌어도 소중한 연속 기록을 잃지 않아요.')}
            </p>
          </div>

          {/* Streak Status Pill */}
          <div className="bg-slate-950/70 border border-cyan-500/30 rounded-2xl p-3 mb-5 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">
              {t.authCurrentStreakLabel || '현재 내 연속 기록'}
            </span>
            <span className="inline-flex items-center gap-1 font-black text-cyan-300 bg-cyan-950/90 px-2.5 py-0.5 rounded-full text-xs border border-cyan-500/40">
              <span>💧</span>
              <span>{streakDays}일 연속</span>
            </span>
          </div>

          {isAlreadyLoggedIn ? (
            <div className="space-y-4">
              <div className="bg-slate-800/80 rounded-2xl p-3.5 border border-slate-700 text-xs text-slate-300">
                <span className="text-slate-400 block mb-1">연결된 아이디</span>
                <span className="font-semibold text-emerald-400 text-base font-mono">{displayUsername}</span>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                disabled={loading}
                className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-rose-300 text-xs font-bold transition-all cursor-pointer"
              >
                {t.authLogoutBtn || '로그아웃'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {errorMsg && (
                <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-200 text-xs text-center font-medium">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  {t.authUserIdLabel || '아이디'}
                </label>
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="아이디 입력 (예: waterhero)"
                  required
                  autoCapitalize="none"
                  autoCorrect="off"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-cyan-400 focus:outline-none text-sm text-slate-100 placeholder-slate-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  {t.authPasswordLabel || '비밀번호 (6자 이상)'}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  required
                  minLength={6}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-cyan-400 focus:outline-none text-sm text-slate-100 placeholder-slate-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:opacity-95 text-slate-950 font-bold text-sm shadow-[0_4px_16px_rgba(6,182,212,0.25)] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 mt-2"
              >
                {loading
                  ? '처리 중...'
                  : isLoginMode
                  ? (t.authLoginSubmit || '로그인하고 동기화')
                  : (t.authRegisterSubmit || '1초 만에 연속 기록 저장하기')}
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsLoginMode(!isLoginMode);
                    setErrorMsg(null);
                  }}
                  className="text-xs text-slate-400 hover:text-cyan-300 underline transition-colors cursor-pointer"
                >
                  {isLoginMode
                    ? (t.authToggleToRegister || '아이디가 없으신가요? 간편 생성하기')
                    : (t.authToggleToLogin || '이미 아이디가 있으신가요? 로그인하기')}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
