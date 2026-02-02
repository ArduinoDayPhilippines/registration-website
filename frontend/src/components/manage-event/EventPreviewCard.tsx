import React from "react";
import {
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  Facebook,
  Twitter,
  Linkedin,
  Link as LinkIcon,
} from "lucide-react";
import { EventData } from "@/types/event";

interface EventPreviewCardProps {
  event: EventData;
  eventUrl: string;
  onCopy: () => void;
  onEditEvent: () => void;
}

export function EventPreviewCard({
  event,
  eventUrl,
  onCopy,
  onEditEvent,
}: EventPreviewCardProps) {
  return (
    <div className="bg-gradient-to-br from-teal-900/40 to-cyan-800/40 backdrop-blur-md rounded-xl border border-teal-500/20 overflow-hidden">
      <div className="p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 md:gap-6">
          {/* Cover Image */}
          <div className="relative aspect-square md:aspect-auto md:h-[200px] rounded-lg overflow-hidden bg-black/20">
            {event.coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={event.coverImage}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/40">
                No Image
              </div>
            )}
          </div>

          {/* Event Info */}
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {event.title}
              </h2>
              <div className="flex items-center gap-2 text-sm text-white/70">
                <Calendar size={14} />
                <span>{event.startDate}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/70 mt-1">
                <Clock size={14} />
                <span>
                  {event.startTime} - {event.endTime}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/70 mt-1">
                <MapPin size={14} />
                <span>{event.location}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-xs font-bold">
                C
              </div>
              <span className="text-sm text-white/70">Host</span>
              <span className="text-white/40 text-xs">Example@gmail.com</span>
            </div>

            {/* Event URL */}
            <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg gap-2">
              <a
                href={eventUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 text-xs md:text-sm hover:text-white flex items-center gap-1 truncate"
              >
                <span className="truncate">{eventUrl}</span>
                <ExternalLink size={14} className="flex-shrink-0" />
              </a>
              <button
                onClick={onCopy}
                className="text-white/60 hover:text-white text-xs md:text-sm font-medium whitespace-nowrap"
              >
                COPY
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="border-t border-white/10 p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm text-white/60 hidden md:inline">Share Event</span>
            <div className="flex gap-3">
              <button className="text-white/40 hover:text-white transition-colors">
                <Facebook size={18} />
              </button>
              <button className="text-white/40 hover:text-white transition-colors">
                <Twitter size={18} />
              </button>
              <button className="text-white/40 hover:text-white transition-colors">
                <Linkedin size={18} />
              </button>
              <button className="text-white/40 hover:text-white transition-colors">
                <LinkIcon size={18} />
              </button>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={onEditEvent}
              className="flex-1 md:flex-none px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm font-medium transition-colors whitespace-nowrap"
            >
              Edit Event
            </button>
            <button className="flex-1 md:flex-none px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm font-medium transition-colors whitespace-nowrap">
              Change Photo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
