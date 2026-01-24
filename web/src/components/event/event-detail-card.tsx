import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EventDetailCardProps {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
  valueClassName?: string;
  accent?: 'primary' | 'secondary' | 'blue' | 'purple';
}

const accentColors = {
  primary: {
    icon: 'text-primary',
    bg: 'group-hover:bg-primary/5',
    border: 'group-hover:border-primary/30',
    glow: 'group-hover:shadow-[0_0_20px_rgba(0,128,128,0.15)]',
  },
  secondary: {
    icon: 'text-secondary',
    bg: 'group-hover:bg-secondary/5',
    border: 'group-hover:border-secondary/30',
    glow: 'group-hover:shadow-[0_0_20px_rgba(238,116,2,0.15)]',
  },
  blue: {
    icon: 'text-blue-400',
    bg: 'group-hover:bg-blue-400/5',
    border: 'group-hover:border-blue-400/30',
    glow: 'group-hover:shadow-[0_0_20px_rgba(96,165,250,0.15)]',
  },
  purple: {
    icon: 'text-purple-400',
    bg: 'group-hover:bg-purple-400/5',
    border: 'group-hover:border-purple-400/30',
    glow: 'group-hover:shadow-[0_0_20px_rgba(192,132,252,0.15)]',
  },
};

export function EventDetailCard({ 
  icon: Icon, 
  title, 
  children,
  valueClassName,
  accent = 'primary',
}: EventDetailCardProps) {
  const colors = accentColors[accent];

  return (
    <div className={`
      group relative overflow-hidden
      bg-black/40 backdrop-blur-md rounded-2xl p-6 
      border border-white/10 
      transition-all duration-300 ease-out
      hover:scale-[1.02] hover:-translate-y-1
      ${colors.border}
      ${colors.glow}
    `}>
      {/* Gradient Overlay */}
      <div className={`
        absolute inset-0 opacity-0 group-hover:opacity-100 
        transition-opacity duration-300
        bg-gradient-to-br from-white/5 to-transparent
        pointer-events-none
      `} />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className={`
            p-2.5 rounded-xl 
            bg-white/5 backdrop-blur-sm
            transition-all duration-300
            ${colors.bg}
          `}>
            <Icon className={`${colors.icon} transition-transform duration-300 group-hover:scale-110`} size={24} />
          </div>
          <h3 className="text-xl font-semibold text-white/90 group-hover:text-white transition-colors">
            {title}
          </h3>
        </div>
        <div className={valueClassName}>
          {children}
        </div>
      </div>
    </div>
  );
}
