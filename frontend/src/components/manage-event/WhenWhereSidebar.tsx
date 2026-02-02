import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { EventData } from '@/types/event';

interface WhenWhereSidebarProps {
  event: EventData;
}

export function WhenWhereSidebar({ event }: WhenWhereSidebarProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 md:p-6 border border-white/10">
        <h3 className="font-urbanist text-base md:text-lg font-bold text-white mb-4">
          When & Where
        </h3>
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="text-center bg-white/5 rounded-lg p-3 min-w-[60px]">
              <div className="text-xs text-white/60 uppercase">Jan</div>
              <div className="text-2xl font-bold text-white">30</div>
            </div>
            <div className="flex-1">
              <p className="text-white font-medium mb-1">Today</p>
              <p className="text-white/60 text-sm">
                {event.startTime} - {event.endTime} GMT+8
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
            <AlertTriangle size={20} className="text-cyan-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-white font-medium text-sm mb-1">Location Missing</p>
              <p className="text-white/60 text-xs">
                Please enter the location of the event before it starts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
