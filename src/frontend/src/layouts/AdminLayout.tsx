import { ReactNode, useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { DelegationIdentity, isDelegationValid } from '@icp-sdk/core/identity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  LayoutDashboard,
  Car,
  Truck,
  Tag,
  MessageSquare,
  FileText,
  Image,
  Mail,
  Calculator,
  BarChart3,
  Settings,
  Users,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

const menuItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/mobil-keluarga', label: 'Mobil Keluarga', icon: Car },
  { path: '/admin/mobil-niaga', label: 'Mobil Niaga', icon: Truck },
  { path: '/admin/promo', label: 'Promo', icon: Tag },
  { path: '/admin/testimoni', label: 'Testimoni', icon: MessageSquare },
  { path: '/admin/blog', label: 'Blog', icon: FileText },
  { path: '/admin/media', label: 'Media Manager', icon: Image },
  { path: '/admin/leads', label: 'Leads / Kontak Masuk', icon: Mail },
  { path: '/admin/simulasi-kredit', label: 'Simulasi Kredit', icon: Calculator },
  { path: '/admin/statistik', label: 'Statistik Pengunjung', icon: BarChart3 },
  { path: '/admin/pengaturan', label: 'Pengaturan Website', icon: Settings },
  { path: '/admin/admin-users', label: 'Admin Users', icon: Users },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { clear, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const sidebarRef = useRef<HTMLDivElement>(null);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect viewport size and set initial state
  useEffect(() => {
    const checkViewport = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsCollapsed(mobile);
    };

    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  // Auto-collapse on route change (mobile only)
  useEffect(() => {
    if (isMobile) {
      setIsCollapsed(true);
    }
  }, [location.pathname, isMobile]);

  // Click outside to collapse (mobile only)
  useEffect(() => {
    if (!isMobile || isCollapsed) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsCollapsed(true);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, isCollapsed]);

  // Enhanced session state logging for debugging
  useEffect(() => {
    console.log('[AdminLayout] === Session State on Navigation ===');
    console.log('[AdminLayout] Current path:', location.pathname);
    
    if (identity) {
      const principal = identity.getPrincipal();
      console.log('[AdminLayout] Session active');
      console.log('[AdminLayout] Principal:', principal.toString());
      console.log('[AdminLayout] Is Anonymous:', principal.isAnonymous());
      
      if (identity instanceof DelegationIdentity) {
        const delegation = identity.getDelegation();
        const isValid = isDelegationValid(delegation);
        console.log('[AdminLayout] Delegation valid:', isValid);
        
        if (delegation.delegations.length > 0) {
          const firstDelegation = delegation.delegations[0];
          const expirationNs = firstDelegation.delegation.expiration;
          const expirationMs = Number(expirationNs) / 1_000_000;
          const expirationDate = new Date(expirationMs);
          const now = new Date();
          const timeUntilExpiry = expirationMs - now.getTime();
          
          console.log('[AdminLayout] Delegation expiration:', expirationDate.toISOString());
          console.log('[AdminLayout] Time until expiry (hours):', (timeUntilExpiry / (1000 * 60 * 60)).toFixed(2));
          
          if (timeUntilExpiry < 0) {
            console.error('[AdminLayout] ⚠️ Delegation has EXPIRED!');
          } else if (timeUntilExpiry < 3600000) {
            console.warn('[AdminLayout] ⚠️ Delegation expires in less than 1 hour');
          }
        }
      }
    } else {
      console.log('[AdminLayout] No active session');
    }
  }, [identity, location.pathname]);

  const handleLogout = async () => {
    console.log('[AdminLayout] Logout initiated by user');
    console.log('[AdminLayout] Clearing query cache...');
    queryClient.clear();
    console.log('[AdminLayout] Calling clear() to logout...');
    await clear();
    console.log('[AdminLayout] Navigating to login page...');
    navigate({ to: '/login' });
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`border-r border-gray-200 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-16' : 'w-64'
        }`}
        style={{ backgroundColor: '#262729' }}
      >
        {/* Header with toggle button */}
        <div className="p-4 flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex-1">
              <h1 className="text-lg font-bold text-white">
                Mitsubishi Srikandi
              </h1>
              <p className="text-xs text-white/70">Admin Panel</p>
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-white/10 transition-colors text-white"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
          </button>
        </div>
        
        <Separator className="bg-white/10" />
        
        <ScrollArea className="h-[calc(100vh-180px)]">
          <nav className="p-2 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-3 rounded-md text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-white/5 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                      : 'text-white/90 hover:bg-white/10'
                  } ${isCollapsed ? 'justify-center' : ''}`}
                  style={{
                    minHeight: '44px',
                    minWidth: '44px',
                  }}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="whitespace-nowrap overflow-hidden transition-opacity duration-200">
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>
        
        <div
          className={`absolute bottom-0 p-3 border-t transition-all duration-300 ${
            isCollapsed ? 'w-16' : 'w-64'
          }`}
          style={{ backgroundColor: '#262729', borderColor: 'rgba(255,255,255,0.1)' }}
        >
          <Button
            onClick={handleLogout}
            variant="outline"
            className={`w-full bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white transition-all ${
              isCollapsed ? 'px-2' : ''
            }`}
            style={{ minHeight: '44px' }}
          >
            <LogOut className={`h-4 w-4 ${isCollapsed ? '' : 'mr-2'}`} />
            {!isCollapsed && 'Keluar'}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-white">
        <div className="container mx-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
