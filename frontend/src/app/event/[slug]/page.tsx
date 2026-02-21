"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorState } from "@/components/ui/error-state";
import { EventCoverImage } from "@/components/event/event-cover-image";
import { EventDateTime } from "@/components/event/event-date-time";
import { EventLocation } from "@/components/event/event-location";
import { EventManageCard } from "@/components/event/event-manage-card";
import { EventRegistrationCard } from "@/components/event/event-registration-card";
import { EventAbout } from "@/components/event/event-about";
import { EventHost } from "@/components/event/event-host";
import { createClient } from "@/lib/supabase/client";
import { useEvent } from "@/hooks/event/use-event";

type CanvasStrokeStyle = string | CanvasGradient | CanvasPattern;

interface GridOffset {
  x: number;
  y: number;
}

interface SquaresProps {
  direction?: 'diagonal' | 'up' | 'right' | 'down' | 'left';
  speed?: number;
  borderColor?: CanvasStrokeStyle;
  squareSize?: number;
  hoverFillColor?: CanvasStrokeStyle;
}

const Squares: React.FC<SquaresProps> = ({
  direction = 'right',
  speed = 0.5,
  borderColor = 'rgba(0, 206, 209, 0.03)',
  squareSize = 40,
  hoverFillColor = 'rgba(0, 206, 209, 0.02)'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | null>(null);
  const numSquaresX = useRef<number>(0);
  const numSquaresY = useRef<number>(0);
  const gridOffset = useRef<GridOffset>({ x: 0, y: 0 });
  const hoveredSquareRef = useRef<GridOffset | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      numSquaresX.current = Math.ceil(canvas.width / squareSize) + 1;
      numSquaresY.current = Math.ceil(canvas.height / squareSize) + 1;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const drawGrid = () => {
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const startX = Math.floor(gridOffset.current.x / squareSize) * squareSize;
      const startY = Math.floor(gridOffset.current.y / squareSize) * squareSize;

      for (let x = startX; x < canvas.width + squareSize; x += squareSize) {
        for (let y = startY; y < canvas.height + squareSize; y += squareSize) {
          const squareX = x - (gridOffset.current.x % squareSize);
          const squareY = y - (gridOffset.current.y % squareSize);

          if (
            hoveredSquareRef.current &&
            Math.floor((x - startX) / squareSize) === hoveredSquareRef.current.x &&
            Math.floor((y - startY) / squareSize) === hoveredSquareRef.current.y
          ) {
            ctx.fillStyle = hoverFillColor;
            ctx.fillRect(squareX, squareY, squareSize, squareSize);
          }

          ctx.strokeStyle = borderColor;
          ctx.strokeRect(squareX, squareY, squareSize, squareSize);
        }
      }

      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        Math.sqrt(canvas.width ** 2 + canvas.height ** 2) / 2
      );
      gradient.addColorStop(0, 'rgba(13, 27, 42, 0)');
      gradient.addColorStop(0.6, 'rgba(13, 27, 42, 0.3)');
      gradient.addColorStop(1, 'rgba(13, 27, 42, 0.7)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const updateAnimation = () => {
      const effectiveSpeed = Math.max(speed, 0.1);
      switch (direction) {
        case 'right':
          gridOffset.current.x = (gridOffset.current.x - effectiveSpeed + squareSize) % squareSize;
          break;
        case 'left':
          gridOffset.current.x = (gridOffset.current.x + effectiveSpeed + squareSize) % squareSize;
          break;
        case 'up':
          gridOffset.current.y = (gridOffset.current.y + effectiveSpeed + squareSize) % squareSize;
          break;
        case 'down':
          gridOffset.current.y = (gridOffset.current.y - effectiveSpeed + squareSize) % squareSize;
          break;
        case 'diagonal':
          gridOffset.current.x = (gridOffset.current.x - effectiveSpeed + squareSize) % squareSize;
          gridOffset.current.y = (gridOffset.current.y - effectiveSpeed + squareSize) % squareSize;
          break;
        default:
          break;
      }

      drawGrid();
      requestRef.current = requestAnimationFrame(updateAnimation);
    };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      const startX = Math.floor(gridOffset.current.x / squareSize) * squareSize;
      const startY = Math.floor(gridOffset.current.y / squareSize) * squareSize;

      const hoveredSquareX = Math.floor((mouseX + gridOffset.current.x - startX) / squareSize);
      const hoveredSquareY = Math.floor((mouseY + gridOffset.current.y - startY) / squareSize);

      if (
        !hoveredSquareRef.current ||
        hoveredSquareRef.current.x !== hoveredSquareX ||
        hoveredSquareRef.current.y !== hoveredSquareY
      ) {
        hoveredSquareRef.current = { x: hoveredSquareX, y: hoveredSquareY };
      }
    };

    const handleMouseLeave = () => {
      hoveredSquareRef.current = null;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    requestRef.current = requestAnimationFrame(updateAnimation);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [direction, speed, borderColor, hoverFillColor, squareSize]);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 0.08 }}
    />
  );
};

export default function EventPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { event, loading, error } = useEvent(slug);
  const [hostName, setHostName] = useState<string | undefined>(undefined);

  useEffect(() => {
    async function loadHostName() {
      if (!event?.organizerId) {
        setHostName(undefined);
        return;
      }

      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user && user.id === event.organizerId) {
          setHostName(user.email ?? "You");
        } else {
          setHostName("Event Organizer");
        }
      } catch (e) {
        console.error("Failed to load organizer info:", e);
        setHostName("Event Organizer");
      }
    }

    loadHostName();
  }, [event?.organizerId]);

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
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0a1f14] via-[#0a1520] to-[#120c08] text-white relative overflow-x-hidden font-montserrat">
      
      <div className="bokeh-container">
        <div className="bokeh-circle bokeh-circle-1" />
        <div className="bokeh-circle bokeh-circle-2" />
        <div className="bokeh-circle bokeh-circle-3" />
        <div className="bokeh-circle bokeh-circle-4" />
        <div className="bokeh-circle bokeh-circle-5" />
        
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 0%, rgba(13, 27, 42, 0.4) 100%)',
          }}
        />
      </div>

      <Squares direction="diagonal" speed={0.3} />

      <main className="relative z-10 w-full max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-10 pb-16">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] xl:grid-cols-[440px_1fr] gap-8 lg:gap-10 xl:gap-12">
          {/* Left Column - Cover Image (Desktop: + About + Hosted By) */}
          <div className="animate-fade-in space-y-6">
            <EventCoverImage src={event.coverImage || ""} alt={event.title} />

            {/* Manage Event Card */}
            <EventManageCard eventSlug={slug} />

            {/* About - Desktop Only */}
            <EventAbout
              description={event.description}
              className="hidden lg:block"
            />

            {/* Hosted By - Desktop Only */}
            <EventHost
              hostName={hostName}
              className="hidden lg:block border-t border-white/10 pt-6"
            />
          </div>

          {/* Right Column - Event Info */}
          <div className="animate-fade-in animate-delay-200">
            {/* Event Title */}
            <h1 className="font-urbanist text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight text-white">
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
              onRsvpClick={() => router.push(`/event/${slug}/register`)}
            />

            {/* Hosted By - Mobile Only (at the end) */}
            <EventHost
              hostName={hostName}
              className="lg:hidden border-t border-white/10 pt-6 mt-8"
            />
          </div>
        </div>
      </main>
    </div>
  );
}