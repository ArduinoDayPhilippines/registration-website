import React from 'react';
import Link from 'next/link';
import { Activity, Calendar, Mail, Download } from 'lucide-react';

export const QuickActions: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-[#092728]/60 via-[#0a2d2e]/50 to-[#092728]/60 backdrop-blur-sm rounded-xl p-6 border border-[#856730]/30 mb-8 shadow-lg shadow-[#733C0B]/20">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 !text-white font-sans" style={{ color: '#ffffff', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
        <Activity className="w-5 h-5 text-[#856730]" />
        Quick Actions
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/create-event">
          <button className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-[#856730]/70 to-[#733C0B]/70 hover:from-[#856730]/90 hover:to-[#733C0B]/90 rounded-xl border border-[#856730]/60 hover:border-[#856730]/80 shadow-lg hover:shadow-[#733C0B]/50 transition-all group">
            <Calendar className="w-5 h-5 !text-white group-hover:scale-110 transition-transform" style={{ color: '#ffffff' }} />
            <span className="font-semibold !text-white text-base" style={{ color: '#ffffff' }}>Create New Event</span>
          </button>
        </Link>
        <Link href="/event-emailer">
          <button className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-[#856730]/70 to-[#733C0B]/70 hover:from-[#856730]/90 hover:to-[#733C0B]/90 rounded-xl border border-[#856730]/60 hover:border-[#856730]/80 shadow-lg hover:shadow-[#733C0B]/50 transition-all group">
            <Mail className="w-5 h-5 !text-white group-hover:scale-110 transition-transform" style={{ color: '#ffffff' }} />
            <span className="font-semibold !text-white text-base" style={{ color: '#ffffff' }}>Send Bulk Email</span>
          </button>
        </Link>
        <button className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-[#856730]/70 to-[#733C0B]/70 hover:from-[#856730]/90 hover:to-[#733C0B]/90 rounded-xl border border-[#856730]/60 hover:border-[#856730]/80 shadow-lg hover:shadow-[#733C0B]/50 transition-all group">
          <Download className="w-5 h-5 !text-white group-hover:scale-110 transition-transform" style={{ color: '#ffffff' }} />
          <span className="font-semibold !text-white text-base" style={{ color: '#ffffff' }}>Export All Data</span>
        </button>
      </div>
    </div>
  );
};
