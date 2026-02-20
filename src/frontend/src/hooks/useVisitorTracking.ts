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

export function useVisitorTracking() {
  const location = useLocation();
  const { actor } = useActor();

  useEffect(() => {
    // Skip tracking if actor is not ready
    if (!actor) return;

    const pathname = location.pathname;

    // Skip tracking for admin routes
    if (isAdminRoute(pathname)) {
      return;
    }

    // Skip tracking for bots
    if (isBot()) {
      return;
    }

    // Collect tracking data
    const sessionId = getOrCreateSessionId();
    const ipAddress = getClientIP();
    const userAgent = navigator.userAgent;
    const pageUrl = window.location.href;
    const referrer = document.referrer || 'direct';
    const deviceType = detectDeviceType();
    const browser = detectBrowser();

    // Track the visit
    actor
      .trackVisitor(sessionId, ipAddress, userAgent, pageUrl, referrer, deviceType, browser)
      .catch((error) => {
        // Silent fail - don't disrupt user experience if tracking fails
        console.error('Visitor tracking error:', error);
      });
  }, [location.pathname, actor]);
}
