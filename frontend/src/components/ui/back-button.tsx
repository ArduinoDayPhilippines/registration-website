import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface BackButtonProps {
  label?: string;
  href?: string;
}

export function BackButton({ label = 'Back to Home', href = '/dashboard' }: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <button 
      onClick={handleClick}
      className="flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-6"
    >
      <ArrowLeft size={20} />
      <span>{label}</span>
    </button>
  );
}
