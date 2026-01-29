import Image from 'next/image';
import Link from 'next/link';
import { LogOut, Menu } from 'lucide-react';

export function AdminNavbar() {
  return (
    <nav className="w-full px-4 md:px-8 lg:px-12 py-4 flex items-center justify-between z-50 fixed top-0 backdrop-blur-md bg-gradient-to-r from-[#0a0a0a]/95 via-[#092728]/95 to-[#0a0a0a]/95 border-b border-[#856730]/20 shadow-lg shadow-black/30">
      {/* Logo and Brand */}
      <Link href="/admin-dashboard" className="flex items-center gap-3 md:gap-4 group">
        <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-[#2D504B]/40 to-[#856730]/30 p-2 border border-[#856730]/40 group-hover:scale-105 transition-transform">
          <Image 
            src="/images/logos/adph-logo.png" 
            alt="Arduino Day Philippines Logo" 
            fill
            className="object-contain p-1"
          />
        </div>
        <div className="flex flex-col">
          <h1 className="text-lg md:text-xl font-bold text-gray-50 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
            Arduino Day Philippines
          </h1>
          <p className="text-xs text-gray-100 font-semibold hidden sm:block">Admin Dashboard</p>
        </div>
      </Link>

      {/* Right Side - Admin Info & Actions */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Logout Button */}
        <button className="flex items-center gap-2 px-3 md:px-4 py-2 bg-gradient-to-r from-[#856730]/40 to-[#733C0B]/50 hover:from-[#856730]/60 hover:to-[#733C0B]/70 rounded-lg border border-[#856730]/70 hover:border-[#856730]/90 transition-all group shadow-lg shadow-[#733C0B]/20">
          <LogOut className="w-4 h-4 !text-white drop-shadow-md" style={{ color: '#bd0000' }} />
          <span className="text-sm font-medium !text-white hidden md:inline drop-shadow-md" style={{ color: '#bd0000' }}>Logout</span>
        </button>

        {/* Mobile Menu Button */}
        <button className="md:hidden p-2 rounded-lg bg-[#2D504B]/30 border border-[#856730]/30 hover:bg-[#2D504B]/40 transition-colors">
          <Menu className="w-5 h-5 text-white" />
        </button>
      </div>
    </nav>
  );
}
