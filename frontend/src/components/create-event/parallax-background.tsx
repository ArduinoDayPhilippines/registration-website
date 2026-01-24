import React, { ForwardedRef, forwardRef } from 'react';

export const ParallaxBackground = forwardRef((props, ref: ForwardedRef<HTMLDivElement>) => {
  return (
    <div ref={ref} className="fixed inset-0 pointer-events-none z-0 transition-transform duration-75 ease-out will-change-transform">
      <div className="blue-blur left-[-10% ] top-[-10%] w-[50%] h-[50%] absolute opacity-30" />
      <div className="orange-blur right-[-10%] bottom-[-10%] w-[50%] h-[50%] absolute opacity-30" />
    </div>
  );
});

ParallaxBackground.displayName = 'ParallaxBackground';
