'use client';

import AdminBackground from '@/components/admin-login/admin-background';
import AdminHeader from '@/components/admin-login/admin-header';
import AdminLoginForm from '@/components/admin-login/admin-login-form';
import { useAdminLogin } from '@/hooks/use-admin-login';

export default function AdminLoginPage() {
  const {
    formData,
    errors,
    isLoading,
    isSuccess,
    shake,
    isFormValid,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useAdminLogin();

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#0a1f1f] via-[#0d2424] to-[#0a1817]">
      {/* Animated Background Gradients */}
      <AdminBackground />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo Section */}
          <AdminHeader />

          {/* Login Card */}
          <AdminLoginForm
            formData={formData}
            errors={errors}
            isLoading={isLoading}
            isSuccess={isSuccess}
            shake={shake}
            isFormValid={isFormValid}
            handleChange={handleChange}
            handleBlur={handleBlur}
            handleSubmit={handleSubmit}
          />

          {/* Bottom Accent */}
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              Powered by Arduino Community Philippines
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
