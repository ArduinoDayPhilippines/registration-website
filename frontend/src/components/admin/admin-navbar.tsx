import { LogOut, Calendar, BarChart3, Plus, Menu, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState } from 'react';

interface AdminNavbarProps {
  activeTab: string;
  onTabChange: (tab: 'dashboard' | 'events' | 'stats' | 'create-event' | 'export-data') => void;
}

export function AdminNavbar({ activeTab, onTabChange }: AdminNavbarProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: BarChart3 },
    { id: 'events' as const, label: 'Events', icon: Calendar },
  ];

  const handleTabChange = (tab: 'dashboard' | 'events' | 'stats' | 'create-event' | 'export-data') => {
    onTabChange(tab);
    setMobileMenuOpen(false);
  };

  const handleCreateEvent = () => {
    router.push('/create-event');
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav 
        className="h-20 px-4 md:px-8 lg:px-12 flex items-center justify-between z-40 fixed top-0 left-0 right-0 backdrop-blur-md bg-gradient-to-r from-[#0B1F23]/95 via-[#0E1924]/95 to-[#0B1F23]/95 border-b border-[#06b6d4]/20 shadow-lg shadow-black/30"
      >
        {/* Left Side - Burger Menu (Mobile) & Logo and Navigation */}
        <div className="flex items-center gap-4 md:gap-8">
          {/* Burger Menu Button (Mobile) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#38311E]/30 transition-all"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

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

          {/* Navigation Menu (Desktop) */}
          <div className="hidden lg:flex items-center gap-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
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
              onClick={handleCreateEvent}
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

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Mobile Menu Panel */}
          <div className="fixed top-20 left-0 right-0 z-40 lg:hidden bg-gradient-to-br from-[#0B1F23]/98 via-[#0E1924]/98 to-[#0B1F23]/98 backdrop-blur-xl border-b border-[#06b6d4]/20 shadow-2xl">
            <div className="px-4 py-6 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-[#06b6d4]/70 to-[#0891b2]/70 text-white shadow-lg'
                        : 'text-gray-400 hover:text-white hover:bg-[#38311E]/30'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-[#06b6d4]'}`} />
                    <span className="text-base font-medium" style={{ fontFamily: 'Urbanist, sans-serif' }}>
                      {item.label}
                    </span>
                  </button>
                );
              })}
              
              {/* Create New Event in Mobile Menu */}
              <button
                onClick={handleCreateEvent}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-gray-400 hover:text-white hover:bg-[#38311E]/30"
              >
                <Plus className="w-5 h-5 text-[#06b6d4]" />
                <span className="text-base font-medium" style={{ fontFamily: 'Urbanist, sans-serif' }}>Create Event</span>
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
