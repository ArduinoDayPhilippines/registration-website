import React from 'react';

export function EventTitleInput() {
  return (
    <div className="group relative">
      <label className="text-xs text-secondary font-bold uppercase tracking-widest mb-1 md:mb-2 block">Event Name</label>
      <input 
        type="text" 
        placeholder="Event Name" 
        className="w-full bg-transparent border-none text-5xl md:text-7xl font-morganite font-bold placeholder-white/10 focus:ring-0 p-0 text-white outline-none"
      />
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white-50/10 group-focus-within:bg-gradient-to-r group-focus-within:from-primary group-focus-within:to-secondary transition-colors" />
    </div>
  );
}
