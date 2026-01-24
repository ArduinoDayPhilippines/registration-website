import React from 'react';
import { CheckCircle, ShieldCheck, HelpCircle } from 'lucide-react';
import { Question } from '@/types/event';

interface EventRegistrationInfoProps {
  requireApproval: boolean;
  questions: Question[];
}

export function EventRegistrationInfo({ 
  requireApproval, 
  questions 
}: EventRegistrationInfoProps) {
  const hasQuestions = questions.some(q => q.text);

  return (
    <div className="group relative overflow-hidden bg-black/40 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/10 mb-8 md:mb-10 transition-all duration-300 hover:border-primary/30">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-white/5 backdrop-blur-sm transition-all duration-300 group-hover:bg-primary/10">
            <ShieldCheck className="text-primary transition-transform duration-300 group-hover:scale-110" size={24} />
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-white/90 group-hover:text-white transition-colors">
            Registration Details
          </h3>
        </div>
        
        {requireApproval && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-secondary/10 border border-secondary/20 mb-5 transition-all duration-300 hover:bg-secondary/15">
            <CheckCircle size={20} className="text-secondary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-secondary font-semibold mb-1">Approval Required</p>
              <p className="text-white/70 text-sm">Your registration will be reviewed before confirmation</p>
            </div>
          </div>
        )}

        {hasQuestions && (
          <div className="mt-6">
            <h4 className="text-lg font-semibold mb-4 text-white/90 flex items-center gap-2">
              <HelpCircle size={18} className="text-primary" />
              Registration Questions
            </h4>
            <ul className="space-y-3">
              {questions.map((question, index) => (
                question.text && (
                  <li 
                    key={question.id} 
                    className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/5 hover:border-primary/20 hover:bg-white/[0.07] transition-all duration-200"
                  >
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary text-xs font-bold mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-white/80 flex-1">
                      {question.text}
                      {question.required && (
                        <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 font-semibold">
                          Required
                        </span>
                      )}
                    </span>
                  </li>
                )
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
