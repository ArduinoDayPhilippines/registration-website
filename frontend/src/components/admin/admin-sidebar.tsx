"use client";

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { PanelLeft, Users, Calendar, CheckCircle, BarChart3 } from 'lucide-react';

interface AdminSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  activeTab: 'dashboard' | 'registrations' | 'events' | 'finished' | 'stats' | 'create-event' | 'send-email' | 'export-data';
  onTabChange: (tab: 'dashboard' | 'registrations' | 'events' | 'finished' | 'stats' | 'create-event' | 'send-email' | 'export-data') => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ 
  isOpen, 
  onToggle, 
  activeTab, 
  onTabChange 
}) => {
  const router = useRouter();

  const handleQuickAction = (id: string) => {
    if (id === 'create-event') {
      router.push('/create-event');
    } else if (id === 'send-email') {
      router.push('/event-emailer');
    } else {
      onTabChange(id as any);
    }
  };

  const menuItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: BarChart3 },
    { id: 'registrations' as const, label: 'Recent Registrations', icon: Users },
    { id: 'events' as const, label: 'Active Events', icon: Calendar },
    { id: 'finished' as const, label: 'Finished Events', icon: CheckCircle },
  ];

  const quickActions = [
    { id: 'create-event' as const, label: 'Create New Event', icon: Calendar },
    { id: 'send-email' as const, label: 'Send Bulk Email', icon: Users },
    { id: 'export-data' as const, label: 'Export All Data', icon: CheckCircle },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-gradient-to-b from-[#0B1F23]/95 via-[#0E1924]/95 to-[#0B1F23]/95 backdrop-blur-lg border-r border-[#06b6d4]/30 shadow-2xl transition-all duration-300 z-50 ${
          isOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0 lg:w-20'
        }`}
      >
        {/* Logo and Brand */}
        <div className="h-20 px-4 border-b border-[#06b6d4]/20 flex items-center">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-[#38311E]/40 to-[#06b6d4]/30 p-2 border border-[#06b6d4]/40 flex-shrink-0">
              <Image 
                src="/images/logos/adph-logo.png" 
                alt="Arduino Day Philippines Logo" 
                fill
                className="object-contain p-1"
              />
            </div>
            <div className={`flex flex-col overflow-hidden transition-all duration-300 ${isOpen ? 'opacity-100 delay-200' : 'opacity-0 w-0'}`}>
              <h2 className="text-sm font-bold text-gray-50 truncate whitespace-nowrap" style={{ fontFamily: 'Urbanist, sans-serif' }}>
                Arduino Day Philippines
              </h2>
              <p className="text-xs text-gray-400 whitespace-nowrap" style={{ fontFamily: 'Urbanist, sans-serif' }}>Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-6">
          {/* Overview Section */}
          <div className="space-y-2">
            <h3 className={`text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-4 transition-all duration-300 ${isOpen ? 'opacity-100 delay-200' : 'opacity-0 h-0 overflow-hidden mb-0'}`} style={{ fontFamily: 'Urbanist, sans-serif' }}>
              Overview
            </h3>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                    isActive
                      ? 'bg-gradient-to-r from-[#06b6d4]/70 to-[#0891b2]/70 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-[#38311E]/30'
                  }`}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-[#06b6d4]'}`} />
                  <span className={`text-sm font-medium truncate whitespace-nowrap transition-all duration-300 ${isOpen ? 'opacity-100 delay-200' : 'opacity-0 w-0'}`} style={{ fontFamily: 'Urbanist, sans-serif' }}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Actions Section */}
          <div className={`border-t border-[#06b6d4]/20 pt-4 transition-all duration-300 ${isOpen ? 'opacity-100 delay-200 max-h-96' : 'opacity-0 max-h-0 overflow-hidden pt-0 border-t-0'}`}>
            {isOpen && (
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-4 whitespace-nowrap" style={{ fontFamily: 'Urbanist, sans-serif' }}>
                Quick Actions
              </h3>
            )}
              <div className="space-y-2">
                  {quickActions.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleQuickAction(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                        isActive
                          ? 'bg-gradient-to-r from-[#06b6d4]/70 to-[#0891b2]/70 text-white shadow-lg'
                          : 'text-gray-400 hover:text-white hover:bg-[#38311E]/30'
                      }`}
                    >
                      <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-[#06b6d4]'}`} />
                      <span className="text-sm font-medium truncate whitespace-nowrap" style={{ fontFamily: 'Urbanist, sans-serif' }}>
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
          </div>
        </nav>
      </aside>

      {/* Spacer for desktop */}
      <div className={`hidden lg:block transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'}`} />
    </>
  );
};
