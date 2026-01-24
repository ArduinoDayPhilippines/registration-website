import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
  sm: 'h-6 w-6 border-2',
  md: 'h-12 w-12 border-3',
  lg: 'h-16 w-16 border-4',
};

export function LoadingSpinner({ message = 'Loading...', size = 'md' }: LoadingSpinnerProps) {
  return (
    <div className="h-screen w-full bg-[#0a0a0a] text-white flex flex-col items-center justify-center gap-4">
      <div className={`${sizeStyles[size]} border-primary border-t-transparent rounded-full animate-spin`} />
      {message && <div className="text-xl">{message}</div>}
    </div>
  );
}
