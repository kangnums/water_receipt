import { useState, useCallback, useEffect, lazy, Suspense } from 'react';
import { WaterState } from './types';
import { Language } from './data/translations';
import { CountryKey, DEFAULT_COUNTRY_KEY } from './data/countryData';
import { StepDots } from './components/StepDots';
import { Step1Checklist } from './components/Step1Checklist';
import { LanguageSelector } from './components/LanguageSelector';
import { Toast } from './components/Toast';

// Lazy-load later steps to drastically reduce initial JS payload and load time on mobile
const Step2Receipt = lazy(() => import('./components/Step2Receipt').then(m => ({ default: m.Step2Receipt })));
const Step3Analysis = lazy(() => import('./components/Step3Analysis').then(m => ({ default: m.Step3Analysis })));
const Step4StoryShare = lazy(() => import('./components/Step4StoryShare').then(m => ({ default: m.Step4StoryShare })));

// Prefetch next steps in background during idle time
function prefetchSubsequentSteps() {
  if (typeof window !== 'undefined') {
    const prefetch = () => {
      import('./components/Step2Receipt');
      import('./components/Step3Analysis');
      import('./components/Step4StoryShare');
    };
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(prefetch, { timeout: 2000 });
    } else {
      setTimeout(prefetch, 1200);
    }
  }
}

const initialWaterState: WaterState = {
  shower: { minutes: 0, runningTap: true, gender: 'male' },
  handwash: { count: 0, runningTap: false },
  laundry: { count: 0 },
  toilet: { count: 0 },
  dish: { count: 0, runningTap: true },
  cooking: { count: 0 },
  tumbler: { count: 0 },
  brush: { count: 0, cup: true },
  water: { cups: 0 },
  drink: { count: 0 },
};

export default function App() {
  const [step, setStep] = useState<number>(1);
  const [lang, setLang] = useState<Language>('ko');
  const [countryKey, setCountryKey] = useState<CountryKey>(DEFAULT_COUNTRY_KEY);
  const [waterState, setWaterState] = useState<WaterState>(initialWaterState);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    // Background prefetch and non-blocking streak sync
    prefetchSubsequentSteps();
    const timer = setTimeout(async () => {
      try {
        const { syncStreakFromCloud } = await import('./utils/streak');
        syncStreakFromCloud();
      } catch (e) {
        // Safe fallback
      }
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  }, []);

  const goToStep = (targetStep: number) => {
    setStep(targetStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRestart = () => {
    setWaterState(initialWaterState);
    setStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 font-sans antialiased">
      <main className="max-w-md mx-auto min-h-screen px-5 pb-20 pt-6 relative flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <StepDots currentStep={step} onStepClick={goToStep} />
            <LanguageSelector currentLang={lang} onSelectLang={setLang} />
          </div>

          {step === 1 && (
            <Step1Checklist
              state={waterState}
              onChangeState={setWaterState}
              onIssueReceipt={() => goToStep(2)}
              lang={lang}
            />
          )}

          <Suspense
            fallback={
              <div className="py-20 flex flex-col items-center justify-center space-y-3">
                <div className="w-8 h-8 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs text-slate-400 font-mono">영수증 로딩 중...</p>
              </div>
            }
          >
            {step === 2 && (
              <Step2Receipt
                state={waterState}
                onNext={() => goToStep(3)}
                onBack={() => goToStep(1)}
                lang={lang}
              />
            )}

            {step === 3 && (
              <Step3Analysis
                state={waterState}
                onNext={() => goToStep(4)}
                lang={lang}
                countryKey={countryKey}
                onSelectCountryKey={setCountryKey}
              />
            )}

            {step === 4 && (
              <Step4StoryShare
                state={waterState}
                onRestart={handleRestart}
                showToast={showToast}
                lang={lang}
              />
            )}
          </Suspense>
        </div>

        {/* Footer Credit */}
        <footer className="mt-8 mb-4 text-center text-[11px] text-slate-500 font-mono tracking-wider">
          TODAY'S WATER RECEIPT · EVERY DROP COUNTS
        </footer>

        {/* Toast Notification */}
        <Toast message={toastMessage} />
      </main>
    </div>
  );
}
