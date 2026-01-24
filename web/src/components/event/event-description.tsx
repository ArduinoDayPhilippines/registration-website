import React from 'react';
import { FileText } from 'lucide-react';

interface EventDescriptionProps {
  description: string;
}

export function EventDescription({ description }: EventDescriptionProps) {
  if (!description) return null;

  return (
    <div className="group relative overflow-hidden bg-black/40 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/10 mb-8 md:mb-10 transition-all duration-300 hover:border-white/20">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }} />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-xl bg-white/5 backdrop-blur-sm transition-all duration-300 group-hover:bg-primary/10">
            <FileText className="text-primary transition-transform duration-300 group-hover:scale-110" size={24} />
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-white/90 group-hover:text-white transition-colors">
            About This Event
          </h3>
        </div>
        
        <div className="prose prose-invert max-w-none">
          <p className="text-white/80 text-base md:text-lg leading-relaxed whitespace-pre-wrap">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
