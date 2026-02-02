import { RegistrationStepper } from './RegistrationStepper';
import { ParallaxBackground } from '@/components/create-event/parallax-background';

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
        <ParallaxBackground />

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
