import { ErrorBoundary } from "@/components/ErrorBoundary";
import BottomCTABar from "@/components/public/BottomCTABar";
import Footer from "@/components/public/Footer";
import HeroSection from "@/components/public/HeroSection";
import Navbar from "@/components/public/Navbar";
import { useActor } from "@/hooks/useActor";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import {
  detectBrowser,
  detectDeviceType,
  getOrCreateSessionId,
  isAdminRoute,
  isBot,
} from "@/utils/visitorTracking";
import { useLocation } from "@tanstack/react-router";
import { type ReactNode, useEffect } from "react";

interface PublicLayoutProps {
  children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  const location = useLocation();
  const pathname = location.pathname;
  const { actor } = useActor();
  const { isInitializing } = useInternetIdentity();

  // Don't show HeroSection on homepage
  const showHeroSection = pathname !== "/";

  // Track visitor on every page navigation
  // biome-ignore lint/correctness/useExhaustiveDependencies: location.pathname triggers re-run intentionally
  useEffect(() => {
    if (!actor || isInitializing) return;
    if (isAdminRoute(pathname)) return;
    if (isBot()) return;

    // Session management with 30-min expiry handled inside getOrCreateSessionId
    const sessionId = getOrCreateSessionId();
    const ipAddress = "client-detected";
    const userAgent = navigator.userAgent;
    // Use pathname as the page URL for clean per-page tracking
    const pageUrl = pathname;
    const referrer = document.referrer || "direct";
    const deviceType = detectDeviceType();
    const browser = detectBrowser();

    actor
      .trackVisitor(
        sessionId,
        ipAddress,
        userAgent,
        pageUrl,
        referrer,
        deviceType,
        browser,
      )
      .catch(() => {
        // silently ignore tracking errors — never break the UI
      });
  }, [location.pathname, pathname, actor, isInitializing]);

  return (
    <div className="min-h-screen flex flex-col pb-[50px]">
      <Navbar />
      {showHeroSection && <HeroSection pathname={pathname} />}
      <ErrorBoundary>
        <main className="flex-1">{children}</main>
      </ErrorBoundary>
      <Footer />
      <BottomCTABar />
    </div>
  );
}
