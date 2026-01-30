import React from 'react';
import { Question } from '@/types/event';

interface RegistrationQuestionsSectionProps {
  questions: Question[];
}

export function RegistrationQuestionsSection({ questions }: RegistrationQuestionsSectionProps) {
  return (
    <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 md:p-6 border border-white/10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4 md:mb-6">
        <h2 className="font-montserrat text-lg md:text-xl font-bold text-white">
          Registration Questions
        </h2>
        <button className="font-montserrat px-4 py-2 bg-secondary hover:bg-secondary/90 rounded-lg text-white text-sm font-medium transition-colors whitespace-nowrap self-start md:self-auto">
          + Add Question
        </button>
      </div>

      <div className="space-y-4">
        {questions && questions.length > 0 ? (
          questions.map((question, index) => (
            <div
              key={index}
              className="p-4 bg-white/5 border border-white/10 rounded-lg"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="font-montserrat text-white font-medium text-base mb-1">
                    {question.text}
                  </p>
                  <p className="font-montserrat text-white/60 text-sm">
                    {question.required ? "Required" : "Optional"}
                  </p>
                </div>
                <button className="font-montserrat text-white/60 hover:text-white text-sm">
                  Edit
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="font-montserrat text-white/60 text-base">
              No custom questions added yet
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
