import React from 'react';
import { EventData } from '@/types/event';

interface EventDetailsFormProps {
  event: EventData;
}

export function EventDetailsForm({ event }: EventDetailsFormProps) {
  return (
    <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 md:p-6 border border-white/10">
      <h2 className="font-montserrat text-lg md:text-xl font-bold text-white mb-4 md:mb-6">
        Event Details
      </h2>

      <div className="space-y-6">
        {/* Event Title */}
        <div>
          <label className="font-montserrat block text-sm font-medium text-white/80 mb-2">
            Event Title
          </label>
          <input
            type="text"
            defaultValue={event.title}
            className="font-montserrat w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-base placeholder-white/40 focus:outline-none focus:border-secondary transition-colors"
          />
        </div>

        {/* Description */}
        <div>
          <label className="font-montserrat block text-sm font-medium text-white/80 mb-2">
            Description
          </label>
          <textarea
            rows={4}
            defaultValue={event.description}
            className="font-montserrat w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-base placeholder-white/40 focus:outline-none focus:border-secondary transition-colors resize-none"
          />
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="font-montserrat block text-sm font-medium text-white/80 mb-2">
              Date
            </label>
            <input
              type="date"
              defaultValue={event.startDate}
              className="font-montserrat w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-base placeholder-white/40 focus:outline-none focus:border-secondary transition-colors"
            />
          </div>
          <div>
            <label className="font-montserrat block text-sm font-medium text-white/80 mb-2">
              Start Time
            </label>
            <input
              type="time"
              defaultValue={event.startTime}
              className="font-montserrat w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-base placeholder-white/40 focus:outline-none focus:border-secondary transition-colors"
            />
          </div>
          <div>
            <label className="font-montserrat block text-sm font-medium text-white/80 mb-2">
              End Time
            </label>
            <input
              type="time"
              defaultValue={event.endTime}
              className="font-montserrat w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-base placeholder-white/40 focus:outline-none focus:border-secondary transition-colors"
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="font-montserrat block text-sm font-medium text-white/80 mb-2">
            Location
          </label>
          <input
            type="text"
            defaultValue={event.location}
            placeholder="Enter event location"
            className="font-montserrat w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-base placeholder-white/40 focus:outline-none focus:border-secondary transition-colors"
          />
        </div>

        {/* Capacity and Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="font-montserrat block text-sm font-medium text-white/80 mb-2">
              Capacity
            </label>
            <input
              type="text"
              defaultValue={event.capacity}
              className="font-montserrat w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-base placeholder-white/40 focus:outline-none focus:border-secondary transition-colors"
            />
          </div>
          <div>
            <label className="font-montserrat block text-sm font-medium text-white/80 mb-2">
              Ticket Price
            </label>
            <input
              type="text"
              defaultValue={event.ticketPrice}
              className="font-montserrat w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-base placeholder-white/40 focus:outline-none focus:border-secondary transition-colors"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
