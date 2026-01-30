import React from 'react';
import { Mail } from 'lucide-react';

export function InvitationsSection() {
  return (
    <div className="mt-8 bg-white/5 backdrop-blur-md rounded-xl p-4 md:p-6 border border-white/10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div>
          <h2 className="font-montserrat text-lg md:text-xl font-bold text-white mb-1">
            Invitations
          </h2>
          <p className="text-white/60 text-sm">
            Invite subscribers, contacts and past guests via email or SMS.
          </p>
        </div>
        <button className="px-4 py-2 bg-secondary hover:bg-secondary/90 rounded-lg text-white text-sm font-medium transition-colors whitespace-nowrap self-start md:self-auto">
          + Invite Guests
        </button>
      </div>

      <div className="flex flex-col items-center justify-center py-8 md:py-12 text-center">
        <div className="w-12 h-12 md:w-16 md:h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
          <Mail size={24} className="text-white/40 md:w-8 md:h-8" />
        </div>
        <h3 className="font-montserrat text-base md:text-lg font-medium text-white mb-2">
          No Invitations Sent
        </h3>
        <p className="text-white/60 text-xs md:text-sm px-4">
          You can invite subscribers, contacts and past guests to the event.
        </p>
      </div>
    </div>
  );
}
