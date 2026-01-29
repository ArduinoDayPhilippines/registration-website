import React from 'react';
import { FileText } from 'lucide-react';

interface DescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function DescriptionInput({ value, onChange }: DescriptionInputProps) {
  return (
    <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-start gap-4 hover:border-primary/30 transition-all group focus-within:border-primary focus-within:shadow-[0_0_25px_rgba(0,128,128,0.45)]">
      <div className="p-3 bg-white-50/5 rounded-xl mt-1 transition-colors group-focus-within:bg-primary/10">
        <FileText className="w-5 h-5 text-white/50 group-focus-within:text-primary transition-colors" />
      </div>
      <div className="flex-1">
        <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-2 block group-focus-within:text-primary transition-colors">Description</label>
        <textarea 
          placeholder="Details about your event..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-transparent border-none outline-none shadow-none text-base focus:ring-0 w-full p-0 placeholder-white/20 resize-none min-h-[120px] text-white leading-relaxed custom-scrollbar"
        />
      </div>
    </div>
  );
}
