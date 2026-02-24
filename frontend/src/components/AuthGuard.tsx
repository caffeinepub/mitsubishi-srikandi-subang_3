import { ReactNode, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { DelegationIdentity, isDelegationValid } from '@icp-sdk/core/identity';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const navigate = useNavigate();
  const { identity, loginStatus, isInitializing } = useInternetIdentity();

  useEffect(() => {
    // Wait for initialization to complete
    if (isInitializing || loginStatus === 'logging-in') {
      return;
    }

    // Check if user has valid identity
    if (!identity) {
      navigate({ to: '/login' });
      return;
    }

    // Check if principal is anonymous
    if (identity.getPrincipal().isAnonymous()) {
      navigate({ to: '/login' });
      return;
    }

    // Check delegation validity for DelegationIdentity
    if (identity instanceof DelegationIdentity) {
      const delegation = identity.getDelegation();
      if (!isDelegationValid(delegation)) {
        navigate({ to: '/login' });
        return;
      }
    }
  }, [identity, loginStatus, isInitializing, navigate]);

  // Show loading state during initialization
  if (isInitializing || loginStatus === 'logging-in') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Memuat...</p>
        </div>
      </div>
    );
  }

  // Only render children if we have a valid identity
  if (!identity || identity.getPrincipal().isAnonymous()) {
    return null;
  }

  // Additional check for delegation validity
  if (identity instanceof DelegationIdentity && !isDelegationValid(identity.getDelegation())) {
    return null;
  }

  return <>{children}</>;
}
