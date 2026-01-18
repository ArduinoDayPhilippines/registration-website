import React from 'react';
import { Ticket, Users, Lock, LockOpen } from 'lucide-react';

interface EventOptionsProps {
  ticketPrice: string;
  setTicketPrice: (value: string) => void;
  capacity: string;
  setCapacity: (value: string) => void;
  requireApproval: boolean;
  setRequireApproval: (value: boolean) => void;
}

export function EventOptions({ ticketPrice, capacity, requireApproval, setRequireApproval }: EventOptionsProps) {
  return (
    <div className="pt-4 space-y-3">
      <h3 className="text-2xl font-morganite font-bold text-white tracking-wide">Event Options</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Ticket Price */}
        <div className="flex items-center justify-between p-3 md:p-4 rounded-2xl bg-black/40 backdrop-blur-md border border-white/5 md:hover:border-white/20 transition-all cursor-pointer group">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white-50/5 group-hover:bg-primary/10 transition-colors">
               <Ticket className="w-4 h-4 text-primary" />
            </div>
            <span className="font-medium text-white text-sm">Ticket Price</span>
          </div>
          <span className="text-sm font-bold text-white/60">{ticketPrice}</span>
        </div>

        {/* Require Approval Switch */}
        <div 
          className={`flex items-center justify-between p-3 md:p-4 rounded-2xl bg-black/40 backdrop-blur-md border transition-all cursor-pointer group/lock ${requireApproval ? 'border-secondary/50 shadow-[0_0_15px_rgba(238,116,2,0.1)]' : 'border-white/5 md:hover:border-white/20'}`} 
          onClick={() => setRequireApproval(!requireApproval)}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg transition-colors duration-300 ${requireApproval ? 'bg-white-50/10 text-secondary' : 'bg-white-50/5 text-white-50/60'}`}>
              {requireApproval ? <Lock className="w-4 h-4" /> : <LockOpen className="w-4 h-4" />}
            </div>
            <span className={`font-medium text-sm transition-colors duration-300 ${requireApproval ? 'text-white' : 'text-white-50/60'}`}>Require Approval</span>
          </div>
          
          {/* Enhanced Toggle */}
          <div className={`w-11 h-6 rounded-full flex items-center p-1 transition-all duration-300 border ${requireApproval ? 'bg-secondary border-secondary shadow-[0_0_10px_rgba(238,116,2,0.4)]' : 'bg-white-100/5 border-white-100/10'}`}>
            <div className={`w-4 h-4 rounded-full shadow-sm transition-all duration-300 ${requireApproval ? 'translate-x-5 bg-black' : 'translate-x-0 bg-white-50/60'}`} />
          </div>
        </div>

        {/* Capacity */}
        <div className="flex items-center justify-between p-3 md:p-4 rounded-2xl bg-black/40 backdrop-blur-md border border-white/5 md:hover:border-white/20 transition-all cursor-pointer md:col-span-2 group">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white-50/5 group-hover:bg-blue-400/10 transition-colors">
                <Users className="w-4 h-4 text-blue-400" />
            </div>
            <span className="font-medium text-white text-sm">Capacity</span>
          </div>
          <span className="text-sm font-bold text-white/60">{capacity}</span>
        </div>
      </div>
    </div>
  );
}
