import React from 'react';
import { Mail } from 'lucide-react';
import { Input2 } from '@/components/ui/input-2';
import { Button } from '@/components/ui/button';
import { RegistrationFormData } from './types';

interface Step1Props {
  formData: RegistrationFormData;
  updateData: (data: Partial<RegistrationFormData>) => void;
  onNext: () => void;
}

export function Step1({ formData, updateData, onNext }: Step1Props) {
  const isValid = formData.email && formData.agreedToPrivacy;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full animate-in fade-in duration-500 slide-in-from-right-4">
      <div className="flex-1">
        <h2 className="text-2xl md:text-3xl font-bold mb-2 font-sans text-center">SECURE YOUR SPOT NOW!</h2>
        <p className="text-white/50 mb-8 ml-1 text-center">Begin your journey by entering your email.</p>

        <div className="space-y-6">
          <Input2 
            label="Email *" 
            value={formData.email}
            onChange={(e) => updateData({ email: e.target.value })}
            variant="primary"
          />

          <label className="flex items-start gap-3 p-2 group cursor-pointer">
            <div className="relative flex items-center">
              <input 
                type="checkbox" 
                className="peer sr-only"
                checked={formData.agreedToPrivacy}
                onChange={(e) => updateData({ agreedToPrivacy: e.target.checked })}
              />
              <div className="w-5 h-5 border-2 border-white/30 rounded transition-all peer-checked:bg-primary peer-checked:border-primary peer-hover:border-primary/70 bg-transparent flex items-center justify-center">
                 {formData.agreedToPrivacy && <div className="w-2.5 h-1.5 border-l-2 border-b-2 border-white rotate-[-45deg] translate-y-[-1px]" />}
              </div>
            </div>
             <span className="text-sm md:text-lg text-white/70 leading-tight group-hover:text-white transition-colors select-none">
              I agree to the Privacy Policy. For more information, please visit the <a href="#" className="underline decoration-white/30 hover:decoration-primary hover:text-primary transition-colors">Arduino Day PH 2026</a> site for the Privacy Policy.
            </span>
          </label>
        </div>
      </div>

      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-full max-w-[200px] px-4 md:px-0">
        <Button 
          fullWidth 
          variant="primary" 
          size="lg" 
          disabled={!isValid}
          className="shadow-[0_4px_20px_rgba(0,128,128,0.25)] rounded-2xl h-14 md:h-16 text-base md:text-lg font-bold"
        >
          Continue
        </Button>
      </div>
    </form>
  );
}
