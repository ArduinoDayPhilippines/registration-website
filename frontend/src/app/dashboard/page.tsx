"use client";

import React, { useRef, useEffect } from 'react';
import { AdminNavbar } from '@/components/admin/admin-navbar';
import { StatCard } from '@/components/admin/stat-card';
import { AnalyticsCharts } from '@/components/admin/analytics-charts';
import { 
  Users, 
  Calendar, 
  UserPlus, 
  Building2,
} from 'lucide-react';

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

const mockStats = {
  totalRegistrants: 1247,
  totalEvents: 12,
  activeEvents: 5,
  upcomingEvents: 3,
  volunteers: 89,
  partneredOrgs: 15,
};

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1f14] via-[#0a1520] to-[#120c08] text-white relative overflow-hidden font-[family-name:var(--font-urbanist)]">
      
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
      
      <div className="relative z-10">
        <AdminNavbar activeTab="dashboard" />
        <main className="flex-1 px-4 md:px-8 py-8 pt-28">
          <div className="max-w-7xl mx-auto">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Registrants"
                value={mockStats.totalRegistrants}
                icon={Users}
                trend="+12% from last month"
                trendUp={true}
                color="bg-blue-500/20"
              />
              <StatCard
                title="Active Events"
                value={mockStats.activeEvents}
                icon={Calendar}
                trend={`${mockStats.upcomingEvents} upcoming`}
                trendUp={true}
                color="bg-purple-500/20"
              />
              <StatCard
                title="Volunteers"
                value={mockStats.volunteers}
                icon={UserPlus}
                trend="+8% this week"
                trendUp={true}
                color="bg-green-500/20"
              />
              <StatCard
                title="Partnered Orgs"
                value={mockStats.partneredOrgs}
                icon={Building2}
                color="bg-orange-500/20"
              />
            </div>

            {/* Analytics Overview */}
            <AnalyticsCharts />
          </div>
        </main>
      </div>
    </div>
  );
}