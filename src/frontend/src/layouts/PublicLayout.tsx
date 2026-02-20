import { ReactNode } from 'react';
import { useLocation } from '@tanstack/react-router';
import Navbar from '@/components/public/Navbar';
import HeroSection from '@/components/public/HeroSection';
import Footer from '@/components/public/Footer';
import BottomCTABar from '@/components/public/BottomCTABar';
import { useVisitorTracking } from '@/hooks/useVisitorTracking';

interface PublicLayoutProps {
  children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  const location = useLocation();
  const pathname = location.pathname;

  // Activate visitor tracking on all public pages
  useVisitorTracking();

  // Don't show HeroSection on homepage
  const showHeroSection = pathname !== '/';

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
