import React, { useRef } from 'react';
import { Image as ImageIcon, X } from 'lucide-react';

interface CoverImageUploadProps {
  value: string;
  onChange: (value: string) => void;
}

export function CoverImageUpload({ value, onChange }: CoverImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div 
      onClick={handleClick}
      className="aspect-video w-full rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer md:hover:border-primary transition-all duration-300 shadow-2xl shadow-black/50"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {value ? (
        <>
          <img 
            src={value} 
            alt="Cover" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <button
            onClick={handleRemove}
            className="absolute top-4 right-4 p-2 bg-black/60 backdrop-blur-sm rounded-full hover:bg-black/80 transition-colors z-10"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <div className="absolute inset-0 bg-black/40 opacity-0 md:group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <p className="text-white font-bold">Click to change</p>
          </div>
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 md:group-hover:opacity-100 transition-opacity" />
          
          {/* Dashed Border Effect */}
          <div className="absolute inset-3 md:inset-4 border-2 border-dashed border-white/10 rounded-2xl md:group-hover:border-primary/50 transition-colors" />

          <div className="text-center p-4 relative z-10">
            <div className="bg-white/5 p-2.5 rounded-full mb-2.5 mx-auto w-fit md:group-hover:scale-110 transition-transform md:hover:bg-white/10">
              <ImageIcon className="w-6 h-6 text-white/50 md:group-hover:text-primary transition-colors" />
            </div>
            <p className="text-base font-bold text-white mb-1 uppercase tracking-wide">Upload Cover Image</p>
            <p className="text-[9px] text-white/40 uppercase tracking-widest">1080x1080 Recommended</p>
          </div>
        </>
      )}
    </div>
  );
}
