import React from 'react';
import { ChevronRight } from 'lucide-react';

export function ThemePreview() {
  return (
    <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 md:p-5 flex items-center justify-between cursor-pointer md:hover:border-white/20 transition-colors group">
      <div className="flex items-center gap-3 md:gap-4">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-gray-800 to-black border border-white/10 shadow-inner md:group-hover:border-primary/50 transition-colors"></div>
        <div className="flex flex-col">
          <span className="text-sm md:text-base font-bold text-white">Event Theme</span>
          <span className="text-[10px] md:text-xs text-white/40 uppercase tracking-wider">Minimal Dark</span>
        </div>
      </div>
      <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-white/30 md:group-hover:text-white transition-colors" />
    </div>
  );
}
