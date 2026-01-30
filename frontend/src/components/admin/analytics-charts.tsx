"use client";

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Users, Calendar, CheckCircle } from 'lucide-react';

// Mock data for charts
const registrationTrendData = [
  { month: 'Jan', date: 'Jan 2026', registrations: 180, volunteers: 45 },
  { month: 'Feb', date: 'Feb 2026', registrations: 220, volunteers: 52 },
  { month: 'Mar', date: 'Mar 2026', registrations: 195, volunteers: 48 },
  { month: 'Apr', date: 'Apr 2026', registrations: 280, volunteers: 68 },
  { month: 'May', date: 'May 2026', registrations: 310, volunteers: 75 },
  { month: 'Jun', date: 'Jun 2026', registrations: 340, volunteers: 82 },
];

const capacityTrendData = [
  { month: 'Jan', date: 'Jan 2026', utilized: 72, available: 28 },
  { month: 'Feb', date: 'Feb 2026', utilized: 68, available: 32 },
  { month: 'Mar', date: 'Mar 2026', utilized: 75, available: 25 },
  { month: 'Apr', date: 'Apr 2026', utilized: 82, available: 18 },
  { month: 'May', date: 'May 2026', utilized: 78, available: 22 },
  { month: 'Jun', date: 'Jun 2026', utilized: 85, available: 15 },
];

const eventTimelineData = [
  { month: 'Jan', date: 'Jan 2026', active: 4, finished: 2, upcoming: 3 },
  { month: 'Feb', date: 'Feb 2026', active: 5, finished: 3, upcoming: 4 },
  { month: 'Mar', date: 'Mar 2026', active: 3, finished: 4, upcoming: 5 },
  { month: 'Apr', date: 'Apr 2026', active: 6, finished: 2, upcoming: 3 },
  { month: 'May', date: 'May 2026', active: 5, finished: 5, upcoming: 6 },
  { month: 'Jun', date: 'Jun 2026', active: 7, finished: 3, upcoming: 4 },
];

const attendanceData = [
  { month: 'Jan', date: 'Jan 2026', attended: 165, registered: 180 },
  { month: 'Feb', date: 'Feb 2026', attended: 205, registered: 220 },
  { month: 'Mar', date: 'Mar 2026', attended: 180, registered: 195 },
  { month: 'Apr', date: 'Apr 2026', attended: 260, registered: 280 },
  { month: 'May', date: 'May 2026', attended: 290, registered: 310 },
  { month: 'Jun', date: 'Jun 2026', attended: 320, registered: 340 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload;
    return (
      <div className="bg-[#0B1F23]/95 border border-[#06b6d4]/40 rounded-lg p-3 shadow-xl backdrop-blur-sm">
        <p className="text-white font-semibold mb-2 text-xs" style={{ fontFamily: 'Urbanist, sans-serif' }}>{dataPoint.date || label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm flex items-center justify-between gap-3" style={{ color: entry.color, fontFamily: 'Urbanist, sans-serif' }}>
            <span>{entry.name}:</span>
            <span className="font-bold">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const AnalyticsCharts: React.FC = () => {
  const currentDate = new Date();
  const startDate = new Date(currentDate);
  startDate.setMonth(currentDate.getMonth() - 5);
  
  const formatDateRange = () => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${months[startDate.getMonth()]} - ${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold !text-white" style={{ color: '#ffffff', fontFamily: 'Urbanist, sans-serif' }}>
          Analytics Overview
        </h2>
        <div className="text-sm text-gray-400 bg-[#0B1F23]/40 px-4 py-2 rounded-lg border border-[#06b6d4]/30" style={{ fontFamily: 'Urbanist, sans-serif' }}>
          <span className="text-[#06b6d4] font-semibold">Timeline:</span> {formatDateRange()}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Registration Trends */}
        <div className="bg-gradient-to-br from-[#0B1F23]/60 via-[#0E1924]/50 to-[#0B1F23]/60 backdrop-blur-sm rounded-xl p-6 border border-[#06b6d4]/30 shadow-lg shadow-[#0891b2]/20">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-[#60a5fa]" />
            <h3 className="text-lg font-semibold !text-white" style={{ color: '#ffffff', fontFamily: 'Urbanist, sans-serif' }}>
              Registration Trends
            </h3>
          </div>
          <p className="text-sm text-gray-400 mb-4" style={{ fontFamily: 'Urbanist, sans-serif' }}>
            Showing total visitors for the last 6 months • Jan 2026 - Jun 2026
          </p>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={registrationTrendData}>
              <defs>
                <linearGradient id="colorRegistrations" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorVolunteers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34d399" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#06b6d4" opacity={0.1} />
              <XAxis dataKey="month" stroke="#9ca3af" style={{ fontFamily: 'Urbanist, sans-serif', fontSize: '12px' }} />
              <YAxis stroke="#9ca3af" style={{ fontFamily: 'Urbanist, sans-serif', fontSize: '12px' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontFamily: 'Urbanist, sans-serif', color: '#ffffff' }} />
              <Area type="monotone" dataKey="registrations" stroke="#60a5fa" fillOpacity={1} fill="url(#colorRegistrations)" strokeWidth={2} />
              <Area type="monotone" dataKey="volunteers" stroke="#34d399" fillOpacity={1} fill="url(#colorVolunteers)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#06b6d4]/20">
            <span className="text-sm text-gray-400" style={{ fontFamily: 'Urbanist, sans-serif' }}>January - June 2026</span>
            <span className="text-sm font-semibold text-[#34d399] flex items-center gap-1" style={{ fontFamily: 'Urbanist, sans-serif' }}>
              <TrendingUp className="w-4 h-4" />
              Trending up by 5.2% this month
            </span>
          </div>
        </div>

        {/* Capacity Utilization */}
        <div className="bg-gradient-to-br from-[#0B1F23]/60 via-[#0E1924]/50 to-[#0B1F23]/60 backdrop-blur-sm rounded-xl p-6 border border-[#06b6d4]/30 shadow-lg shadow-[#0891b2]/20">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-[#c084fc]" />
            <h3 className="text-lg font-semibold !text-white" style={{ color: '#ffffff', fontFamily: 'Urbanist, sans-serif' }}>
              Capacity Utilization
            </h3>
          </div>
          <p className="text-sm text-gray-400 mb-4" style={{ fontFamily: 'Urbanist, sans-serif' }}>
            Event capacity trends over time • Jan 2026 - Jun 2026
          </p>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={capacityTrendData}>
              <defs>
                <linearGradient id="colorUtilized" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c084fc" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#c084fc" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorAvailable" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#06b6d4" opacity={0.1} />
              <XAxis dataKey="month" stroke="#9ca3af" style={{ fontFamily: 'Urbanist, sans-serif', fontSize: '12px' }} />
              <YAxis stroke="#9ca3af" style={{ fontFamily: 'Urbanist, sans-serif', fontSize: '12px' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontFamily: 'Urbanist, sans-serif', color: '#ffffff' }} />
              <Area type="monotone" dataKey="utilized" stroke="#c084fc" fillOpacity={1} fill="url(#colorUtilized)" strokeWidth={2} stackId="1" />
              <Area type="monotone" dataKey="available" stroke="#94a3b8" fillOpacity={1} fill="url(#colorAvailable)" strokeWidth={2} stackId="1" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#06b6d4]/20">
            <span className="text-sm text-gray-400" style={{ fontFamily: 'Urbanist, sans-serif' }}>January - June 2026</span>
            <span className="text-sm font-semibold text-[#c084fc]" style={{ fontFamily: 'Urbanist, sans-serif' }}>
              Avg: 78% capacity
            </span>
          </div>
        </div>

        {/* Event Timeline */}
        <div className="bg-gradient-to-br from-[#0B1F23]/60 via-[#0E1924]/50 to-[#0B1F23]/60 backdrop-blur-sm rounded-xl p-6 border border-[#06b6d4]/30 shadow-lg shadow-[#0891b2]/20">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-[#34d399]" />
            <h3 className="text-lg font-semibold !text-white" style={{ color: '#ffffff', fontFamily: 'Urbanist, sans-serif' }}>
              Event Timeline
            </h3>
          </div>
          <p className="text-sm text-gray-400 mb-4" style={{ fontFamily: 'Urbanist, sans-serif' }}>
            Active, finished, and upcoming events • Jan 2026 - Jun 2026
          </p>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={eventTimelineData}>
              <defs>
                <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34d399" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorFinished" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorUpcoming" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#06b6d4" opacity={0.1} />
              <XAxis dataKey="month" stroke="#9ca3af" style={{ fontFamily: 'Urbanist, sans-serif', fontSize: '12px' }} />
              <YAxis stroke="#9ca3af" style={{ fontFamily: 'Urbanist, sans-serif', fontSize: '12px' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontFamily: 'Urbanist, sans-serif', color: '#ffffff' }} />
              <Area type="monotone" dataKey="active" stroke="#34d399" fillOpacity={1} fill="url(#colorActive)" strokeWidth={2} />
              <Area type="monotone" dataKey="finished" stroke="#60a5fa" fillOpacity={1} fill="url(#colorFinished)" strokeWidth={2} />
              <Area type="monotone" dataKey="upcoming" stroke="#f59e0b" fillOpacity={1} fill="url(#colorUpcoming)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#06b6d4]/20">
            <span className="text-sm text-gray-400" style={{ fontFamily: 'Urbanist, sans-serif' }}>January - June 2026</span>
            <span className="text-sm font-semibold text-[#34d399]" style={{ fontFamily: 'Urbanist, sans-serif' }}>
              12 total events
            </span>
          </div>
        </div>

        {/* Attendance Rate */}
        <div className="bg-gradient-to-br from-[#0B1F23]/60 via-[#0E1924]/50 to-[#0B1F23]/60 backdrop-blur-sm rounded-xl p-6 border border-[#06b6d4]/30 shadow-lg shadow-[#0891b2]/20">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-[#22c55e]" />
            <h3 className="text-lg font-semibold !text-white" style={{ color: '#ffffff', fontFamily: 'Urbanist, sans-serif' }}>
              Attendance vs Registration
            </h3>
          </div>
          <p className="text-sm text-gray-400 mb-4" style={{ fontFamily: 'Urbanist, sans-serif' }}>
            Comparing registrations to actual attendance • Jan 2026 - Jun 2026
          </p>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={attendanceData}>
              <defs>
                <linearGradient id="colorAttended" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorRegistered" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#06b6d4" opacity={0.1} />
              <XAxis dataKey="month" stroke="#9ca3af" style={{ fontFamily: 'Urbanist, sans-serif', fontSize: '12px' }} />
              <YAxis stroke="#9ca3af" style={{ fontFamily: 'Urbanist, sans-serif', fontSize: '12px' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontFamily: 'Urbanist, sans-serif', color: '#ffffff' }} />
              <Area type="monotone" dataKey="registered" stroke="#f97316" fillOpacity={1} fill="url(#colorRegistered)" strokeWidth={2} />
              <Area type="monotone" dataKey="attended" stroke="#22c55e" fillOpacity={1} fill="url(#colorAttended)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#06b6d4]/20">
            <span className="text-sm text-gray-400" style={{ fontFamily: 'Urbanist, sans-serif' }}>January - June 2026</span>
            <span className="text-sm font-semibold text-[#22c55e]" style={{ fontFamily: 'Urbanist, sans-serif' }}>
              92% attendance rate
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
