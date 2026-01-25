import React from 'react';
import { Users, Search, ChevronRight, UserPlus } from 'lucide-react';
import { StatusBadge } from './status-badge';

interface Registrant {
  id: string;
  name: string;
  email: string;
  event: string;
  registeredAt: string;
  status: string;
  isVolunteer: boolean;
}

interface RecentRegistrationsProps {
  registrants: Registrant[];
  searchQuery: string;
  filterStatus: string;
  onSearchChange: (value: string) => void;
  onFilterChange: (value: string) => void;
}

export const RecentRegistrations: React.FC<RecentRegistrationsProps> = ({
  registrants,
  searchQuery,
  filterStatus,
  onSearchChange,
  onFilterChange,
}) => {
  return (
    <div className="bg-gradient-to-br from-[#092728]/60 via-[#0a2d2e]/50 to-[#092728]/60 backdrop-blur-sm rounded-xl p-6 border border-[#856730]/30 shadow-lg shadow-[#733C0B]/20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2 !text-white font-sans" style={{ color: '#ffffff', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
          <Users className="w-5 h-5 text-[#856730]" />
          Recent Registrations
        </h2>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#856730]/70 to-[#733C0B]/70 hover:from-[#856730]/90 hover:to-[#733C0B]/90 rounded-xl border border-[#856730]/60 hover:border-[#856730]/80 shadow-lg hover:shadow-[#733C0B]/40 transition-all group">
          <span className="text-sm font-semibold !text-white" style={{ color: '#ffffff' }}>View All</span>
          <ChevronRight className="w-4 h-4 !text-white group-hover:translate-x-0.5 transition-transform" style={{ color: '#ffffff' }} />
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
            <Search className="w-5 h-5 text-[#856730]" />
          </div>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-[#092728]/60 border border-[#856730]/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#856730]/60 focus:ring-2 focus:ring-[#856730]/20 transition-all"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => onFilterChange(e.target.value)}
          className="px-5 py-3 bg-gradient-to-r from-[#092728]/80 to-[#0a2d2e]/80 border border-[#856730]/30 rounded-xl !text-white focus:outline-none focus:border-[#856730]/60 focus:ring-2 focus:ring-[#856730]/20 transition-all font-semibold text-sm shadow-md hover:shadow-lg hover:shadow-[#733C0B]/20 cursor-pointer [&>option]:bg-[#092728] [&>option]:!text-white [&>option]:py-2 [&>option:hover]:bg-[#856730]/30 [&>option:checked]:bg-[#856730]/50"
          style={{ color: '#ffffff' }}
        >
          <option value="all" style={{ backgroundColor: '#092728', color: '#ffffff', padding: '8px' }}>All Status</option>
          <option value="confirmed" style={{ backgroundColor: '#092728', color: '#ffffff', padding: '8px' }}>Confirmed</option>
          <option value="pending" style={{ backgroundColor: '#092728', color: '#ffffff', padding: '8px' }}>Pending</option>
          <option value="cancelled" style={{ backgroundColor: '#092728', color: '#ffffff', padding: '8px' }}>Cancelled</option>
        </select>
      </div>

      {/* Registrants Table */}
      <div className="overflow-x-auto rounded-xl border border-[#2D504B]/20">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-[#092728]/80 to-[#0a2d2e]/80 border-b border-[#856730]/20">
              <th className="text-left py-4 px-6 text-[#856730] font-semibold text-sm uppercase tracking-wide">Name</th>
              <th className="text-left py-4 px-6 text-[#856730] font-semibold text-sm uppercase tracking-wide">Email</th>
              <th className="text-left py-4 px-6 text-[#856730] font-semibold text-sm uppercase tracking-wide">Event</th>
              <th className="text-left py-4 px-6 text-[#856730] font-semibold text-sm uppercase tracking-wide">Date</th>
              <th className="text-left py-4 px-6 text-[#856730] font-semibold text-sm uppercase tracking-wide">Status</th>
              <th className="text-left py-4 px-6 text-[#856730] font-semibold text-sm uppercase tracking-wide">Type</th>
            </tr>
          </thead>
          <tbody>
            {registrants.map((registrant, index) => (
              <tr 
                key={registrant.id} 
                className={`border-b border-[#2D504B]/10 hover:bg-gradient-to-r hover:from-[#856730]/10 hover:to-transparent transition-all duration-200 group ${
                  index % 2 === 0 ? 'bg-[#092728]/20' : 'bg-transparent'
                }`}
              >
                <td className="py-4 px-6 text-sm font-semibold !text-white group-hover:text-[#856730] transition-colors" style={{ color: '#ffffff' }}>
                  {registrant.name}
                </td>
                <td className="py-4 px-6 text-sm text-gray-300">{registrant.email}</td>
                <td className="py-4 px-6 text-sm text-gray-200 font-medium">{registrant.event}</td>
                <td className="py-4 px-6 text-sm text-gray-300">
                  {new Date(registrant.registeredAt).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </td>
                <td className="py-4 px-6 text-sm">
                  <StatusBadge status={registrant.status} />
                </td>
                <td className="py-4 px-6 text-sm">
                  {registrant.isVolunteer ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-400 border border-indigo-500/30 shadow-sm">
                      <UserPlus className="w-3.5 h-3.5" />
                      Volunteer
                    </span>
                  ) : (
                    <span className="text-gray-400 text-xs font-medium">Attendee</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {registrants.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-12 h-12 text-teal-600 mx-auto mb-3" />
          <p className="text-gray-300">No registrants found</p>
        </div>
      )}
    </div>
  );
};
