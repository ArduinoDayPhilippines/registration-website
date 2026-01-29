"use client";

import React, { useState } from 'react';
import { StatCard } from './stat-card';
import { QuickActions } from './quick-actions';
import { RecentRegistrations } from './recent-registrations';
import { ActiveEvents } from './active-events';
import { FinishedEvents } from './finished-events';
import { QuickStats } from './quick-stats';
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
};

const mockRecentRegistrants = [
  {
    id: '1',
    name: 'Juan Dela Cruz',
    email: 'juan.delacruz@email.com',
    event: 'Arduino Workshop 101',
    registeredAt: '2026-01-25T10:30:00',
    status: 'confirmed',
    isVolunteer: false,
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria.santos@email.com',
    event: 'IoT with Arduino',
    registeredAt: '2026-01-25T09:15:00',
    status: 'pending',
    isVolunteer: true,
  },
  {
    id: '3',
    name: 'Pedro Gonzales',
    email: 'pedro.g@email.com',
    event: 'Arduino Workshop 101',
    registeredAt: '2026-01-24T16:45:00',
    status: 'confirmed',
    isVolunteer: false,
  },
  {
    id: '4',
    name: 'Ana Reyes',
    email: 'ana.reyes@email.com',
    event: 'Robotics Bootcamp',
    registeredAt: '2026-01-24T14:20:00',
    status: 'confirmed',
    isVolunteer: true,
  },
  {
    id: '5',
    name: 'Carlos Mendoza',
    email: 'carlos.m@email.com',
    event: 'Advanced Arduino Programming',
    registeredAt: '2026-01-24T11:00:00',
    status: 'pending',
    isVolunteer: false,
  },
];

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

export const AdminDashboardContent: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'registrations' | 'events' | 'finished' | 'stats'>('registrations');

  const filteredRegistrants = mockRecentRegistrants.filter(registrant => {
    const matchesSearch = registrant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         registrant.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || registrant.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 mt-20">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-2 !text-gray-50 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]" style={{ color: '#f9fafb' }}>
          Admin Dashboard
        </h1>
      </div>

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

      {/* Quick Actions */}
      <QuickActions />

      {/* Tabbed Section */}
      <div className="mb-8">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 border-b border-[#2D504B]/30">
          <button
            onClick={() => setActiveTab('registrations')}
            className={`px-6 py-3 font-semibold transition-all relative ${
              activeTab === 'registrations'
                ? '!text-white'
                : 'text-gray-400 hover:text-gray-300'
            }`}
            style={activeTab === 'registrations' ? { color: '#ffffff' } : {}}
          >
            Recent Registrations
            {activeTab === 'registrations' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#856730] to-[#733C0B]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`px-6 py-3 font-semibold transition-all relative ${
              activeTab === 'events'
                ? '!text-white'
                : 'text-gray-400 hover:text-gray-300'
            }`}
            style={activeTab === 'events' ? { color: '#ffffff' } : {}}
          >
            Active Events
            {activeTab === 'events' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#856730] to-[#733C0B]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('finished')}
            className={`px-6 py-3 font-semibold transition-all relative ${
              activeTab === 'finished'
                ? '!text-white'
                : 'text-gray-400 hover:text-gray-300'
            }`}
            style={activeTab === 'finished' ? { color: '#ffffff' } : {}}
          >
            Finished Events
            {activeTab === 'finished' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#856730] to-[#733C0B]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-6 py-3 font-semibold transition-all relative ${
              activeTab === 'stats'
                ? '!text-white'
                : 'text-gray-400 hover:text-gray-300'
            }`}
            style={activeTab === 'stats' ? { color: '#ffffff' } : {}}
          >
            Quick Stats
            {activeTab === 'stats' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#856730] to-[#733C0B]" />
            )}
          </button>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'registrations' && (
            <RecentRegistrations
              registrants={filteredRegistrants}
              searchQuery={searchQuery}
              filterStatus={filterStatus}
              onSearchChange={setSearchQuery}
              onFilterChange={setFilterStatus}
            />
          )}

          {activeTab === 'events' && (
            <ActiveEvents events={mockEvents} />
          )}

          {activeTab === 'finished' && (
            <FinishedEvents events={mockFinishedEvents} />
          )}

          {activeTab === 'stats' && (
            <QuickStats stats={{
              recentRegistrations: mockStats.recentRegistrations,
              capacityUtilization: mockStats.capacityUtilization,
              totalEvents: mockStats.totalEvents,
            }} />
          )}
        </div>
      </div>
    </main>
  );
};
