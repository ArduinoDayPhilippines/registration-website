import { RegistrationStepper } from './RegistrationStepper';
import React from 'react';
interface RegistrationLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps?: number;
}

export function RegistrationLayout({
  children,
  currentStep,
  totalSteps = 6,
}: RegistrationLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white relative overflow-x-hidden font-montserrat">
        <div className="fixed inset-0 pointer-events-none z-0 transition-transform duration-75 ease-out will-change-transform">
          <div className="blue-blur left-[-10%] top-[-10%] w-[50%] h-[50%] absolute opacity-30" />
          <div className="orange-blur right-[-10%] bottom-[-10%] w-[50%] h-[50%] absolute opacity-30" />
          <div className="yellow-glow left-[15%] top-[20%] w-[200px] h-[200px] absolute" />
          <div className="yellow-glow right-[20%] top-[60%] w-[160px] h-[160px] absolute" />
          <div className="yellow-glow left-[60%] bottom-[15%] w-[180px] h-[180px] absolute" />
        </div>

        <main className="relative z-10 w-full max-w-3xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-4 sm:py-6 md:py-10 min-h-screen flex flex-col justify-center">
            {/* Stepper Header */}
            <div className="mb-6 sm:mb-8 animate-fade-in">
                <RegistrationStepper currentStep={currentStep} totalSteps={totalSteps} />
            </div>

            {/* Form Card */}
            <div className="animate-fade-in animate-delay-200 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-10 shadow-2xl">
                {children}
            </div>
        </main>
    </div>
  );
}