import { Language } from '../data/translations';

interface LanguageSelectorProps {
  currentLang: Language;
  onSelectLang: (lang: Language) => void;
}

const LANGUAGES: { code: Language; label: string }[] = [
  { code: 'ko', label: 'KO' },
  { code: 'en', label: 'EN' },
  { code: 'ja', label: 'JA' },
  { code: 'zh', label: 'ZH' },
];

export function LanguageSelector({ currentLang, onSelectLang }: LanguageSelectorProps) {
  return (
    <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-full border border-slate-700/80 shadow-xs">
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          type="button"
          onClick={() => onSelectLang(lang.code)}
          className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-semibold transition-colors cursor-pointer ${
            currentLang === lang.code
              ? 'bg-emerald-500 text-slate-950 shadow-xs'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
