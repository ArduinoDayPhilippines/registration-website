import { LogOut, Calendar, CheckCircle, BarChart3, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface AdminNavbarProps {
  activeTab: string;
  onTabChange: (tab: 'dashboard' | 'events' | 'stats' | 'create-event' | 'export-data') => void;
}

export function AdminNavbar({ activeTab, onTabChange }: AdminNavbarProps) {
  const router = useRouter();

  const menuItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: BarChart3 },
    { id: 'events' as const, label: 'Events', icon: Calendar },
  ];

  return (
    <nav 
      className="h-20 px-4 md:px-8 lg:px-12 flex items-center justify-between z-40 fixed top-0 left-0 right-0 backdrop-blur-md bg-gradient-to-r from-[#0B1F23]/95 via-[#0E1924]/95 to-[#0B1F23]/95 border-b border-[#06b6d4]/20 shadow-lg shadow-black/30"
    >
      {/* Left Side - Logo and Navigation */}
      <div className="flex items-center gap-8">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#38311E]/40 to-[#06b6d4]/30 p-2 border border-[#06b6d4]/40 flex-shrink-0">
            <Image 
              src="/images/logos/adph-logo.png" 
              alt="Arduino Day Philippines Logo" 
              fill
              className="object-contain p-1"
            />
          </div>
          <div className="hidden md:flex flex-col">
            <h2 className="text-sm font-bold text-gray-50 whitespace-nowrap" style={{ fontFamily: 'Urbanist, sans-serif' }}>
              Arduino Day Philippines
            </h2>
            <p className="text-xs text-gray-400 whitespace-nowrap" style={{ fontFamily: 'Urbanist, sans-serif' }}>Admin Panel</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="hidden lg:flex items-center gap-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-[#06b6d4]/70 to-[#0891b2]/70 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-[#38311E]/30'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#06b6d4]'}`} />
                <span className="text-sm font-medium whitespace-nowrap" style={{ fontFamily: 'Urbanist, sans-serif' }}>
                  {item.label}
                </span>
              </button>
            );
          })}
          
          {/* Create New Event Tab */}
          <button
            onClick={() => router.push('/create-event')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-gray-400 hover:text-white hover:bg-[#38311E]/30"
          >
            <Plus className="w-4 h-4 text-[#06b6d4]" />
            <span className="text-sm font-medium whitespace-nowrap" style={{ fontFamily: 'Urbanist, sans-serif' }}>Create Event</span>
          </button>
        </div>
      </div>

      {/* Right Side - Logout */}
      <div className="flex items-center gap-3">
        {/* Logout Button */}
        <button className="flex items-center gap-2 px-3 md:px-4 py-2 bg-gradient-to-r from-[#06b6d4]/40 to-[#0891b2]/50 hover:from-[#06b6d4]/60 hover:to-[#0891b2]/70 rounded-lg border border-[#06b6d4]/70 hover:border-[#06b6d4]/90 transition-all group shadow-lg shadow-[#0891b2]/20">
          <LogOut className="w-4 h-4 !text-white drop-shadow-md" style={{ color: '#bd0000' }} />
          <span className="text-sm font-medium !text-white hidden md:inline drop-shadow-md" style={{ color: '#bd0000', fontFamily: 'Urbanist, sans-serif' }}>Logout</span>
        </button>
      </div>
    </nav>
  );
}
