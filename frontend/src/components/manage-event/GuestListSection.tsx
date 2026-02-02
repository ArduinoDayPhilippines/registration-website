import React from 'react';
import { Users, Download, Table } from 'lucide-react';

export function GuestListSection() {
  return (
    <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-white/10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <h2 className="font-urbanist text-lg md:text-xl font-bold text-white">
            Guest List
          </h2>
          <div className="flex gap-2">
            <button className="font-urbanist px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-white text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap">
              <Download size={16} />
              Export
            </button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search guests by name or email..."
              className="font-urbanist w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-white/40 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
          <div className="flex gap-2">
            <select className="font-urbanist px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors">
              <option>All Status</option>
              <option>Going</option>
              <option>Not Going</option>
              <option>Waitlist</option>
            </select>
            <button className="p-2.5 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors">
              <Table size={18} className="text-white/60" />
            </button>
          </div>
        </div>
      </div>

      {/* Guest List Content */}
      <div className="p-4 md:p-6">
        {/* Empty State */}
        <div className="flex flex-col items-center justify-center py-8 md:py-12 text-center">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
            <Users size={24} className="text-white/40 md:w-8 md:h-8" />
          </div>
          <h3 className="font-urbanist text-sm md:text-base font-medium text-white mb-2">
            No Guests Yet
          </h3>
          <p className="font-urbanist text-white/60 text-xs md:text-sm max-w-md mb-4 px-4">
            Share the event or invite people to get started!
          </p>
          <button className="font-urbanist px-4 md:px-5 py-2 md:py-2.5 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-white text-xs md:text-sm font-medium transition-colors">
            Invite Your First Guest
          </button>
        </div>
      </div>
    </div>
  );
}
