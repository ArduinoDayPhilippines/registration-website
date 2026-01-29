import React from 'react';
import { BarChart3, TrendingUp, PieChart, FileText } from 'lucide-react';

interface QuickStatsProps {
  stats: {
    recentRegistrations: number;
    capacityUtilization: number;
    totalEvents: number;
  };
}

export const QuickStats: React.FC<QuickStatsProps> = ({ stats }) => {
  return (
    <div className="bg-gradient-to-br from-[#092728]/60 via-[#0a2d2e]/50 to-[#092728]/60 backdrop-blur-sm rounded-xl p-6 border border-[#856730]/30 shadow-lg shadow-[#733C0B]/20">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 !text-white font-sans" style={{ color: '#ffffff', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
        <BarChart3 className="w-5 h-5 text-[#856730]" />
        Quick Stats
      </h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-[#092728]/40 rounded-lg border border-[#2D504B]/20 hover:border-[#856730]/40 transition-all">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-lg">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <p className="text-sm font-medium !text-white" style={{ color: '#ffffff' }}>Recent Sign-ups</p>
              <p className="text-xs !text-white" style={{ color: '#ffffff' }}>Last 24 hours</p>
            </div>
          </div>
          <span className="text-xl font-bold !text-white" style={{ color: '#ffffff' }}>{stats.recentRegistrations}</span>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-[#092728]/40 rounded-lg border border-[#2D504B]/20 hover:border-[#856730]/40 transition-all">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-lg">
              <PieChart className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium !text-white" style={{ color: '#ffffff' }}>Avg. Capacity</p>
              <p className="text-xs !text-white" style={{ color: '#ffffff' }}>All events</p>
            </div>
          </div>
          <span className="text-xl font-bold !text-white" style={{ color: '#ffffff' }}>{stats.capacityUtilization}%</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-[#092728]/40 rounded-lg border border-[#2D504B]/20 hover:border-[#856730]/40 transition-all">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-emerald-500/30 to-teal-500/30 rounded-lg">
              <FileText className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-medium !text-white" style={{ color: '#ffffff' }}>Total Events</p>
              <p className="text-xs !text-white" style={{ color: '#ffffff' }}>All time</p>
            </div>
          </div>
          <span className="text-xl font-bold !text-white" style={{ color: '#ffffff' }}>{stats.totalEvents}</span>
        </div>
      </div>
    </div>
  );
};
