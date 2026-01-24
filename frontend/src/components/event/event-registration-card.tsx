import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EventRegistrationCardProps {
  requireApproval: boolean;
  ticketPrice: string;
  capacity: string;
  onRsvpClick: () => void;
}

export function EventRegistrationCard({
  requireApproval,
  ticketPrice,
  capacity,
  onRsvpClick,
}: EventRegistrationCardProps) {
  return (
    <div className="bg-black/40 backdrop-blur-md rounded-xl p-5 md:p-6 border border-white/10 mb-6">
      <h3 className="font-montserrat text-base font-bold mb-3 text-white">
        Registration
      </h3>

      <p className="text-white/70 text-sm mb-5 leading-relaxed">
        Welcome! To join the event, please register below.
      </p>

      {requireApproval && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-secondary/10 border border-secondary/20 mb-4">
          <CheckCircle
            size={16}
            className="text-secondary mt-0.5 flex-shrink-0"
          />
          <p className="text-white/80 text-xs">Approval required</p>
        </div>
      )}

      <Button
        fullWidth
        onClick={onRsvpClick}
        className="text-sm font-bold tracking-wide shadow-[0_0_30px_rgba(0,128,128,0.4)] hover:shadow-[0_0_40px_rgba(0,128,128,0.6)]"
      >
        RSVP
      </Button>

      {/* Price & Capacity - Bottom Info */}
      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/5 text-xs text-white/60">
        <span>{ticketPrice}</span>
        <span>•</span>
        <span>{capacity}</span>
      </div>
    </div>
  );
}
