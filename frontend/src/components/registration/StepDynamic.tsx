import { Button } from "@/components/ui/button";
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
        const answer = formData.dynamicAnswers?.[q.id.toString()];
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
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-sans mb-2 leading-tight">
              Additional Information
            </h2>
            <p className="text-white/50 mb-6 sm:mb-8 ml-1 text-sm sm:text-base">
              Please provide the following information
            </p>
          </div>

          <div className="space-y-5">
            {questions.map((question) => (
              <div key={question.id} className="space-y-2">
                <label className="text-sm font-medium text-white/90">
                  {question.text}
                  {question.required && (
                    <span className="text-primary ml-1">*</span>
                  )}
                </label>
                <textarea
                  value={formData.dynamicAnswers?.[question.id.toString()] || ''}
                  onChange={(e) => updateAnswer(question.id, e.target.value)}
                  required={question.required}
                  placeholder="Type your answer here..."
                  rows={2}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all resize-none"
                />
              </div>
            ))}
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
          className="flex-1 text-sm sm:text-base"
        >
          Continue
        </Button>
      </div>
    </form>
  );
}
