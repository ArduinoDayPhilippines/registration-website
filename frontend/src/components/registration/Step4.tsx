import { Input2 } from '@/components/ui/input-2';
import { Button } from '@/components/ui/button';
import { RegistrationFormData } from './types';
import { cn } from '@/lib/utils';

interface Step4Props {
  formData: RegistrationFormData;
  updateData: (data: Partial<RegistrationFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step4({ formData, updateData, onNext, onBack }: Step4Props) {
  
  const isValid = formData.isOpenToScholarship && formData.expectations;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full animate-in fade-in duration-500 slide-in-from-right-4">
      <div className="flex-1 overflow-y-auto pr-2 -mr-2 custom-scrollbar">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 font-sans">Additional Information</h2>
        <p className="text-white/50 mb-6 sm:mb-8 ml-1 text-sm sm:text-base">Tell us more about yourself</p>

        <div className="space-y-3 sm:space-y-4">
            {/* Scholarship Question */}
            <div className="space-y-1 mt-2 sm:mt-4">
                <span className="text-xs sm:text-sm font-semibold text-primary block mb-2">Are you open to a scholarship/career opportunity from one of our sponsors? *</span>
                 <div className="flex gap-4 sm:gap-6">
                    {['Yes', 'No'].map(opt => {
                        const isSelected = formData.isOpenToScholarship === opt;
                        return (
                            <label key={opt} className="flex items-center gap-2 cursor-pointer group relative">
                                <input 
                                    type="radio" 
                                    className="sr-only"
                                    name="isOpenToScholarship"
                                    checked={isSelected}
                                    onChange={() => updateData({ isOpenToScholarship: opt as any })}
                                />
                                <div className={cn(
                                    "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                                    isSelected ? "border-primary" : "border-white/30 group-hover:border-primary/70"
                                )}>
                                    <div className={cn(
                                        "w-2.5 h-2.5 rounded-full bg-primary transition-transform",
                                        isSelected ? "scale-100" : "scale-0"
                                    )} />
                                </div>
                                <span className={cn(
                                    "text-sm sm:text-base text-white/80 transition-colors",
                                    isSelected ? "text-white" : "group-hover:text-white"
                                )}>{opt}</span>
                            </label>
                        );
                    })}
                </div>
            </div>

            {/* Resume */}
            <Input2 
                label="Resume URL" 
                value={formData.resumeUrl} 
                onChange={e => updateData({ resumeUrl: e.target.value })} 
                placeholder="Link to your resume/portfolio (optional)" 
            />

             {/* Text Areas */}
            <div className="space-y-2">
                 <span className="text-[9px] sm:text-[10px] text-primary uppercase tracking-widest font-bold">What are your expectations on the event? *</span>
                 <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/50 transition-all">
                    <textarea 
                        className="w-full bg-transparent border-none outline-none text-white text-xs sm:text-sm resize-none h-20 sm:h-24 placeholder-white/20"
                        placeholder="Tell us what you expect..."
                        value={formData.expectations}
                        onChange={e => updateData({ expectations: e.target.value })}
                        required
                    />
                 </div>
            </div>

             <div className="space-y-2">
                 <span className="text-[9px] sm:text-[10px] text-primary uppercase tracking-widest font-bold">Suggestions for the Event?</span>
                 <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/50 transition-all">
                    <textarea 
                        className="w-full bg-transparent border-none outline-none text-white text-xs sm:text-sm resize-none h-20 sm:h-24 placeholder-white/20"
                        placeholder="Any ideas to make it better..."
                        value={formData.suggestions}
                        onChange={e => updateData({ suggestions: e.target.value })}
                    />
                 </div>
            </div>
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
