'use client';

import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError('Invalid admin credentials. Please try again.');
        return;
      }

      if (data.ok) {
        router.push('/event-emailer');
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="
      relative overflow-hidden
      bg-[rgba(255,255,255,0.03)]
      backdrop-blur-md
      border border-[rgba(255,255,255,0.15)]
      rounded-[24px]
      p-8
      shadow-[0_8px_32px_rgba(0,0,0,0.4)]
    ">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Error message */}
        {error && (
          <div className="bg-red-500/10 border border-red-400/30 rounded-xl px-4 py-3 mb-4">
            <p className="text-red-200 text-xs text-center">{error}</p>
          </div>
        )}

        {/* Email Input */}
        <div className="space-y-2">
          <label className="text-[#9dd5d5] text-[11px] font-medium block">
            Admin Email
          </label>
          <input
            type="email"
            placeholder="admin@arduinoday.ph"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField(null)}
            disabled={isLoading}
            className={`
              w-full
              !bg-[rgba(15,30,30,0.9)]
              border ${focusedField === 'email' ? '!border-[#7dc5c5]' : '!border-[#5da5a5]'}
              rounded-xl
              px-4 py-3
              !text-[#d5e5e5] text-sm
              !placeholder:text-[rgba(197,213,213,0.5)]
              outline-none
              transition-all duration-200
              focus:!border-[#7dc5c5]
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          />
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <label className="text-[#9dd5d5] text-[11px] font-medium block">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setFocusedField('password')}
            onBlur={() => setFocusedField(null)}
            disabled={isLoading}
            className={`
              w-full
              !bg-[rgba(15,30,30,0.9)]
              border ${focusedField === 'password' ? '!border-[#7dc5c5]' : '!border-[#5da5a5]'}
              rounded-xl
              px-4 py-3
              !text-[#d5e5e5] text-sm
              !placeholder:text-[rgba(197,213,213,0.5)]
              outline-none
              transition-all duration-200
              focus:!border-[#7dc5c5]
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          />
        </div>

        {/* Forgot Password */}
        <div className="text-right pt-1">
          <button
            type="button"
            className="text-[#6dd8d8] hover:text-[#8de5e5] text-[11px] font-medium transition-colors"
            disabled={isLoading}
          >
            Forgot password?
          </button>
        </div>

        {/* Login Button - Muted/Disabled appearance */}
        <button
          type="submit"
          disabled={isLoading}
          className="
            w-full
            bg-[rgba(35,60,60,0.6)]
            hover:bg-[rgba(35,60,60,0.7)]
            text-[#95b5b5]
            font-semibold
            py-3.5
            rounded-xl
            transition-all duration-200
            text-sm
            mt-4
            disabled:opacity-60
            disabled:cursor-not-allowed
          "
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Logging in...
            </span>
          ) : (
            'Login to Dashboard'
          )}
        </button>
      </form>

      {/* Footer Text inside card */}
      <div className="mt-7 pt-6 border-t border-[rgba(139,197,197,0.15)]">
        <p className="text-[rgba(165,197,197,0.6)] text-[10px] text-center font-medium">
          Authorized access only · Arduino Day PH Admin
        </p>
      </div>
    </div>
  );
}
