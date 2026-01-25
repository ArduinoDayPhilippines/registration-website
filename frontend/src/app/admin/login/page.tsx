import AdminLoginBackground from '@/components/admin/AdminLoginBackground';
import AdminLoginHeader from '@/components/admin/AdminLoginHeader';
import AdminLoginForm from '@/components/admin/AdminLoginForm';

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Background Layers */}
      <AdminLoginBackground />
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-[420px]">
        {/* Logo and Title */}
        <AdminLoginHeader />

        {/* Login Card */}
        <AdminLoginForm />

        {/* Bottom Text */}
        <p className="text-[rgba(255,255,255,0.25)] text-[10px] text-center mt-5 font-medium">
          Powered by Arduino Community Philippines
        </p>
      </div>
    </div>
  );
}
