import React from 'react';
import { Image as ImageIcon } from 'lucide-react';

export function CoverImageUpload() {
  return (
    <div className="aspect-video md:aspect-square w-full rounded-3xl bg-black/40 backdrop-blur-md border border-white/10 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer md:hover:border-primary transition-all duration-300 shadow-2xl shadow-black/50">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 md:group-hover:opacity-100 transition-opacity" />
      
      {/* Dashed Border Effect */}
      <div className="absolute inset-3 md:inset-4 border-2 border-dashed border-white/10 rounded-2xl md:group-hover:border-primary/50 transition-colors" />

      <div className="text-center p-4 md:p-6 relative z-10">
        <div className="bg-white/5 p-3 md:p-4 rounded-full mb-3 md:mb-4 mx-auto w-fit md:group-hover:scale-110 transition-transform md:hover:bg-white/10">
          <ImageIcon className="w-6 h-6 md:w-8 md:h-8 text-white/50 md:group-hover:text-primary transition-colors" />
        </div>
        <p className="text-lg md:text-xl font-bold text-white mb-1 md:mb-2 uppercase tracking-wide">Upload Cover Image</p>
        <p className="text-[10px] md:text-xs text-white/40 uppercase tracking-widest">1080x1080 Recommended</p>
      </div>
    </div>
  );
}
