import React from 'react';
import Image from 'next/image';

interface EventCoverImageProps {
  src: string;
  alt: string;
}

export function EventCoverImage({ src, alt }: EventCoverImageProps) {
  if (!src) return null;

  return (
    <div className="w-full h-64 md:h-96 lg:h-[32rem] rounded-3xl overflow-hidden mb-10 md:mb-12 relative group animate-fade-in">
      {/* Image Container */}
      <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105">
        <Image 
          src={src} 
          alt={alt}
          fill
          className="object-cover"
          priority
        />
      </div>
      
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 opacity-50 mix-blend-overlay pointer-events-none" />
      
      {/* Border Glow Effect */}
      <div className="absolute inset-0 rounded-3xl ring-1 ring-white/10 ring-inset pointer-events-none" />
      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[0_0_40px_rgba(0,128,128,0.3)] pointer-events-none" />
    </div>
  );
}
