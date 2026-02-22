import { Question } from "@/types/event";
import { RegistrationFormData } from "./types";

interface StepDynamicProps {
  questions: Question[];
  formData: RegistrationFormData;
  updateData: (data: Partial<RegistrationFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepDynamic({ 
  questions, 
  formData, 
  updateData, 
  onNext, 
  onBack 
}: StepDynamicProps) {
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required questions
    const hasEmptyRequired = questions.some(q => {
      if (q.required) {
        const answer = formData.dynamicAnswers[q.id.toString()];
        return !answer || answer.trim() === '';
      }
      return false;
    });
    
    if (hasEmptyRequired) {
      alert("Please answer all required questions");
      return;
    }
    
    onNext();
  };

  const updateAnswer = (questionId: number, value: string) => {
    updateData({
      dynamicAnswers: {
        ...formData.dynamicAnswers,
        [questionId.toString()]: value
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full animate-in fade-in duration-500 slide-in-from-right-4">
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#f5f5f5] tracking-tight mb-2 leading-tight">
              Additional Information
            </h2>
            <p className="text-[rgba(197,213,213,0.8)] mb-6 sm:mb-8 ml-1 text-[11px] sm:text-sm">
              Please provide the following information
            </p>
          </div>

          <div className="space-y-5">
            {questions.map((question) => (
              <div key={question.id} className="space-y-2">
                <label className="text-[#9dd5d5] text-[11px] font-medium block">
                  {question.text}
                  {question.required && (
                    <span className="text-[#5dd8d8] ml-1">*</span>
                  )}
                </label>
                <textarea
                  value={formData.dynamicAnswers[question.id.toString()] || ''}
                  onChange={(e) => updateAnswer(question.id, e.target.value)}
                  required={question.required}
                  placeholder="Type your answer here..."
                  rows={2}
                  className="w-full !bg-[rgba(15,30,30,0.9)] border border-[#5da5a5] rounded-xl px-4 py-3 !text-[#d5e5e5] text-sm !placeholder:text-[rgba(197,213,213,0.5)] outline-none transition-all duration-200 focus:border-[#7dc5c5] focus:outline-none resize-none"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 sm:mt-8 flex gap-3 sm:gap-4 pt-4 border-t border-[rgba(139,197,197,0.15)]">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-3.5 rounded-xl border border-[rgba(139,197,197,0.4)] hover:bg-[rgba(20,40,40,0.9)] text-[#95b5b5] font-semibold text-sm transition-all duration-200"
        >
          Back
        </button>
        <button
          type="submit"
          className="flex-1 py-3.5 rounded-xl bg-[rgba(35,60,60,0.6)] hover:bg-[rgba(35,60,60,0.7)] text-[#95b5b5] font-semibold text-sm transition-all duration-200"
        >
          Continue
        </button>
      </div>
    </form>
  );
}
