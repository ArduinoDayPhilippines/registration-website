'use client';

import { useState } from 'react';
import { RegistrationLayout } from './RegistrationLayout';
import { Step0 } from './Step0';
import { Step1 } from './Step1';
import { Step2 } from './Step2';
import { Step3 } from './Step3';
import { Step4 } from './Step4';
import { Step5 } from './Step5';
import { INITIAL_DATA, RegistrationFormData } from './types';

export interface RegistrationFlowProps {
  eventSlug?: string;
}

export function RegistrationFlow({
  eventSlug
}: RegistrationFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<RegistrationFormData>(INITIAL_DATA);
  const [isSuccess, setIsSuccess] = useState(false);

  const updateData = (data: Partial<RegistrationFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 6));
  };
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const handleSubmit = async () => {
    // In a real app, send data to API
    console.log("Submitting Registration:", formData);
    setIsSuccess(true);
  };

  if (isSuccess) {
     return (
        <RegistrationLayout 
            currentStep={6}
            totalSteps={6}
        >
            <div className="flex flex-col items-center justify-center h-full text-center animate-in zoom-in-95 duration-500">
                <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mb-6">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,128,128,0.6)]">
                         <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>
                <h2 className="text-4xl font-morganite tracking-wide text-primary mb-2">REGISTRATION SUCCESSFUL!</h2>
                <p className="text-white/60 max-w-sm">
                    Thank you, {formData.firstName}. Your spot has been secured.
                </p>
                <button onClick={() => window.location.reload()} className="mt-8 text-sm text-secondary hover:text-white transition-colors">
                    Register Another Person
                </button>
            </div>
        </RegistrationLayout>
     )
  }

  return (
    <RegistrationLayout 
        currentStep={currentStep}
        totalSteps={6}
    >
      {currentStep === 0 && (
        <Step0 
            onNext={nextStep} 
        />
      )}
      {currentStep === 1 && (
        <Step1 
            formData={formData} 
            updateData={updateData} 
            onNext={nextStep} 
        />
      )}
      {currentStep === 2 && (
        <Step2 
            formData={formData} 
            updateData={updateData} 
            onNext={nextStep} 
            onBack={prevStep} 
        />
      )}
      {currentStep === 3 && (
        <Step3 
            formData={formData} 
            updateData={updateData} 
            onNext={nextStep} 
            onBack={prevStep} 
        />
      )}
      {currentStep === 4 && (
        <Step4 
            formData={formData} 
            updateData={updateData} 
            onNext={nextStep} 
            onBack={prevStep} 
        />
      )}
      {currentStep === 5 && (
        <Step5 
            formData={formData} 
            onBack={prevStep} 
            onSubmit={handleSubmit}
            eventSlug={eventSlug}
        />
      )}
    </RegistrationLayout>
  );
}
