import React from 'react';
import { Plus, HelpCircle, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Question {
  id: number;
  text: string;
  required: boolean;
}

interface RegistrationQuestionsProps {
  questions: Question[];
  addQuestion: () => void;
  removeQuestion: (id: number) => void;
  updateQuestion: (id: number, field: string, value: string | boolean) => void;
}

export function RegistrationQuestions({ questions, addQuestion, removeQuestion, updateQuestion }: RegistrationQuestionsProps) {
  return (
    <div className="pt-8 space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-4">
        <h3 className="text-2xl font-morganite font-bold text-white tracking-wide">Registration Questions</h3>
        <button onClick={addQuestion} className="flex items-center gap-1 text-primary text-sm font-bold hover:text-primary/80 transition-colors uppercase tracking-wider">
          <Plus className="w-4 h-4" /> Add Question
        </button>
      </div>

      <div className="space-y-3">
        {questions.map((question) => (
          <Input 
            key={question.id}
            label=""
            icon={HelpCircle}
            value={question.text}
            onChange={(e) => updateQuestion(question.id, 'text', e.target.value)}
            placeholder="Type your question here..."
            className="items-start" 
          >
              {/* Question Options */}
              <div className="flex items-center justify-between mt-1">
                <label className="flex items-center gap-2 cursor-pointer group/toggle">
                  <div className={`w-4 h-4 border border-white/30 rounded flex items-center justify-center transition-colors ${question.required ? 'bg-primary border-primary' : 'bg-transparent'}`} 
                        onClick={() => updateQuestion(question.id, 'required', !question.required)}>
                    {question.required && <div className="w-2 h-2 bg-white-50/60 rounded-[1px]" />}
                  </div>
                  <span className="text-xs text-white/50 font-bold uppercase tracking-wider group-hover/toggle:text-white/80 transition-colors">Required</span>
                </label>

                <button onClick={() => removeQuestion(question.id)} className="text-white/20 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
          </Input>
        ))}
      </div>
    </div>
  );
}
