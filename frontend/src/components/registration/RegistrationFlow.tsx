'use client';

import { useState, useMemo, useEffect } from 'react';
import { RegistrationLayout } from './RegistrationLayout';
import { Step0 } from './Step0';
import { LastStep } from './LastStep';
import { StepDynamic } from './StepDynamic';
import { INITIAL_DATA, RegistrationFormData } from './types';
import { Question } from '@/types/event';
import { createClient } from '@/lib/supabase/client';

export interface RegistrationFlowProps {
  eventSlug?: string;
  formQuestions?: Question[];
}

export function RegistrationFlow({
  eventSlug,
  formQuestions = []
}: RegistrationFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<RegistrationFormData>(INITIAL_DATA);
  const [isSuccess, setIsSuccess] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get logged-in user on mount
  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setUserId(user.id);
      } else {
        // Redirect to login if not authenticated
        window.location.href = '/';
      }
      setIsLoading(false);
    };
    
    getUser();
  }, []);

  // Group questions into chunks of 3
  const questionSteps = useMemo(() => {
    const steps: Question[][] = [];
    for (let i = 0; i < formQuestions.length; i += 3) {
      steps.push(formQuestions.slice(i, i + 3));
    }
    console.log('Form Questions:', formQuestions);
    console.log('Question Steps:', steps);
    console.log('Total Steps:', 1 + steps.length + 1);
    return steps;
  }, [formQuestions]);

  // Calculate total steps: Step0 + Dynamic Question Steps + LastStep
  const totalSteps = 1 + questionSteps.length + 1;
  const maxStepIndex = totalSteps - 1;

  const updateData = (data: Partial<RegistrationFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, maxStepIndex));
  };
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const handleSubmit = async () => {
    if (!userId) {
      alert('You must be logged in to register');
      return;
    }

    const formAnswers: Record<string, string> = {};
    
    if (formData.dynamicAnswers && formQuestions.length > 0) {
      formQuestions.forEach((question, index) => {
        const answer = formData.dynamicAnswers?.[question.id.toString()];
        if (answer) {
          formAnswers[`a${index + 1}`] = answer;
        }
      });
    }

    // Prepare data for registrants table
    const registrantData = {
      event_id: eventSlug, 
      user_id: userId, // Use logged-in user's ID instead
      terms_approval: formData.agreedToPrivacy,
      form_answers: formAnswers, 
    };

    // Log for debugging
    console.log("=== REGISTRATION DATA FOR REGISTRANTS TABLE ===");
    console.log("Table: registrants");
    console.log("Data:", JSON.stringify(registrantData, null, 2));
    console.log("===============================================");
    
    try {
      // Send to API endpoint
      const response = await fetch('/api/registrants/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrantData)
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("Registration failed:", result.error);
        alert(`Registration failed: ${result.error}`);
        throw new Error(result.error); // Throw error to trigger catch in LastStep
      }

      console.log("Registration successful:", result);
      setIsSuccess(true);
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage = error instanceof Error ? error.message : "An error occurred during registration. Please try again.";
      alert(errorMessage);
      throw error; 
    }
  };

  if (isLoading) {
    return (
      <RegistrationLayout 
        currentStep={0}
        totalSteps={totalSteps}
      >
        <div className="flex items-center justify-center h-full">
          <p className="text-white/60">Loading...</p>
        </div>
      </RegistrationLayout>
    );
  }

  if (isSuccess) {
     return (
        <RegistrationLayout 
            currentStep={maxStepIndex}
            totalSteps={totalSteps}
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
                <p className="text-white/60 max-w-sm mb-6">
                    Your spot has been secured.
                </p>
                <button 
                    onClick={() => window.location.href = `/event/${eventSlug}`}
                    className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors shadow-[0_4px_20px_rgba(0,128,128,0.25)]"
                >
                    Go Back to Event Page
                </button>
            </div>
        </RegistrationLayout>
     )
  }

  return (
    <RegistrationLayout 
        currentStep={currentStep}
        totalSteps={totalSteps}
    >
      {currentStep === 0 && (
        <Step0 
            onNext={nextStep} 
        />
      )}
      
      {/* Dynamic question steps */}
      {questionSteps.map((questions, index) => {
        const stepIndex = 1 + index;
        return currentStep === stepIndex && (
          <StepDynamic
            key={stepIndex}
            questions={questions}
            formData={formData}
            updateData={updateData}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      })}
      
      {/* Final confirmation step */}
      {currentStep === maxStepIndex && (
        <LastStep 
            eventSlug={eventSlug}
            onSubmit={handleSubmit}
        />
      )}
    </RegistrationLayout>
  );
}
