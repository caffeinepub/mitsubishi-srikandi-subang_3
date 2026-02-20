import { ReactNode, useEffect } from 'react';
import { useLocation } from '@tanstack/react-router';
import Navbar from '@/components/public/Navbar';
import HeroSection from '@/components/public/HeroSection';
import Footer from '@/components/public/Footer';
import BottomCTABar from '@/components/public/BottomCTABar';
import { useActor } from '@/hooks/useActor';
import {
  getOrCreateSessionId,
  detectDeviceType,
  detectBrowser,
  isBot,
  isAdminRoute,
  getClientIP,
} from '@/utils/visitorTracking';

interface PublicLayoutProps {
  children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  const location = useLocation();
  const pathname = location.pathname;
  const { actor } = useActor();

  // Don't show HeroSection on homepage
  const showHeroSection = pathname !== '/';

  // Track visitor on every page navigation
  useEffect(() => {
    // Skip tracking if actor is not ready
    if (!actor) {
      console.log('[Visitor Tracking] Actor not ready yet');
      return;
    }

    // Skip tracking for admin routes
    if (isAdminRoute(pathname)) {
      console.log('[Visitor Tracking] Skipping admin route:', pathname);
      return;
    }

    // Skip tracking for bots
    if (isBot()) {
      console.log('[Visitor Tracking] Skipping bot');
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

    console.log('[Visitor Tracking] Tracking visit:', {
      sessionId,
      pageUrl,
      deviceType,
      browser,
    });

    // Track the visit
    actor
      .trackVisitor(sessionId, ipAddress, userAgent, pageUrl, referrer, deviceType, browser)
      .then(() => {
        console.log('[Visitor Tracking] Successfully tracked visit');
      })
      .catch((error) => {
        console.error('[Visitor Tracking] Error:', error);
      });
  }, [location.pathname, actor]);

  return (
    <div className="min-h-screen flex flex-col pb-[50px]">
      <Navbar />
      {showHeroSection && <HeroSection pathname={pathname} />}
      <main className="flex-1">{children}</main>
      <Footer />
      <BottomCTABar />
    </div>
  );
}
