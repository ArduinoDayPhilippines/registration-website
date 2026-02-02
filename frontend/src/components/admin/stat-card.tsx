import React from 'react';
import { TrendingUp } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string;
  trendUp?: boolean;
  color: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, trend, trendUp, color }) => (
  <div className="bg-gradient-to-br from-[#0B1F23]/60 via-[#0E1924]/50 to-[#0B1F23]/60 backdrop-blur-sm rounded-xl p-6 border border-gray-800/50 hover:border-[#22d3ee]/60 shadow-lg shadow-black/20 hover:shadow-[#22d3ee]/30 transition-all duration-300 group">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="!text-white text-sm font-medium mb-2" style={{ color: '#ffffff', fontFamily: 'Urbanist, sans-serif' }}>{title}</p>
        <p className="text-3xl font-bold !text-white mb-1" style={{ color: '#ffffff', fontFamily: 'Urbanist, sans-serif' }}>{value.toLocaleString()}</p>
        {trend && (
          <div className={`flex items-center gap-1 text-sm ${trendUp ? 'text-emerald-400' : 'text-red-400'}`} style={{ fontFamily: 'Urbanist, sans-serif' }}>
            <TrendingUp className={`w-4 h-4 ${!trendUp && 'rotate-180'}`} />
            <span>{trend}</span>
          </div>
        )}
      </div>
      <div className={`p-3 rounded-xl ${color} group-hover:scale-110 transition-transform`}>
        <Icon className="w-6 h-6 !text-white" style={{ color: '#ffffff' }} />
      </div>
    </div>
  </div>
);
