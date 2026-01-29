import React from 'react';
import { cn } from '@/lib/utils';

interface RegistrationStepperProps {
  currentStep: number;
  totalSteps: number;
}

export function RegistrationStepper({ currentStep, totalSteps }: RegistrationStepperProps) {
  return (
    <div className="flex items-center w-full max-w-lg mx-auto relative cursor-default">
      {/* Background Line */}
      <div className="absolute top-1/2 left-0 w-full h-1 bg-white/10 rounded-full -translate-y-1/2" />
      
      {/* Active Line Progress */}
      <div 
        className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-secondary to-primary rounded-full -translate-y-1/2 transition-all duration-500 ease-out"
        style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
      />

      {/* Steps */}
      <div className="relative flex justify-between w-full">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNum = index + 1;
          const isActive = stepNum === currentStep;
          const isCompleted = stepNum < currentStep;

          return (
            <div key={index} className="flex flex-col items-center group">
               {/* Dot */}
              <div className={cn(
                "w-6 h-6 md:w-8 md:h-8 rounded-full border-2 flex items-center justify-center relative z-10 transition-all duration-300",
                isActive 
                    ? "bg-secondary border-secondary scale-125 shadow-[0_0_20px_rgba(238,116,2,0.6)]" 
                    : isCompleted 
                        ? "bg-primary border-primary shadow-[0_0_10px_rgba(0,128,128,0.4)]"
                        : "bg-[#0a1016] border-white/20"
              )}>
                {/* Inner Dot for completed/active */}
                {(isActive || isCompleted) && (
                    <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-white animate-pulse" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
