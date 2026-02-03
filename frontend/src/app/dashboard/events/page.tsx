"use client";

import { useState, useEffect } from 'react';
import { AdminNavbar } from '@/components/admin/admin-navbar';
import { ActiveEvents } from '@/components/admin/active-events';
import BokehBackground from '@/components/create-event/bokeh-background';
import Squares from '@/components/create-event/squares-background';
import { getEvents } from '@/app/event/actions';

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvents() {
      setLoading(true);
      const result = await getEvents();
      
      if (result.success && result.data) {
        console.log('Loaded events from database:', result.data);
        setEvents(result.data);
      } else {
        console.error('Failed to load events:', result.error);
      }
      setLoading(false);
    }
    
    loadEvents();
  }, []);

  const transformedEvents = events.map(event => ({
    id: event.event_id,
    title: event.event_name || 'Untitled Event',
    date: event.start_date,
    registered: event.registered, 
    capacity: event.capacity,
    status: event.status,
    coverImage: event.cover_image,
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
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#06b6d4] mx-auto mb-4"></div>
                  <p className="text-gray-400">Loading events...</p>
                </div>
              </div>
            ) : (
              <ActiveEvents events={transformedEvents} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
