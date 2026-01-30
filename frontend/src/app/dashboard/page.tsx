"use client";

import { useState } from 'react';
import { AdminNavbar } from '@/components/admin/admin-navbar';
import { AdminDashboardContent } from '@/components/admin/admin-dashboard-content';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'events' | 'stats' | 'create-event' | 'export-data'>('dashboard');

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1F23] via-[#0E1924] to-[#0B1F23] text-white relative overflow-hidden font-[family-name:var(--font-urbanist)]">
      {/* Gradient Background Orbs - Custom Theme */}
      {/* Top left - cyan glow */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-gradient-to-br from-[#06b6d4]/35 via-[#0891b2]/25 to-transparent rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
      {/* Top right - blue and cyan blend */}
      <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-gradient-to-bl from-[#1e3a8a]/40 via-[#06b6d4]/30 to-transparent rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2" />
      {/* Bottom right - deep blue */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-[#0891b2]/40 via-[#1e40af]/35 to-transparent rounded-full blur-[110px] translate-x-1/2 translate-y-1/2" />
      
      {/* Brown/warm tone blobs */}
      <div className="absolute top-[15%] left-[25%] w-[350px] h-[350px] bg-[#38311E]/45 rounded-full blur-[80px]" />
      <div className="absolute top-[45%] right-[20%] w-[380px] h-[380px] bg-[#373531]/50 rounded-full blur-[85px]" />
      <div className="absolute bottom-[25%] left-[35%] w-[400px] h-[400px] bg-[#35351C]/45 rounded-full blur-[90px]" />
      
      {/* Center cyan-brown blend */}
      <div className="absolute top-[50%] left-[50%] w-[330px] h-[330px] bg-gradient-to-br from-[#0891b2]/25 via-[#38311E]/30 to-transparent rounded-full blur-[75px] -translate-x-1/2 -translate-y-1/2" />
      
      {/* Additional warm accents */}
      <div className="absolute top-[30%] right-[40%] w-[300px] h-[300px] bg-[#373531]/35 rounded-full blur-[70px]" />
      <div className="absolute bottom-[35%] left-[15%] w-[330px] h-[330px] bg-[#35351C]/30 rounded-full blur-[75px]" />
      
      {/* Dark accent blobs for depth */}
      <div className="absolute top-[60%] left-[10%] w-[280px] h-[280px] bg-[#0B1F23]/50 rounded-full blur-[65px]" />
      <div className="absolute bottom-[40%] right-[45%] w-[300px] h-[300px] bg-[#0E1924]/45 rounded-full blur-[70px]" />
      
      {/* Additional dark accents for depth */}
      <div className="absolute top-[20%] right-[25%] w-[330px] h-[330px] bg-[#0B1F23]/60 rounded-full blur-[75px]" />
      <div className="absolute bottom-[15%] left-[45%] w-[350px] h-[350px] bg-[#0E1924]/50 rounded-full blur-[80px]" />
      <div className="absolute top-[40%] left-[5%] w-[310px] h-[310px] bg-[#38311E]/40 rounded-full blur-[72px]" />
      <div className="absolute bottom-[50%] right-[10%] w-[290px] h-[290px] bg-[#373531]/45 rounded-full blur-[68px]" />
      <div className="absolute top-[70%] right-[35%] w-[280px] h-[280px] bg-[#35351C]/50 rounded-full blur-[65px]" />
      
      {/* Content */}
      <div className="relative z-10">
        <AdminNavbar activeTab={activeTab} onTabChange={setActiveTab} />
        <AdminDashboardContent activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
}