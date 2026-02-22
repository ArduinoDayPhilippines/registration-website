"use client";

import { Eye, XCircle } from "lucide-react";
import { Guest } from "@/types/guest";
import { EventData } from "@/types/event";

interface GuestAnswersModalProps {
  guest: Guest;
  event: EventData;
  onClose: () => void;
}

export function GuestAnswersModal({ guest, event, onClose }: GuestAnswersModalProps) {
  const getQuestionText = (answerKey: string): string => {
    const match = answerKey.match(/\d+$/);
    if (match && event.questions && Array.isArray(event.questions)) {
      const index = parseInt(match[0]) - 1;
      if (index >= 0 && index < event.questions.length) {
        return event.questions[index].text;
      }
    }
    return answerKey;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-3xl bg-gradient-to-br from-[#0a1f14] via-[#0a1520] to-[#120c08] border border-white/10 rounded-3xl max-h-[85vh] overflow-hidden flex flex-col">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 opacity-50 pointer-events-none" />

        <div className="relative flex items-start justify-between p-6 md:p-8 border-b border-white/10">
          <div className="flex-1 pr-4">
            <h3 className="font-urbanist text-2xl md:text-3xl font-bold text-white leading-tight mb-2">
              Form Answers
            </h3>
            <p className="font-urbanist text-sm text-white/60">
              {guest.users?.first_name || 'N/A'} {guest.users?.last_name || ''}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
          >
            <XCircle size={20} className="text-white/70" />
          </button>
        </div>

        <div className="relative flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8">
          {guest.form_answers &&
          typeof guest.form_answers === "object" &&
          Object.keys(guest.form_answers).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(guest.form_answers).map(
                ([answerKey, answer], index) => {
                  const questionText = getQuestionText(answerKey);
                  return (
                    <div
                      key={index}
                      className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-4 hover:border-primary/30 transition-all group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 border border-primary/30 flex items-center justify-center text-white text-sm font-bold shadow-[0_0_15px_rgba(0,128,128,0.3)]">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-urbanist text-sm font-medium text-white/60 mb-2">
                            {questionText}
                          </p>
                          <p className="font-urbanist text-base text-white leading-relaxed">
                            {String(answer)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8 text-white/30" />
              </div>
              <p className="font-urbanist text-white/50 text-sm">
                No form answers available
              </p>
            </div>
          )}
        </div>

        <div className="relative p-6 md:p-8 border-t border-white/10 bg-black/20">
          <button
            onClick={onClose}
            className="w-full font-urbanist px-6 py-3 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 rounded-xl text-white text-sm font-bold uppercase tracking-wide transition-all shadow-[0_0_20px_rgba(0,128,128,0.3)] hover:shadow-[0_0_30px_rgba(0,128,128,0.4)]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
