import { AdminNavbar } from '@/components/admin/admin-navbar';
import { AdminDashboardContent } from '@/components/admin/admin-dashboard-content';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#092728] to-[#1a1a1a] text-white relative overflow-hidden">
      {/* Gradient Background Orbs - Balanced Orange, Green, Black */}
      {/* Top left - strong orange */}
      <div className="absolute top-0 left-0 w-[750px] h-[750px] bg-gradient-to-br from-[#733C0B]/55 via-[#856730]/45 to-transparent rounded-full blur-[140px] -translate-x-1/2 -translate-y-1/2" />
      {/* Top right - green and orange blend */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-[#2D504B]/50 via-[#856730]/40 to-transparent rounded-full blur-[135px] translate-x-1/2 -translate-y-1/2" />
      {/* Bottom right - strong orange */}
      <div className="absolute bottom-0 right-0 w-[850px] h-[850px] bg-gradient-to-tl from-[#856730]/50 via-[#733C0B]/40 to-transparent rounded-full blur-[150px] translate-x-1/2 translate-y-1/2" />
      
      {/* Dark green blobs - balanced with orange */}
      <div className="absolute top-[15%] left-[25%] w-[700px] h-[700px] bg-[#2D504B]/50 rounded-full blur-[130px]" />
      <div className="absolute top-[45%] right-[20%] w-[650px] h-[650px] bg-[#2D504B]/55 rounded-full blur-[125px]" />
      <div className="absolute bottom-[25%] left-[35%] w-[750px] h-[750px] bg-[#2D504B]/50 rounded-full blur-[135px]" />
      
      {/* Center orange-green blend */}
      <div className="absolute top-[50%] left-[50%] w-[600px] h-[600px] bg-gradient-to-br from-[#733C0B]/30 via-[#2D504B]/35 to-transparent rounded-full blur-[110px] -translate-x-1/2 -translate-y-1/2" />
      
      {/* Additional orange accents */}
      <div className="absolute top-[30%] right-[40%] w-[550px] h-[550px] bg-[#856730]/40 rounded-full blur-[105px]" />
      <div className="absolute bottom-[35%] left-[15%] w-[600px] h-[600px] bg-[#733C0B]/35 rounded-full blur-[115px]" />
      
      {/* Dark accent blobs for depth */}
      <div className="absolute top-[60%] left-[10%] w-[500px] h-[500px] bg-[#3E200A]/40 rounded-full blur-[100px]" />
      <div className="absolute bottom-[40%] right-[45%] w-[520px] h-[520px] bg-[#3E200A]/35 rounded-full blur-[105px]" />
      
      {/* Additional dark/black accents for more depth */}
      <div className="absolute top-[20%] right-[25%] w-[600px] h-[600px] bg-[#0a0a0a]/60 rounded-full blur-[120px]" />
      <div className="absolute bottom-[15%] left-[45%] w-[650px] h-[650px] bg-[#000000]/50 rounded-full blur-[130px]" />
      <div className="absolute top-[40%] left-[5%] w-[550px] h-[550px] bg-[#0a0a0a]/55 rounded-full blur-[110px]" />
      <div className="absolute bottom-[50%] right-[10%] w-[500px] h-[500px] bg-[#000000]/45 rounded-full blur-[100px]" />
      <div className="absolute top-[70%] right-[35%] w-[480px] h-[480px] bg-[#0a0a0a]/50 rounded-full blur-[95px]" />
      
      {/* Content */}
      <div className="relative z-10">
        <AdminNavbar />
        <AdminDashboardContent />
      </div>
    </div>
  );
}