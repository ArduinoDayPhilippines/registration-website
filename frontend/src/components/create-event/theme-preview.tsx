import React from 'react';
import { ChevronRight } from 'lucide-react';

interface ThemePreviewProps {
  value: string;
  onChange: (value: string) => void;
}

export function ThemePreview({ value, onChange }: ThemePreviewProps) {
  // For now, this is just a display component. Theme selection can be expanded later
  return (
    <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-3 flex items-center justify-between cursor-pointer md:hover:border-white/20 transition-colors group">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gray-800 to-black border border-white/10 shadow-inner md:group-hover:border-primary/50 transition-colors"></div>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-white">Event Theme</span>
          <span className="text-[9px] text-white/40 uppercase tracking-wider">{value}</span>
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-white/30 md:group-hover:text-white transition-colors" />
    </div>
  );
}
