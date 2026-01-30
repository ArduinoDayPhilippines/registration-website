"use client";

import React from 'react';
import { StatCard } from './stat-card';
import { ActiveEvents } from './active-events';
import { AnalyticsCharts } from './analytics-charts';
import { 
  Users, 
  Calendar, 
  UserPlus, 
  Building2,
} from 'lucide-react';

// Mock data - replace with actual API calls
const mockStats = {
  totalRegistrants: 1247,
  totalEvents: 12,
  activeEvents: 5,
  upcomingEvents: 3,
  volunteers: 89,
  partneredOrgs: 15,
  recentRegistrations: 234,
  capacityUtilization: 78,
  completionRate: 92,
  waitlistCount: 47,
  peakAttendance: 203,
};



const mockEvents = [
  {
    id: '1',
    title: 'Arduino Workshop 101',
    date: '2026-02-15',
    registered: 145,
    capacity: 200,
    status: 'active',
  },
  {
    id: '2',
    title: 'IoT with Arduino',
    date: '2026-02-20',
    registered: 89,
    capacity: 150,
    status: 'active',
  },
  {
    id: '3',
    title: 'Robotics Bootcamp',
    date: '2026-03-01',
    registered: 203,
    capacity: 250,
    status: 'active',
  },
];

const mockFinishedEvents = [
  {
    id: '4',
    title: 'Arduino Basics Workshop',
    date: '2026-01-10',
    registered: 180,
    capacity: 200,
    status: 'completed',
  },
  {
    id: '5',
    title: 'Sensors & Actuators',
    date: '2026-01-15',
    registered: 120,
    capacity: 150,
    status: 'completed',
  },
  {
    id: '6',
    title: 'Circuit Design 101',
    date: '2026-01-20',
    registered: 95,
    capacity: 100,
    status: 'completed',
  },
];

interface AdminDashboardContentProps {
  activeTab: 'dashboard' | 'events' | 'stats' | 'create-event' | 'export-data';
  setActiveTab: (tab: 'dashboard' | 'events' | 'stats' | 'create-event' | 'export-data') => void;
}

export const AdminDashboardContent: React.FC<AdminDashboardContentProps> = ({ activeTab, setActiveTab }) => {

  return (
    <div className="flex min-h-screen">
      {/* Main Content */}
      <main className="flex-1 px-4 md:px-8 py-8 pt-28">
        <div className="max-w-7xl mx-auto">

      {/* Content based on active tab */}
      <div className="mb-8">
        {activeTab === 'dashboard' && (
          <>
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
          </>
        )}

        {activeTab === 'events' && (
          <ActiveEvents events={[...mockEvents, ...mockFinishedEvents]} />
        )}

        {activeTab === 'create-event' && (
          <div className="bg-gradient-to-br from-[#0B1F23]/60 via-[#0E1924]/50 to-[#0B1F23]/60 backdrop-blur-sm rounded-xl p-8 border border-[#06b6d4]/30 shadow-lg shadow-[#0891b2]/20 text-center">
            <Calendar className="w-16 h-16 text-[#06b6d4] mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Urbanist, sans-serif' }}>Create New Event</h2>
            <p className="text-gray-400 mb-6" style={{ fontFamily: 'Urbanist, sans-serif' }}>Redirecting to event creation page...</p>
          </div>
        )}

        {activeTab === 'export-data' && (
          <div className="bg-gradient-to-br from-[#092728]/60 via-[#0a2d2e]/50 to-[#092728]/60 backdrop-blur-sm rounded-xl p-8 border border-[#856730]/30 shadow-lg shadow-[#733C0B]/20 text-center">
            <Building2 className="w-16 h-16 text-[#856730] mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Urbanist, sans-serif' }}>Export All Data</h2>
            <p className="text-gray-400 mb-6" style={{ fontFamily: 'Urbanist, sans-serif' }}>Preparing data export...</p>
          </div>
        )}
      </div>
        </div>
      </main>
    </div>
  );
};
