import React from 'react';
import { Calendar, Sparkles } from 'lucide-react';

interface EventHeaderProps {
  title: string;
  createdAt: string;
}

export function EventHeader({ title, createdAt }: EventHeaderProps) {
  return (
    <div className="mb-10 md:mb-12 animate-fade-in">
      {/* Title with gradient effect */}
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight">
        <span className="bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
          {title}
        </span>
      </h1>
      
      {/* Metadata */}
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
          <Calendar size={14} className="text-primary" />
          <span className="text-white/70">
            Created {new Date(createdAt).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            })}
          </span>
        </div>
        
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
          <Sparkles size={14} className="text-primary" />
          <span className="text-primary font-medium">Live Event</span>
        </div>
      </div>
    </div>
  );
}
