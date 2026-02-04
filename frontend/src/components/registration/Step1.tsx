import { Input2 } from '@/components/ui/input-2';
import { Button } from '@/components/ui/button';
import { RegistrationFormData } from './types';

interface Step1Props {
  formData: RegistrationFormData;
  updateData: (data: Partial<RegistrationFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step1({ formData, updateData, onNext, onBack }: Step1Props) {
  const isValid = formData.email && formData.firstName && formData.lastName;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full animate-in fade-in duration-500 slide-in-from-right-4">
      <div className="flex-1">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 font-sans">Personal Information</h2>
        <p className="text-white/50 mb-6 sm:mb-8 ml-1 text-sm sm:text-base">Tell us about yourself</p>

        <div className="space-y-3 sm:space-y-4">
          <Input2 
            label="First Name *" 
            value={formData.firstName}
            onChange={(e) => updateData({ firstName: e.target.value })}
            required
          />
          <Input2 
            label="Last Name *" 
            value={formData.lastName}
            onChange={(e) => updateData({ lastName: e.target.value })}
            required
          />
          <Input2 
            label="Email *" 
            value={formData.email}
            onChange={(e) => updateData({ email: e.target.value })}
            variant="primary"
            type="email"
            required
          />
        </div>
      </div>

      <div className="mt-6 sm:mt-8 flex gap-3 sm:gap-4 pt-4 border-t border-white/10">
        <Button 
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1 text-sm sm:text-base"
        >
          Back
        </Button>
        <Button 
          type="submit"
          variant="primary" 
          disabled={!isValid}
          className="flex-1 text-sm sm:text-base"
        >
          Continue
        </Button>
      </div>
    </form>
  );
}
