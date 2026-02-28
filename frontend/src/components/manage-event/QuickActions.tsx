import React, { useState } from 'react';
import { Mail, QrCode, Users } from 'lucide-react';
import { QRScannerModal } from './QRScannerModal';

interface QuickActionsProps {
  eventSlug: string;
}

export function QuickActions({ eventSlug }: QuickActionsProps) {
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-8">
        <button className="flex items-center gap-3 md:gap-4 p-4 md:p-5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors text-left">
          <div className="p-2 md:p-3 bg-blue-500/20 rounded-xl flex-shrink-0">
            <Mail size={20} className="text-blue-400 md:w-6 md:h-6" />
          </div>
          <div className="min-w-0">
            <h3 className="font-urbanist text-sm md:text-base font-semibold text-white">
              Invite Guests
            </h3>
            <p className="font-urbanist text-white/60 text-xs mt-0.5 md:mt-1 hidden md:block">
              Send invitations via email
            </p>
          </div>
        </button>
        <button 
          onClick={() => setIsScannerOpen(true)}
          className="flex items-center gap-3 md:gap-4 p-4 md:p-5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors text-left"
        >
          <div className="p-2 md:p-3 bg-green-500/20 rounded-xl flex-shrink-0">
            <QrCode size={20} className="text-green-400 md:w-6 md:h-6" />
          </div>
          <div className="min-w-0">
            <h3 className="font-urbanist text-sm md:text-base font-semibold text-white">
              Check In Guests
            </h3>
            <p className="font-urbanist text-white/60 text-xs mt-0.5 md:mt-1 hidden md:block">
              Scan QR codes at the door
            </p>
          </div>
        </button>
        <button className="flex items-center gap-3 md:gap-4 p-4 md:p-5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors text-left">
          <div className="p-2 md:p-3 bg-cyan-500/20 rounded-xl flex-shrink-0">
            <Users size={20} className="text-cyan-400 md:w-6 md:h-6" />
          </div>
          <div className="min-w-0">
            <h3 className="font-urbanist text-sm md:text-base font-semibold text-white">
              Guest List
            </h3>
            <p className="font-urbanist text-white/60 text-xs mt-0.5 md:mt-1 hidden md:block">
              Public guest list page
            </p>
          </div>
        </button>
      </div>

      <QRScannerModal 
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        eventSlug={eventSlug}
      />
    </>
  );
}
