import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { StatusBadge } from './status-badge';

interface Event {
  id: string;
  title: string;
  date: string;
  registered: number;
  capacity: number;
  status: string;
}

interface ActiveEventsProps {
  events: Event[];
}

export const ActiveEvents: React.FC<ActiveEventsProps> = ({ events }) => {
  return (
    <div className="bg-gradient-to-br from-[#092728]/60 via-[#0a2d2e]/50 to-[#092728]/60 backdrop-blur-sm rounded-xl p-6 border border-[#856730]/30 shadow-lg shadow-[#733C0B]/20">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 !text-white font-sans" style={{ color: '#ffffff', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
        <Calendar className="w-5 h-5 text-[#856730]" />
        Active Events
      </h2>
      <div className="space-y-4">
        {events.map((event) => {
          const percentage = Math.round((event.registered / event.capacity) * 100);
          return (
            <div key={event.id} className="p-4 bg-[#092728]/40 rounded-lg border border-[#2D504B]/30 hover:border-[#856730]/50 transition-all hover:shadow-lg hover:shadow-[#733C0B]/20">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="font-semibold text-base !text-white flex-1" style={{ color: '#ffffff', fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif' }}>{event.title}</h3>
                <StatusBadge status={event.status} />
              </div>
              <p className="text-xs !text-white mb-3 flex items-center gap-1" style={{ color: '#ffffff' }}>
                <Clock className="w-3 h-3 !text-white" style={{ color: '#ffffff' }} />
                {new Date(event.date).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
              <div className="mb-2">
                <div className="flex justify-between text-xs mb-1">
                  <span className="!text-white" style={{ color: '#ffffff' }}>Capacity</span>
                  <span className="font-medium !text-white" style={{ color: '#ffffff' }}>{event.registered} / {event.capacity}</span>
                </div>
                <div className="w-full bg-teal-900/30 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${percentage >= 90 ? 'bg-gradient-to-r from-red-500 to-orange-500' : percentage >= 70 ? 'bg-gradient-to-r from-amber-500 to-yellow-500' : 'bg-gradient-to-r from-emerald-500 to-teal-500'}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
              <p className="text-xs !text-white" style={{ color: '#ffffff' }}>{percentage}% filled</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
