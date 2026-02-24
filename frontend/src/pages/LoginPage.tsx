import React, { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { syncAuthToken, clearAuthToken } from '../utils/apiClient';

export default function LoginPage() {
  const { login, clear, loginStatus, identity, isInitializing } = useInternetIdentity();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity && identity.getPrincipal().toString() !== '2vxsx-fae';
  const isLoggingIn = loginStatus === 'logging-in';

  // Sync token when identity is available
  useEffect(() => {
    if (isAuthenticated && identity) {
      const principalId = identity.getPrincipal().toString();
      syncAuthToken(principalId);
      navigate({ to: '/admin/dashboard' });
    }
  }, [isAuthenticated, identity, navigate]);

  const handleLogin = async () => {
    try {
      // Clear any stale session before new login
      clearAuthToken();
      queryClient.clear();
      await clear();
      setTimeout(async () => {
        try {
          await login();
        } catch (err: any) {
          if (err?.message === 'User is already authenticated') {
            await clear();
            setTimeout(() => login(), 300);
          }
        }
      }, 100);
    } catch (err) {
      console.error('[LoginPage] Login error:', err);
    }
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 bg-card rounded-2xl shadow-lg border border-border">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="/assets/logomitsubishi.png"
            alt="Mitsubishi Logo"
            className="h-16 object-contain"
          />
        </div>

        <h1 className="text-2xl font-bold text-center text-foreground mb-2">
          Admin Panel
        </h1>
        <p className="text-center text-muted-foreground text-sm mb-8">
          Masuk menggunakan Internet Identity untuk mengakses panel admin
        </p>

        <button
          onClick={handleLogin}
          disabled={isLoggingIn}
          className="w-full py-3 px-6 bg-primary text-primary-foreground rounded-lg font-semibold text-base transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoggingIn ? (
            <>
              <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              <span>Sedang Login...</span>
            </>
          ) : (
            <span>Login dengan Internet Identity</span>
          )}
        </button>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Hanya untuk administrator yang berwenang
        </p>
      </div>
    </div>
  );
}
