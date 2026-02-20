import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { DelegationIdentity, isDelegationValid } from '@icp-sdk/core/identity';
import { AnonymousIdentity } from '@dfinity/agent';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const navigate = useNavigate();
  const { identity, loginStatus, isInitializing } = useInternetIdentity();
  const [recoveryAttempted, setRecoveryAttempted] = useState(false);

  useEffect(() => {
    // Comprehensive diagnostic logging
    console.log('[AuthGuard] === Authentication Check ===');
    console.log('[AuthGuard] isInitializing:', isInitializing);
    console.log('[AuthGuard] loginStatus:', loginStatus);
    console.log('[AuthGuard] identity exists:', !!identity);
    
    if (identity) {
      const principal = identity.getPrincipal();
      console.log('[AuthGuard] Principal ID:', principal.toString());
      console.log('[AuthGuard] Is Anonymous:', principal.isAnonymous());
      
      // Detect identity type
      if (identity instanceof DelegationIdentity) {
        console.log('[AuthGuard] Identity Type: DelegationIdentity');
        const delegation = identity.getDelegation();
        const isValid = isDelegationValid(delegation);
        console.log('[AuthGuard] Delegation Valid:', isValid);
        
        // Log delegation expiration details
        if (delegation.delegations.length > 0) {
          const firstDelegation = delegation.delegations[0];
          const expirationNs = firstDelegation.delegation.expiration;
          const expirationMs = Number(expirationNs) / 1_000_000;
          const expirationDate = new Date(expirationMs);
          const now = new Date();
          const timeUntilExpiry = expirationMs - now.getTime();
          
          console.log('[AuthGuard] Delegation Expiration (ns):', expirationNs.toString());
          console.log('[AuthGuard] Delegation Expiration (ISO):', expirationDate.toISOString());
          console.log('[AuthGuard] Current Time (ISO):', now.toISOString());
          console.log('[AuthGuard] Time Until Expiry (hours):', (timeUntilExpiry / (1000 * 60 * 60)).toFixed(2));
          
          if (timeUntilExpiry < 0) {
            console.warn('[AuthGuard] ⚠️ Delegation has EXPIRED');
          } else if (timeUntilExpiry < 3600000) { // Less than 1 hour
            console.warn('[AuthGuard] ⚠️ Delegation expires in less than 1 hour');
          }
        }
      } else if (identity instanceof AnonymousIdentity) {
        console.log('[AuthGuard] Identity Type: AnonymousIdentity');
      } else {
        console.log('[AuthGuard] Identity Type:', identity.constructor.name);
      }
    } else {
      console.log('[AuthGuard] No identity available');
    }

    // Only proceed with validation after initialization completes
    if (isInitializing || loginStatus === 'logging-in') {
      console.log('[AuthGuard] Still initializing, waiting...');
      return;
    }

    // Fallback recovery mechanism - check localStorage before redirecting
    if (!identity && !recoveryAttempted) {
      console.log('[AuthGuard] No identity found, attempting recovery from localStorage...');
      setRecoveryAttempted(true);
      
      // Check if there's stored identity data
      const storedIdentity = localStorage.getItem('ic-identity');
      const storedDelegation = localStorage.getItem('ic-delegation');
      
      if (storedIdentity || storedDelegation) {
        console.log('[AuthGuard] Found stored identity data, waiting for restoration...');
        // Give the auth system time to restore from storage
        setTimeout(() => {
          if (!identity) {
            console.warn('[AuthGuard] Recovery failed, stored identity could not be restored');
            console.log('[AuthGuard] ❌ VALIDATION FAILED: No valid identity after recovery attempt');
            navigate({ to: '/login' });
          }
        }, 1000);
        return;
      } else {
        console.log('[AuthGuard] No stored identity data found in localStorage');
      }
    }

    // Validate identity
    if (!identity) {
      console.log('[AuthGuard] ❌ VALIDATION FAILED: No identity found, redirecting to login');
      navigate({ to: '/login' });
      return;
    }

    // Check if principal is anonymous
    if (identity.getPrincipal().isAnonymous()) {
      console.log('[AuthGuard] ❌ VALIDATION FAILED: Anonymous principal, redirecting to login');
      navigate({ to: '/login' });
      return;
    }

    // Check delegation validity for DelegationIdentity
    if (identity instanceof DelegationIdentity) {
      const delegation = identity.getDelegation();
      if (!isDelegationValid(delegation)) {
        console.warn('[AuthGuard] ❌ VALIDATION FAILED: Delegation expired, redirecting to login');
        navigate({ to: '/login' });
        return;
      }
    }

    console.log('[AuthGuard] ✅ VALIDATION PASSED: Valid authenticated identity');
  }, [identity, loginStatus, isInitializing, navigate, recoveryAttempted]);

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
