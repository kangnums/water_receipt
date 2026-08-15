import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Language, translations } from '../data/translations';
import {
  registerWithUserId,
  loginWithUserId,
  logOutUser,
  deleteAccount,
  clearAllFirebaseRecords,
  getSavedRegisteredUser,
  User,
} from '../firebase';

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
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [isResetAllMode, setIsResetAllMode] = useState(false);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
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

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deletePassword) {
      setErrorMsg(t.authDeletePasswordPlaceholder || '탈퇴 확인을 위해 비밀번호를 입력해주세요.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await deleteAccount(deletePassword);
      if (res.success) {
        showToast(t.authDeleteSuccess || '탈퇴가 완료되었습니다. 이용해 주셔서 감사합니다.');
        setIsDeleteMode(false);
        setDeletePassword('');
        onClose();
      } else {
        setErrorMsg(res.error || '탈퇴 처리에 실패했습니다.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || '회원 탈퇴 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetAllFirebase = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await clearAllFirebaseRecords();
      if (res.success) {
        showToast('파이어베이스의 모든 로그인 및 회원 기록이 초기화되었습니다.');
        setIsResetAllMode(false);
        onClose();
      } else {
        setErrorMsg(res.error || '초기화에 실패했습니다.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || '초기화 처리 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsDeleteMode(false);
    setIsResetAllMode(false);
    setDeletePassword('');
    setErrorMsg(null);
    onClose();
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
            onClick={handleClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 p-1.5 rounded-full hover:bg-slate-800 transition-colors"
          >
            ✕
          </button>

          {/* Header */}
          <div className="text-center mb-5">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl border text-2xl mb-3 shadow-inner ${
              isDeleteMode || isResetAllMode
                ? 'bg-rose-950/80 border-rose-500/40 text-rose-300' 
                : 'bg-cyan-950/80 border-cyan-500/40'
            }`}>
              {isDeleteMode || isResetAllMode ? '⚠️' : '💧'}
            </div>
            <h2 className="text-xl font-black text-slate-100 tracking-tight">
              {isResetAllMode
                ? '모든 로그인 기록 전체 삭제'
                : isDeleteMode
                ? (t.authDeleteConfirmTitle || '정말 탈퇴하시겠습니까?')
                : isAlreadyLoggedIn
                ? (t.authAccountTitle || '내 물 기록 계정')
                : isLoginMode
                ? (t.authLoginTitle || '로그인')
                : (t.authModalTitle || '연속일수 영구 보관하기')}
            </h2>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              {isResetAllMode
                ? '파이어베이스 데이터베이스에 저장된 모든 회원 아이디 및 연속 기록을 완전히 삭제합니다.'
                : isDeleteMode
                ? (t.authDeleteWarning || '탈퇴 시 클라우드에 보관된 모든 연속 기록 및 계정 데이터가 영구히 삭제됩니다.')
                : isAlreadyLoggedIn
                ? (t.authLoggedInDesc || '아이디가 연결되어 연속일수가 클라우드에 실시간 보관 중입니다.')
                : (t.authModalDesc || '아이디를 생성하면 기기가 바뀌어도 소중한 연속 기록을 잃지 않아요.')}
            </p>
          </div>

          {!isDeleteMode && !isResetAllMode && (
            /* Streak Status Pill */
            <div className="bg-slate-950/70 border border-cyan-500/30 rounded-2xl p-3 mb-5 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">
                {t.authCurrentStreakLabel || '현재 내 연속 기록'}
              </span>
              <span className="inline-flex items-center gap-1 font-black text-cyan-300 bg-cyan-950/90 px-2.5 py-0.5 rounded-full text-xs border border-cyan-500/40">
                <span>💧</span>
                <span>{streakDays}일 연속</span>
              </span>
            </div>
          )}

          {isResetAllMode ? (
            /* Reset All Records Confirmation */
            <div className="space-y-4">
              {errorMsg && (
                <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-200 text-xs text-center font-medium">
                  {errorMsg}
                </div>
              )}
              <div className="bg-rose-950/40 border border-rose-500/30 rounded-2xl p-3 text-xs text-rose-200 leading-relaxed">
                파이어베이스의 <strong>accounts</strong> 및 <strong>users</strong> 컬렉션의 모든 문서와 로컬 세션이 영구적으로 비워집니다.
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsResetAllMode(false);
                    setErrorMsg(null);
                  }}
                  disabled={loading}
                  className="flex-1 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleResetAllFirebase}
                  disabled={loading}
                  className="flex-1 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-all shadow-lg shadow-rose-950/50 cursor-pointer disabled:opacity-50"
                >
                  {loading ? '삭제 중...' : '기록 전체 지우기'}
                </button>
              </div>
            </div>
          ) : isDeleteMode ? (
            /* Delete Account Confirmation Form */
            <form onSubmit={handleDeleteAccount} className="space-y-4">
              {errorMsg && (
                <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-200 text-xs text-center font-medium">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  {t.authDeletePasswordPlaceholder || '탈퇴 확인 비밀번호'}
                </label>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="비밀번호 입력"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-rose-500/40 focus:border-rose-400 focus:outline-none text-sm text-slate-100 placeholder-slate-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsDeleteMode(false);
                    setDeletePassword('');
                    setErrorMsg(null);
                  }}
                  disabled={loading}
                  className="flex-1 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors cursor-pointer"
                >
                  {t.authCancelBtn || '취소'}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-all shadow-lg shadow-rose-950/50 cursor-pointer disabled:opacity-50"
                >
                  {loading ? '처리 중...' : (t.authDeleteSubmit || '계정 삭제 및 탈퇴')}
                </button>
              </div>
            </form>
          ) : isAlreadyLoggedIn ? (
            /* Logged-in View */
            <div className="space-y-4">
              <div className="bg-slate-800/80 rounded-2xl p-3.5 border border-slate-700 text-xs text-slate-300">
                <span className="text-slate-400 block mb-1">연결된 아이디</span>
                <span className="font-semibold text-emerald-400 text-base font-mono">{displayUsername}</span>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                disabled={loading}
                className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition-all cursor-pointer"
              >
                {t.authLogoutBtn || '로그아웃'}
              </button>

              <div className="pt-2 flex items-center justify-between border-t border-slate-800 text-[11px]">
                <button
                  type="button"
                  onClick={() => {
                    setIsDeleteMode(true);
                    setErrorMsg(null);
                  }}
                  className="text-rose-400/80 hover:text-rose-300 underline transition-colors cursor-pointer"
                >
                  {t.authDeleteAccountBtn || '회원 탈퇴'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsResetAllMode(true);
                    setErrorMsg(null);
                  }}
                  className="text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                >
                  기록 전체 초기화
                </button>
              </div>
            </div>
          ) : (
            /* Register / Login Form */
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

              <div className="flex items-center justify-between pt-1">
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

                <button
                  type="button"
                  onClick={() => {
                    setIsResetAllMode(true);
                    setErrorMsg(null);
                  }}
                  className="text-[11px] text-slate-600 hover:text-rose-400 transition-colors cursor-pointer"
                >
                  기록 전체 삭제
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
