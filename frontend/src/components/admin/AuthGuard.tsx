'use client';

import { useState, useEffect, ReactNode } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const creds = sessionStorage.getItem('admin_credentials');
    if (creds) {
      verifyCredentials(creds);
    } else {
      setLoading(false);
    }
  }, []);

  async function verifyCredentials(creds: string) {
    try {
      const res = await fetch(`${API_BASE}/api/health`, {
        headers: { Authorization: `Basic ${creds}` },
      });
      if (res.status === 401) {
        sessionStorage.removeItem('admin_credentials');
        setAuthenticated(false);
      } else {
        setAuthenticated(true);
      }
    } catch {
      // If health check fails (e.g. network error), still allow if creds exist
      setAuthenticated(true);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const creds = btoa(`${username}:${password}`);

    try {
      const res = await fetch(`${API_BASE}/api/health`, {
        headers: { Authorization: `Basic ${creds}` },
      });

      if (res.status === 401) {
        setError('Invalid credentials');
        setSubmitting(false);
        return;
      }

      sessionStorage.setItem('admin_credentials', creds);
      setAuthenticated(true);
    } catch {
      // Network error — store creds and proceed
      sessionStorage.setItem('admin_credentials', creds);
      setAuthenticated(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white border border-gray-200 rounded p-8 w-full max-w-sm shadow-sm">
          <h1 className="text-lg font-semibold text-gray-900 mb-6">HEEANG Admin</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
                autoComplete="username"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
                autoComplete="current-password"
                required
              />
            </div>
            {error && (
              <p className="text-red-600 text-sm">{error}</p>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gray-900 text-white text-sm font-medium py-2 rounded hover:bg-gray-700 disabled:opacity-50 transition-colors"
            >
              {submitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
