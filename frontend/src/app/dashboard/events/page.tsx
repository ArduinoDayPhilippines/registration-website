"use client";

import { useState, useEffect } from 'react';
import { AdminNavbar } from '@/components/admin/admin-navbar';
import { ActiveEvents } from '@/components/admin/active-events';
import { eventStorage } from '@/lib/storage/event-storage';
import { EventData } from '@/types/event';
import BokehBackground from '@/components/create-event/bokeh-background';
import Squares from '@/components/create-event/squares-background';

export default function EventsPage() {
  const [events, setEvents] = useState<EventData[]>([]);

  useEffect(() => {
    const loadedEvents = eventStorage.getAll();
    console.log('Loaded events from storage:', loadedEvents);
    setEvents(loadedEvents);
  }, []);

  const transformedEvents = events.map(event => ({
    id: event.slug,
    title: event.title,
    date: `${event.startDate}T${event.startTime}`,
    registered: 0,
    capacity: event.capacity === 'Unlimited' ? 999999 : parseInt(event.capacity) || 100,
    status: new Date(`${event.startDate}T${event.startTime}`) > new Date() ? 'active' : 'completed',
    coverImage: event.coverImage,
  }));

  console.log('Transformed events:', transformedEvents);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1f14] via-[#0a1520] to-[#120c08] text-white relative overflow-hidden font-[family-name:var(--font-urbanist)]">
      <BokehBackground />
      <Squares direction="diagonal" speed={0.3} />
      
      <div className="relative z-10">
        <AdminNavbar activeTab="events" />
        <main className="flex-1 px-4 md:px-8 py-8 pt-28">
          <div className="max-w-7xl mx-auto">
            <ActiveEvents events={transformedEvents} />
          </div>
        </main>
      </div>
    </div>
  );
}
