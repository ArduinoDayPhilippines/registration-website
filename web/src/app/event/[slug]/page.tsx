"use client";

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { ParallaxBackground } from '@/components/create-event/parallax-background';
import { BackButton } from '@/components/ui/back-button';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorState } from '@/components/ui/error-state';
import { EventCoverImage } from '@/components/event/event-cover-image';
import { EventHeader } from '@/components/event/event-header';
import { EventDetailsGrid } from '@/components/event/event-details-grid';
import { EventDescription } from '@/components/event/event-description';
import { EventRegistrationInfo } from '@/components/event/event-registration-info';
import { useEvent } from '@/hooks/event/use-event';

export default function EventPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { event, loading, error } = useEvent(slug);

  if (loading) {
    return <LoadingSpinner message="Loading event..." />;
  }

  if (error || !event) {
    return (
      <ErrorState 
        title="Event not found"
        message="The event you're looking for doesn't exist or has been removed."
        onAction={() => router.push('/')}
      />
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] text-white relative overflow-x-hidden font-montserrat">
      <ParallaxBackground />
      
      <Navbar />

      <main className="relative z-10 w-full max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-10 pb-32">
        {/* Back Button with animation */}
        <div className="animate-fade-in">
          <BackButton />
        </div>
        
        {/* Cover Image */}
        <EventCoverImage src={event.coverImage || ''} alt={event.title} />
        
        {/* Event Header */}
        <EventHeader title={event.title} createdAt={event.createdAt} />
        
        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-10 md:mb-12" />
        
        {/* Event Details Grid */}
        <EventDetailsGrid event={event} />
        
        {/* Description */}
        <EventDescription description={event.description} />
        
        {/* Registration Info */}
        <EventRegistrationInfo 
          requireApproval={event.requireApproval}
          questions={event.questions}
        />

        {/* Spacer for fixed CTA */}
        <div className="h-4" />
      </main>

      {/* Sticky CTA Button */}
      <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
        <div className="bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/95 to-transparent pt-6 pb-6 px-4">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Event Quick Info */}
            <div className="flex items-center gap-4 text-sm">
              <div className="hidden sm:flex w-12 h-12 rounded-xl bg-primary/20 border border-primary/30 items-center justify-center backdrop-blur-sm">
                <span className="text-primary text-xl font-bold">🎫</span>
              </div>
              <div>
                <p className="font-bold text-white/90 line-clamp-1">{event.title}</p>
                <p className="text-white/50 text-xs">{event.ticketPrice} • {event.capacity}</p>
              </div>
            </div>
            
            {/* Register Button */}
            <Button 
              size="lg"
              className="w-full sm:w-auto min-w-[200px] shadow-[0_0_30px_rgba(0,128,128,0.4)] hover:shadow-[0_0_40px_rgba(0,128,128,0.6)]"
            >
              Register Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
