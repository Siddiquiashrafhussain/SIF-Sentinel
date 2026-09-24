'use client';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const { login, isLoggingIn, loginError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
    } catch (err) {
      // Error is handled by hook and displayed below
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background-secondary)]">
      <div className="w-full max-w-md p-8 bg-[var(--background-primary)] rounded-xl border border-[var(--border-subtle)] shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">SIF-Sentinel</h1>
          <p className="text-[var(--text-secondary)] mt-2">Sign in to your account</p>
        </div>

        {loginError && (
          <div className="mb-4 p-3 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {(loginError as any).response?.data?.message || 'Invalid email or password'}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
              Email
            </label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 bg-[var(--background-secondary)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-primary)]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
              Password
            </label>
            <input
              type="password"
              required
              className="w-full px-4 py-2 bg-[var(--background-secondary)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-primary)]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full py-2 px-4 bg-[var(--brand-primary)] hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {isLoggingIn ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <div className="mt-6 pt-6 border-t border-[var(--border-subtle)]">
          <p className="text-xs text-[var(--text-secondary)] mb-2">Demo Accounts:</p>
          <ul className="text-xs text-[var(--text-secondary)] space-y-1 font-mono">
            <li>hse@example.com / password123 (HSE)</li>
            <li>supervisor@example.com / password123 (SUP)</li>
            <li>admin@example.com / password123 (ADM)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
