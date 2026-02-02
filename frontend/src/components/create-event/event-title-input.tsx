import React from 'react';

interface EventTitleInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function EventTitleInput({ value, onChange }: EventTitleInputProps) {
  return (
    <div className="group relative">
      <label className="text-xs text-secondary font-bold uppercase tracking-widest mb-1 md:mb-2 block">Event Name</label>
      <input 
        type="text" 
        placeholder="Event Name"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent border-none text-3xl md:text-5xl font-urbanist font-bold placeholder-white/10 focus:ring-0 p-0 text-white outline-none"
      />
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white-50/10 group-focus-within:bg-gradient-to-r group-focus-within:from-primary group-focus-within:to-secondary transition-colors" />
    </div>
  );
}
