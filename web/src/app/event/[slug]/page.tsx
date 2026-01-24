"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { ParallaxBackground } from "@/components/create-event/parallax-background";
import { BackButton } from "@/components/ui/back-button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorState } from "@/components/ui/error-state";
import { EventCoverImage } from "@/components/event/event-cover-image";
import { EventDateTime } from "@/components/event/event-date-time";
import { EventLocation } from "@/components/event/event-location";
import { EventRegistrationCard } from "@/components/event/event-registration-card";
import { EventAbout } from "@/components/event/event-about";
import { EventHost } from "@/components/event/event-host";
import { RsvpModal } from "@/components/event/rsvp-modal";
import { useEvent } from "@/hooks/event/use-event";

export default function EventPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { event, loading, error } = useEvent(slug);
  const [isRsvpModalOpen, setIsRsvpModalOpen] = useState(false);

  if (loading) {
    return <LoadingSpinner message="Loading event..." />;
  }

  if (error || !event) {
    return (
      <ErrorState
        title="Event not found"
        message="The event you're looking for doesn't exist or has been removed."
        onAction={() => router.push("/")}
      />
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] text-white relative overflow-x-hidden font-montserrat">
      <ParallaxBackground />

      <Navbar />

      <main className="relative z-10 w-full max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-10 pb-16">
        {/* Back Button */}
        <div className="animate-fade-in mb-6 md:mb-8">
          <BackButton />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] xl:grid-cols-[440px_1fr] gap-8 lg:gap-10 xl:gap-12">
          {/* Left Column - Cover Image (Desktop: + About + Hosted By) */}
          <div className="animate-fade-in space-y-6">
            <EventCoverImage src={event.coverImage || ""} alt={event.title} />

            {/* About - Desktop Only */}
            <EventAbout 
              description={event.description} 
              className="hidden lg:block" 
            />

            {/* Hosted By - Desktop Only */}
            <EventHost 
              eventTitle={event.title} 
              className="hidden lg:block border-t border-white/10 pt-6" 
            />
          </div>

          {/* Right Column - Event Info */}
          <div className="animate-fade-in animate-delay-200">
            {/* Event Title */}
            <h1 className="font-morganite text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight text-white">
              {event.title}
            </h1>

            {/* About - Mobile Only (below title) */}
            <EventAbout 
              description={event.description} 
              className="lg:hidden mb-6 pb-6 border-b border-white/10" 
            />

            {/* Date & Time */}
            <EventDateTime
              startDate={event.startDate}
              startTime={event.startTime}
              endTime={event.endTime}
            />

            {/* Location */}
            <EventLocation location={event.location} />

            {/* Registration Card */}
            <EventRegistrationCard
              requireApproval={event.requireApproval}
              ticketPrice={event.ticketPrice}
              capacity={event.capacity}
              onRsvpClick={() => setIsRsvpModalOpen(true)}
            />

            {/* Hosted By - Mobile Only (at the end) */}
            <EventHost 
              eventTitle={event.title} 
              className="lg:hidden border-t border-white/10 pt-6 mt-8" 
            />
          </div>
        </div>
      </main>

      {/* RSVP Modal */}
      <RsvpModal
        isOpen={isRsvpModalOpen}
        onClose={() => setIsRsvpModalOpen(false)}
        eventTitle={event.title}
        questions={event.questions}
        requireApproval={event.requireApproval}
      />
    </div>
  );
}
