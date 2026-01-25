'use client';

import { FormEvent } from 'react';
import AdminInput from './admin-input';

interface AdminLoginFormProps {
  formData: { email: string; password: string };
  errors: { email: string; password: string; form: string };
  isLoading: boolean;
  isSuccess: boolean;
  shake: boolean;
  isFormValid: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  handleSubmit: (e: FormEvent) => void;
}

export default function AdminLoginForm({
  formData,
  errors,
  isLoading,
  isSuccess,
  shake,
  isFormValid,
  handleChange,
  handleBlur,
  handleSubmit,
}: AdminLoginFormProps) {
  return (
    <div className={`backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl transition-all duration-300 ${
      isSuccess ? 'ring-2 ring-teal-400/50 shadow-teal-500/20 shadow-orange-500/10' : ''
    }`}>
      {/* Form Error Banner */}
      {errors.form && (
        <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-red-500/10 to-amber-500/10 border border-red-500/20 animate-fadeIn">
          <p className="text-sm text-red-300/90 text-center">{errors.form}</p>
        </div>
      )}

      {/* Success State */}
      {isSuccess && (
        <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-teal-500/10 to-cyan-500/10 border border-teal-500/30 animate-fadeIn">
          <p className="text-sm text-teal-300 text-center">✓ Login successful! Redirecting...</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Input */}
        <AdminInput
          id="email"
          name="email"
          type="email"
          label="Admin Email"
          value={formData.email}
          error={errors.email}
          placeholder="admin@arduinoday.ph"
          disabled={isLoading || isSuccess}
          onChange={handleChange}
          onBlur={handleBlur}
        />

        {/* Password Input */}
        <AdminInput
          id="password"
          name="password"
          type="password"
          label="Password"
          value={formData.password}
          error={errors.password}
          placeholder="••••••••"
          disabled={isLoading || isSuccess}
          shake={shake}
          onChange={handleChange}
          onBlur={handleBlur}
        />

        {/* Forgot Password Link */}
        <div className="text-right">
          <a 
            href="#" 
            className="text-sm text-teal-400/70 hover:text-teal-300 transition-colors duration-200"
            onClick={(e) => e.preventDefault()}
          >
            Forgot password?
          </a>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isFormValid || isLoading || isSuccess}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
            !isFormValid || isLoading
              ? 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
              : isSuccess
              ? 'bg-gradient-to-r from-teal-600 to-orange-600 text-white'
              : 'bg-gradient-to-r from-teal-600 via-cyan-600 to-orange-600 text-white hover:from-teal-500 hover:via-cyan-500 hover:to-orange-500 hover:shadow-lg hover:shadow-teal-500/30 hover:shadow-orange-500/20 hover:-translate-y-0.5'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Logging in...
            </span>
          ) : isSuccess ? (
            'Success!'
          ) : (
            'Login to Dashboard'
          )}
        </button>
      </form>

      {/* Footer Note */}
      <div className="mt-6 pt-6 border-t border-white/5">
        <p className="text-xs text-center text-transparent bg-clip-text bg-gradient-to-r from-slate-400 via-teal-400 to-orange-400">
          Authorized access only · Arduino Day PH Admin
        </p>
      </div>
    </div>
  );
}
