"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { AdminNavbar } from "@/components/admin/admin-navbar";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorState } from "@/components/ui/error-state";
import { useEvent } from "@/hooks/event/use-event";
import { useGuests } from "@/hooks/guest/use-guests";
import {
  GuestStatistics,
  QuickActions,
  GuestListSection,
  EventPreviewCard,
  WhenWhereSidebar,
  InvitationsSection,
  CoverImageChangeModal,
  EventManagementForm,
} from "@/components/manage-event";
import BatchmailWorkspace from "@/components/batchmail/BatchmailWorkspace";

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

export default function ManageEventPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { event, loading, error, refetch } = useEvent(slug);
  const { guests, stats, refetch: refetchGuests } = useGuests(slug);
  const [activeTab, setActiveTab] = useState("overview");
  const [showCoverImageModal, setShowCoverImageModal] = useState(false);

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
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0a1f14] via-[#0a1520] to-[#120c08] text-white relative overflow-x-hidden font-urbanist">
      
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

      <AdminNavbar activeTab="events" />

      <main className="relative z-10 w-full max-w-6xl mx-auto px-3 md:px-6 lg:px-8 py-4 md:py-10 pb-16 mt-16">
        <div className="flex items-center justify-between gap-3 mb-4 md:mb-6">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white truncate">
              {event.title}
            </h1>
          </div>
          <button
            onClick={() => router.push(`/event/${slug}`)}
            className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-xs md:text-sm font-medium transition-colors whitespace-nowrap font-urbanist"
          >
            <span className="hidden sm:inline">Event Page</span>
            <span className="sm:hidden">View</span>
            <ArrowUpRight size={14} className="md:w-4 md:h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 md:gap-6 border-b border-white/10 mb-6 md:mb-8 overflow-x-auto -mx-3 md:mx-0 px-3 md:px-0">
          {["Overview", "Guests", "Registration", "Batchmail"].map((tab) => (
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
              totalRegistered={stats?.totalRegistered || 0}
              going={stats?.going || 0}
              checkedIn={stats?.checkedIn || 0}
              waitlist={stats?.waitlist || 0}
            />
            <QuickActions />
            <GuestListSection
              guests={guests}
              slug={slug}
              onRefresh={refetchGuests}
            />
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
                onChangePhoto={() => setShowCoverImageModal(true)}
              />
              <WhenWhereSidebar event={event} />
            </div>
            <InvitationsSection />
          </>
        )}

        {/* Registration Tab Content */}
        {activeTab === "registration" && (
          <EventManagementForm
            event={event}
            slug={slug}
            onCancel={() => setActiveTab("overview")}
            onSuccess={() => {
              // Stay on the Registration tab; just refresh data after save
              refetch();
            }}
          />
        )}

        {/* Batchmail Tab Content */}
        <div className={activeTab === "batchmail" ? "" : "hidden"}>
          <BatchmailWorkspace />
        </div>
      </main>

      {/* Cover Image Change Modal */}
      <CoverImageChangeModal
        isOpen={showCoverImageModal}
        onClose={() => setShowCoverImageModal(false)}
        currentImage={event.coverImage}
        slug={slug}
      />
    </div>
  );
}