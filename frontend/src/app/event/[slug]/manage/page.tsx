"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { ParallaxBackground } from "@/components/create-event/parallax-background";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorState } from "@/components/ui/error-state";
import { useEvent } from "@/hooks/event/use-event";
import {
  GuestStatistics,
  QuickActions,
  GuestListSection,
  EventDetailsForm,
  RegistrationQuestionsSection,
  EventSettingsSection,
  EventPreviewCard,
  WhenWhereSidebar,
  InvitationsSection,
} from "@/components/manage-event";

export default function ManageEventPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { event, loading, error } = useEvent(slug);
  const [activeTab, setActiveTab] = useState("overview");

  if (loading) {
    return <LoadingSpinner message="Loading event management..." />;
  }

  if (error || !event) {
    return (
      <ErrorState
        title="Event not found"
        message="The event you're trying to manage doesn't exist or has been removed."
        onAction={() => router.push("/")}
      />
    );
  }

  const eventUrl = `${window.location.origin}/event/${slug}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(eventUrl);
  };

  return (
    <div className="min-h-screen w-full bg-[#1a1a1a] text-white relative overflow-x-hidden font-montserrat">
      <ParallaxBackground />

      <Navbar />

      <main className="relative z-10 w-full max-w-6xl mx-auto px-3 md:px-6 lg:px-8 py-4 md:py-10 pb-16">
        {/* Header with Event Page Link */}
        <div className="flex items-center justify-between gap-3 mb-4 md:mb-6">
          <div className="min-w-0 flex-1">
            <h1 className="font-morganite text-2xl md:text-3xl lg:text-4xl font-bold text-white truncate">
              {event.title}
            </h1>
          </div>
          <button
            onClick={() => router.push(`/event/${slug}`)}
            className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-xs md:text-sm font-medium transition-colors whitespace-nowrap"
          >
            <span className="hidden sm:inline">Event Page</span>
            <span className="sm:hidden">View</span>
            <ArrowUpRight size={14} className="md:w-4 md:h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 md:gap-6 border-b border-white/10 mb-6 md:mb-8 overflow-x-auto -mx-3 md:mx-0 px-3 md:px-0">
          {["Overview", "Guests", "Registration"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`pb-2 md:pb-3 px-1 text-xs md:text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.toLowerCase()
                  ? "text-white border-b-2 border-white"
                  : "text-white/60 hover:text-white/80"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Guests Tab Content */}
        {activeTab === "guests" && (
          <>
            <GuestStatistics
              totalRegistered={0}
              going={0}
              checkedIn={0}
              waitlist={0}
            />
            <QuickActions />
            <GuestListSection />
          </>
        )}

        {/* Overview Tab Content */}
        {activeTab === "overview" && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
              <EventPreviewCard
                event={event}
                eventUrl={eventUrl}
                onCopy={copyToClipboard}
                onEditEvent={() => setActiveTab("registration")}
              />
              <WhenWhereSidebar event={event} />
            </div>
            <InvitationsSection />
          </>
        )}

        {/* Registration Tab Content */}
        {activeTab === "registration" && (
          <>
            <div className="space-y-6">
              <EventDetailsForm event={event} />
              <RegistrationQuestionsSection questions={event.questions} />
              <EventSettingsSection requireApproval={event.requireApproval} />

              {/* Save Button */}
              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <button
                  onClick={() => setActiveTab("overview")}
                  className="font-montserrat px-6 py-2.5 md:py-3 bg-white/5 hover:bg-white/10 rounded-lg text-white text-sm md:text-base font-medium transition-colors"
                >
                  Cancel
                </button>
                <button className="font-montserrat px-6 py-2.5 md:py-3 bg-secondary hover:bg-secondary/90 rounded-lg text-white text-sm md:text-base font-medium transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
