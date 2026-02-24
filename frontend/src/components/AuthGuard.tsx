import React, { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { tokenStorage } from '../utils/tokenStorage';
import { syncAuthToken, clearAuthToken } from '../utils/apiClient';

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * AuthGuard validates Internet Identity delegation before rendering admin pages.
 * - Redirects to /login if identity is missing or anonymous
 * - Syncs principal to localStorage for persistent session tracking
 * - Clears stale tokens on logout/expiry
 */
export default function AuthGuard({ children }: AuthGuardProps) {
  const { identity, isInitializing } = useInternetIdentity();
  const navigate = useNavigate();

  const principalId = identity?.getPrincipal().toString();
  const isAnonymous = !principalId || principalId === '2vxsx-fae';

  useEffect(() => {
    if (isInitializing) return;

    if (!identity || isAnonymous) {
      // Clear any stale token from storage
      clearAuthToken();
      navigate({ to: '/login' });
      return;
    }

    // Check delegation expiry
    try {
      const delegation = (identity as any)._delegation;
      if (delegation?.delegations?.length > 0) {
        const expiry = delegation.delegations[0].delegation.expiration;
        if (expiry) {
          // expiry is in nanoseconds (BigInt)
          const expiryMs = Number(expiry / BigInt(1_000_000));
          if (Date.now() > expiryMs) {
            clearAuthToken();
            navigate({ to: '/login' });
            return;
          }
          // Sync token with expiry
          syncAuthToken(principalId);
        } else {
          syncAuthToken(principalId);
        }
      } else {
        syncAuthToken(principalId);
      }
    } catch {
      // If we can't check delegation, still sync if identity exists
      syncAuthToken(principalId);
    }
  }, [identity, isAnonymous, isInitializing, navigate, principalId]);

  // Show loading while identity is initializing
  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm">Memuat sesi...</p>
        </div>
      </div>
    );
  }

  // Don't render children if not authenticated
  if (!identity || isAnonymous) {
    return null;
  }

  return <>{children}</>;
}
