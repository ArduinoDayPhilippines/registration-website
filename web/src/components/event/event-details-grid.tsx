import React from 'react';
import { Calendar, MapPin, DollarSign, Users } from 'lucide-react';
import { EventDetailCard } from './event-detail-card';
import { EventData } from '@/types/event';

interface EventDetailsGridProps {
  event: EventData;
}

export function EventDetailsGrid({ event }: EventDetailsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 mb-8 md:mb-10">
      {/* Date & Time */}
      <div className="animate-fade-in animate-delay-100">
        <EventDetailCard icon={Calendar} title="Date & Time" accent="primary">
          <div className="space-y-2.5 text-white/80">
            <div className="flex items-start gap-2">
              <span className="text-primary text-sm mt-0.5">▶</span>
              <div>
                <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Start</p>
                <p className="font-medium text-white/90">{event.startDate} at {event.startTime}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary text-sm mt-0.5">■</span>
              <div>
                <p className="text-xs text-white/50 uppercase tracking-wider mb-1">End</p>
                <p className="font-medium text-white/90">{event.endDate} at {event.endTime}</p>
              </div>
            </div>
          </div>
        </EventDetailCard>
      </div>

      {/* Location */}
      <div className="animate-fade-in animate-delay-200">
        <EventDetailCard icon={MapPin} title="Location" accent="secondary">
          <p className="text-white/90 text-lg font-medium">{event.location || 'No location specified'}</p>
        </EventDetailCard>
      </div>

      {/* Ticket Price */}
      <div className="animate-fade-in animate-delay-300">
        <EventDetailCard 
          icon={DollarSign} 
          title="Ticket Price"
          accent="blue"
          valueClassName="flex items-baseline gap-2"
        >
          <span className="text-white text-3xl md:text-4xl font-bold tracking-tight">{event.ticketPrice}</span>
          {event.ticketPrice === 'Free' && (
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">
              No cost
            </span>
          )}
        </EventDetailCard>
      </div>

      {/* Capacity */}
      <div className="animate-fade-in animate-delay-400">
        <EventDetailCard 
          icon={Users} 
          title="Capacity"
          accent="purple"
          valueClassName="flex items-baseline gap-2"
        >
          <span className="text-white text-3xl md:text-4xl font-bold tracking-tight">{event.capacity}</span>
          {event.capacity === 'Unlimited' && (
            <span className="text-purple-400 text-sm font-semibold uppercase tracking-wider">
              Spots
            </span>
          )}
        </EventDetailCard>
      </div>
    </div>
  );
}
