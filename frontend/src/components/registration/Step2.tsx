import React from 'react';
import { User, Phone, Briefcase, Building, Link as LinkIcon, HelpCircle, FileText } from 'lucide-react';
import { Input2 } from '@/components/ui/input-2';
import { Button } from '@/components/ui/button';
import { RegistrationFormData } from './types';
import { cn } from '@/lib/utils';

interface Step2Props {
  formData: RegistrationFormData;
  updateData: (data: Partial<RegistrationFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step2({ formData, updateData, onNext, onBack }: Step2Props) {
  
  const isValid = formData.firstName && formData.lastName && formData.age && formData.mobileNumber && 
                  formData.occupation && formData.institution && formData.isPartnered && 
                  formData.isOpenToScholarship && formData.expectations;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full animate-in fade-in duration-500 slide-in-from-right-4">
      <div className="flex-1 overflow-y-auto pr-2 -mr-2 custom-scrollbar">
        <h2 className="text-2xl md:text-3xl font-bold mb-2 font-sans">Registration Form</h2>
        <p className="text-white/50 mb-8 ml-1">Fill out the necessary fields below</p>

        <div className="space-y-4">
            {/* Name Fields */}
            <Input2 label="First Name *" value={formData.firstName} onChange={e => updateData({ firstName: e.target.value })} required />
            <Input2 label="Last Name *" value={formData.lastName} onChange={e => updateData({ lastName: e.target.value })} required />
            
            {/* Age & Mobile */}
            <Input2 label="Age *" type="number" value={formData.age} onChange={e => updateData({ age: e.target.value })} required />
            <Input2 label="Mobile Number *" type="tel" value={formData.mobileNumber} onChange={e => updateData({ mobileNumber: e.target.value })} required />

            {/* Work/School */}
            <Input2 label="Occupation *" value={formData.occupation} onChange={e => updateData({ occupation: e.target.value })} required />
            <Input2 label="Company/School/Institution *" value={formData.institution} onChange={e => updateData({ institution: e.target.value })} required />

            {/* Radio Questions */}
            <div className="space-y-1 mt-4">
                <span className="text-sm font-semibold text-primary block mb-2">Are you a member of a partnered organization? *</span>
                <div className="flex gap-6">
                    {['Yes', 'No'].map(opt => {
                        const isSelected = formData.isPartnered === opt;
                        return (
                            <label key={opt} className="flex items-center gap-2 cursor-pointer group relative">
                                <input 
                                    type="radio" 
                                    className="sr-only"
                                    name="isPartnered"
                                    checked={isSelected}
                                    onChange={() => updateData({ isPartnered: opt as any })}
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
                                    "text-white/80 transition-colors",
                                    isSelected ? "text-white" : "group-hover:text-white"
                                )}>{opt}</span>
                            </label>
                        );
                    })}
                </div>
            </div>

            <div className="space-y-1 mt-4">
                <span className="text-sm font-semibold text-primary block mb-2">Are you open to a scholarship/career opportunity from one of Arduino Day Philippines' Sponsors?</span>
                 <div className="flex gap-6">
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
                                    "text-white/80 transition-colors",
                                    isSelected ? "text-white" : "group-hover:text-white"
                                )}>{opt}</span>
                            </label>
                        );
                    })}
                </div>
            </div>

            {/* Resume */}
            <Input2 label="Resume URL" value={formData.resumeUrl} onChange={e => updateData({ resumeUrl: e.target.value })} placeholder="Link to your resume/portfolio (optional)" />

             {/* Text Areas */}
            <div className="space-y-2">
                 <span className="text-[10px] text-primary uppercase tracking-widest font-bold">What are your expectations on the event? *</span>
                 <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/50 transition-all">
                    <textarea 
                        className="w-full bg-transparent border-none outline-none text-white text-sm resize-none h-24 placeholder-white/20"
                        placeholder="Tell us what you expect..."
                        value={formData.expectations}
                        onChange={e => updateData({ expectations: e.target.value })}
                        required
                    />
                 </div>
            </div>

             <div className="space-y-2">
                 <span className="text-[10px] text-primary uppercase tracking-widest font-bold">Suggestions for Arduino Day Philippines 2026?</span>
                 <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/50 transition-all">
                    <textarea 
                        className="w-full bg-transparent border-none outline-none text-white text-sm resize-none h-24 placeholder-white/20"
                        placeholder="Any ideas to make it better..."
                        value={formData.suggestions}
                        onChange={e => updateData({ suggestions: e.target.value })}
                    />
                 </div>
            </div>
        </div>
      </div>

      <div className="mt-8 flex gap-4 pt-4 border-t border-white/10">
        <Button 
            type="button"
            variant="outline" 
            onClick={onBack}
            className="flex-1"
        >
          Back
        </Button>
        <Button 
          type="submit"
          variant="primary" 
          disabled={!isValid}
          className="flex-1"
        >
          Continue
        </Button>
      </div>
    </form>
  );
}
