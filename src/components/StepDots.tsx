import React from 'react';

interface StepDotsProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export const StepDots: React.FC<StepDotsProps> = ({ currentStep, onStepClick }) => {
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {[1, 2, 3, 4].map((step) => {
        const isActive = step <= currentStep;
        return (
          <button
            key={step}
            type="button"
            onClick={() => onStepClick && step < currentStep && onStepClick(step)}
            disabled={!onStepClick || step > currentStep}
            aria-label={`Step ${step}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              isActive ? 'bg-emerald-500 w-8' : 'bg-slate-700 w-6'
            } ${onStepClick && step < currentStep ? 'cursor-pointer hover:opacity-80' : ''}`}
          />
        );
      })}
    </div>
  );
};
