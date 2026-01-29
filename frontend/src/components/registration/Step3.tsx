import React from 'react';
import { Button } from '@/components/ui/button';
import { RegistrationFormData } from './types';
import { useRouter } from 'next/navigation';

interface Step3Props {
  formData: RegistrationFormData;
  onBack: () => void;
  onSubmit: () => void;
}

export function Step3({ formData, onBack, onSubmit }: Step3Props) {
  const router = useRouter();

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 slide-in-from-right-4 relative">
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-3xl md:text-4xl font-bold font-sans mb-6 leading-tight">
            Your Registration is now <br /> being Processed
        </h2>
        
        <div className="space-y-6 max-w-md mx-auto">
            <p className="text-white/80 text-lg leading-relaxed">
                Are you interested in availing our <span className="text-secondary font-bold">official merchandise</span> of <span className="text-primary font-bold">Arduino Day Philippines 2026</span>?
            </p>
            
            <p className="text-white/60">
                Fill up the official order form to get our exclusive merchandise!
            </p>

            <Button 
                variant="secondary" 
                size="lg"
                className="font-bold px-8 shadow-[0_0_20px_rgba(238,116,2,0.4)] rounded-full mt-4"
                onClick={() => window.open('#', '_blank')}
            >
                Open Order Form
            </Button>
        </div>
      </div>

      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-full max-w-[300px] px-4 md:px-0">
        <Button 
            variant="primary" 
            fullWidth
            size="lg"
            onClick={() => router.push('/')}
            className="shadow-[0_4px_20px_rgba(0,128,128,0.25)] rounded-2xl h-14 md:h-16 text-base md:text-lg font-bold"
        >
          Return to Home Page
        </Button>
      </div>
    </div>
  );
}