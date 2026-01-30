import React from 'react';
import Link from 'next/link';
import { Activity, Calendar, Mail, Download } from 'lucide-react';

export const QuickActions: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-[#0B1F23]/60 via-[#0E1924]/50 to-[#0B1F23]/60 backdrop-blur-sm rounded-xl p-6 border border-[#06b6d4]/30 mb-8 shadow-lg shadow-[#0891b2]/20">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 !text-white font-sans" style={{ color: '#ffffff', fontFamily: 'Urbanist, sans-serif' }}>
        <Activity className="w-5 h-5 text-[#06b6d4]" />
        Quick Actions
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/create-event">
          <button className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-[#06b6d4]/70 to-[#0891b2]/70 hover:from-[#06b6d4]/90 hover:to-[#0891b2]/90 rounded-xl border border-[#06b6d4]/60 hover:border-[#06b6d4]/80 shadow-lg hover:shadow-[#0891b2]/50 transition-all group">
            <Calendar className="w-5 h-5 !text-white group-hover:scale-110 transition-transform" style={{ color: '#ffffff' }} />
            <span className="font-semibold !text-white text-base" style={{ color: '#ffffff', fontFamily: 'Urbanist, sans-serif' }}>Create New Event</span>
          </button>
        </Link>
        <Link href="/event-emailer">
          <button className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-[#06b6d4]/70 to-[#0891b2]/70 hover:from-[#06b6d4]/90 hover:to-[#0891b2]/90 rounded-xl border border-[#06b6d4]/60 hover:border-[#06b6d4]/80 shadow-lg hover:shadow-[#0891b2]/50 transition-all group">
            <Mail className="w-5 h-5 !text-white group-hover:scale-110 transition-transform" style={{ color: '#ffffff' }} />
            <span className="font-semibold !text-white text-base" style={{ color: '#ffffff', fontFamily: 'Urbanist, sans-serif' }}>Send Bulk Email</span>
          </button>
        </Link>
        <button className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-[#06b6d4]/70 to-[#0891b2]/70 hover:from-[#06b6d4]/90 hover:to-[#0891b2]/90 rounded-xl border border-[#06b6d4]/60 hover:border-[#06b6d4]/80 shadow-lg hover:shadow-[#0891b2]/50 transition-all group">
          <Download className="w-5 h-5 !text-white group-hover:scale-110 transition-transform" style={{ color: '#ffffff' }} />
          <span className="font-semibold !text-white text-base" style={{ color: '#ffffff', fontFamily: 'Urbanist, sans-serif' }}>Export All Data</span>
        </button>
      </div>
    </div>
  );
};
