import { useEffect } from 'react';
import { useLocation } from '@tanstack/react-router';
import { useActor } from './useActor';
import {
  getOrCreateSessionId,
  detectDeviceType,
  detectBrowser,
  isBot,
  isAdminRoute,
  getClientIP,
} from '../utils/visitorTracking';

/**
 * Legacy React hook for visitor tracking.
 * Note: This hook is deprecated. Primary tracking now happens in PublicLayout.
 * Kept for backward compatibility only.
 */
export function useVisitorTracking() {
  const location = useLocation();
  const { actor } = useActor();

  useEffect(() => {
    // This hook is now deprecated - tracking happens in PublicLayout
    // Keeping this empty to avoid duplicate tracking calls
    console.log('[useVisitorTracking] Hook is deprecated, tracking handled by PublicLayout');
  }, [location.pathname, actor]);
}
