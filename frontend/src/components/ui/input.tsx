import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: LucideIcon;
  variant?: 'primary' | 'secondary';
  iconAlwaysActive?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon: Icon, variant = 'primary', iconAlwaysActive = false, className, children, ...props }, ref) => {
    
    const styles = {
      primary: {
        container: "md:hover:border-primary/50 md:hover:shadow-primary/5 focus-within:border-primary focus-within:shadow-[0_0_15px_rgba(0,128,128,0.25)] md:focus-within:shadow-[0_0_25px_rgba(0,128,128,0.45)]",
        iconWrapper: "group-focus-within:bg-primary/10",
        iconActive: "text-primary",
        iconInactive: "text-white/50 group-focus-within:text-primary",
        label: "group-focus-within:text-primary"
      },
      secondary: {
        container: "md:hover:border-secondary/50 md:hover:shadow-secondary/5 focus-within:border-secondary focus-within:shadow-[0_0_15px_rgba(238,116,2,0.25)] md:focus-within:shadow-[0_0_25px_rgba(238,116,2,0.45)]",
        iconWrapper: "group-focus-within:bg-secondary/10",
        iconActive: "text-secondary",
        iconInactive: "text-white/50 group-focus-within:text-secondary",
        label: "group-focus-within:text-secondary"
      }
    };

    const currentStyle = styles[variant];

    return (
      <div className={cn(
        "bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-3 md:p-4 flex items-start gap-3 md:gap-4 transition-all group shadow-sm",
        currentStyle.container,
        className
      )}>
        <div className={cn(
          "p-2 md:p-3 bg-white-50/5 rounded-xl transition-colors mt-0.5 md:mt-1",
          currentStyle.iconWrapper
        )}>
          <Icon className={cn(
            "w-4 h-4 md:w-5 md:h-5 transition-colors",
            iconAlwaysActive ? currentStyle.iconActive : currentStyle.iconInactive
          )} />
        </div>
        <div className="flex-1 flex flex-col gap-1 md:gap-2">
           {label && (
             <label className={cn(
               "text-[10px] text-white/40 uppercase tracking-widest font-bold mb-0.5 md:mb-1 block transition-colors",
               currentStyle.label
             )}>{label}</label>
           )}
           <input 
              ref={ref}
              className="bg-transparent border-none outline-none shadow-none text-sm md:text-base focus:ring-0 w-full p-0 placeholder-white/20 text-white font-medium"
              {...props} 
           />
           {children}
        </div>
      </div>
    );
  }
);
Input.displayName = "Input";

