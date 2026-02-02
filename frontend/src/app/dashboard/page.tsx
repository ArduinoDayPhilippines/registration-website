"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { AdminNavbar } from '@/components/admin/admin-navbar';
import { AdminDashboardContent } from '@/components/admin/admin-dashboard-content';
import BokehBackground from '@/components/create-event/bokeh-background';
import Squares from '@/components/create-event/squares-background';

export default function AdminDashboard() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'events' | 'stats' | 'create-event' | 'export-data'>('dashboard');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'events' || tab === 'dashboard' || tab === 'stats' || tab === 'create-event' || tab === 'export-data') {
      setActiveTab(tab);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1f14] via-[#0a1520] to-[#120c08] text-white relative overflow-hidden font-[family-name:var(--font-urbanist)]">
      {/* Bokeh Background Effect */}
      <BokehBackground />
      
      {/* Grid Background */}
      <Squares direction="diagonal" speed={0.3} />
      
      {/* Content */}
      <div className="relative z-10">
        <AdminNavbar activeTab={activeTab} onTabChange={setActiveTab} />
        <AdminDashboardContent activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
}