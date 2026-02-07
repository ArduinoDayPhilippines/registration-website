import React from "react";
import { CheckCircle, Users, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EventRegistrationCardProps {
  requireApproval: boolean;
  ticketPrice: string;
  capacity: string;
  registeredCount?: number;
  onRsvpClick: () => void;
}

export function EventRegistrationCard({
  requireApproval,
  ticketPrice,
  capacity,
  registeredCount = 0,
  onRsvpClick,
}: EventRegistrationCardProps) {
  const capacityNum = parseInt(capacity) || 0;
  const slotsAvailable = capacityNum - registeredCount;
  const isAlmostFull =
    capacityNum > 0 && slotsAvailable <= Math.max(10, capacityNum * 0.1);
  const isFull = capacityNum > 0 && slotsAvailable <= 0;

  return (
    <div className="bg-black/40 backdrop-blur-md rounded-xl p-5 md:p-6 border border-white/10 mb-6">
      <h3 className="font-montserrat text-base font-bold mb-3 text-white">
        Registration
      </h3>

      <p className="text-white/70 text-sm mb-5 leading-relaxed">
        Welcome! To join the event, please register below.
      </p>

      {requireApproval && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-secondary/10 border border-secondary/20 mb-4">
          <CheckCircle
            size={16}
            className="text-secondary mt-0.5 flex-shrink-0"
          />
          <p className="text-white/80 text-xs">Approval required</p>
        </div>
      )}

      <Button
        fullWidth
        onClick={onRsvpClick}
        disabled={isFull}
        className="text-sm font-bold tracking-wide shadow-[0_0_30px_rgba(0,128,128,0.4)] hover:shadow-[0_0_40px_rgba(0,128,128,0.6)] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isFull ? "EVENT FULL" : "RSVP"}
      </Button>

      {/* Event Details - Price & Capacity Info */}
      <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
        {/* Ticket Price */}
        <div className="flex items-center gap-3">
          <Ticket size={16} className="text-secondary flex-shrink-0" />
          <div className="flex-1">
            <p className="text-xs text-white/50 mb-0.5">Ticket Price</p>
            <p className="text-sm text-white font-semibold">{ticketPrice}</p>
          </div>
        </div>

        {/* Capacity & Available Slots */}
        {capacityNum > 0 && (
          <div className="flex items-center gap-3">
            <Users size={16} className="text-secondary flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-white/50 mb-0.5">Capacity</p>
              {slotsAvailable > 0 && (
                <p
                  className={`text-sm font-semibold ${
                    isAlmostFull ? "text-yellow-400" : "text-white"
                  }`}
                >
                  {slotsAvailable} {slotsAvailable === 1 ? "slot" : "slots"}{" "}
                  available
                  {isAlmostFull && " ⚠️"}
                </p>
              )}
              {isFull && (
                <p className="text-sm text-red-400 font-semibold">
                  No slots available
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
