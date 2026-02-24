import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import LoginPage from './pages/LoginPage';
import AdminLayout from './layouts/AdminLayout';
import PublicLayout from './layouts/PublicLayout';
import DashboardPage from './pages/admin/DashboardPage';
import PassengerVehiclesPage from './pages/admin/PassengerVehiclesPage';
import CommercialVehiclesPage from './pages/admin/CommercialVehiclesPage';
import PromosPage from './pages/admin/PromosPage';
import TestimonialsPage from './pages/admin/TestimonialsPage';
import BlogPage from './pages/admin/BlogPage';
import MediaManagerPage from './pages/admin/MediaManagerPage';
import LeadsPage from './pages/admin/LeadsPage';
import CreditSimulationsPage from './pages/admin/CreditSimulationsPage';
import VisitorStatsPage from './pages/admin/VisitorStatsPage';
import WebsiteSettingsPage from './pages/admin/WebsiteSettingsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import BerandaPage from './pages/public/BerandaPage';
import MobilKeluargaPage from './pages/public/MobilKeluargaPage';
import MobilKeluargaDetailPage from './pages/public/MobilKeluargaDetailPage';
import MobilNiagaPage from './pages/public/MobilNiagaPage';
import MobilNiagaCategoryPage from './pages/public/MobilNiagaCategoryPage';
import MobilNiagaDetailPage from './pages/public/MobilNiagaDetailPage';
import PromoPage from './pages/public/PromoPage';
import TestimoniPage from './pages/public/TestimoniPage';
import BlogListPage from './pages/public/BlogListPage';
import BlogDetailPage from './pages/public/BlogDetailPage';
import KontakPage from './pages/public/KontakPage';
import SimulasiKreditPage from './pages/public/SimulasiKreditPage';
import AuthGuard from './components/AuthGuard';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

const rootRoute = createRootRoute({
  component: () => (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <Outlet />
      <Toaster />
    </ThemeProvider>
  ),
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

// Admin routes
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: () => (
    <AuthGuard>
      <AdminLayout>
        <Outlet />
      </AdminLayout>
    </AuthGuard>
  ),
});

const dashboardRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/dashboard',
  component: DashboardPage,
});

const adminPassengerVehiclesRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/mobil-keluarga',
  component: PassengerVehiclesPage,
});

const adminCommercialVehiclesRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/mobil-niaga',
  component: CommercialVehiclesPage,
});

const adminPromosRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/promo',
  component: PromosPage,
});

const adminTestimonialsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/testimoni',
  component: TestimonialsPage,
});

const adminBlogRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/blog',
  component: BlogPage,
});

const mediaRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/media',
  component: MediaManagerPage,
});

const leadsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/leads',
  component: LeadsPage,
});

const adminCreditSimulationsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/simulasi-kredit',
  component: CreditSimulationsPage,
});

const visitorStatsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/statistik',
  component: VisitorStatsPage,
});

const websiteSettingsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/pengaturan',
  component: WebsiteSettingsPage,
});

const adminUsersRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/admin-users',
  component: AdminUsersPage,
});

// Public routes
const berandaRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => (
    <PublicLayout>
      <BerandaPage />
    </PublicLayout>
  ),
});

const mobilKeluargaRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/mobil-keluarga',
  component: () => (
    <PublicLayout>
      <MobilKeluargaPage />
    </PublicLayout>
  ),
});

const mobilKeluargaDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/mobil-keluarga/$slug',
  component: () => (
    <PublicLayout>
      <MobilKeluargaDetailPage />
    </PublicLayout>
  ),
});

const mobilNiagaRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/mobil-niaga',
  component: () => (
    <PublicLayout>
      <MobilNiagaPage />
    </PublicLayout>
  ),
});

const mobilNiagaCategoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/mobil-niaga/$kategori',
  component: () => (
    <PublicLayout>
      <MobilNiagaCategoryPage />
    </PublicLayout>
  ),
});

const mobilNiagaDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/mobil-niaga/$kategori/$slug',
  component: () => (
    <PublicLayout>
      <MobilNiagaDetailPage />
    </PublicLayout>
  ),
});

const promoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/promo',
  component: () => (
    <PublicLayout>
      <PromoPage />
    </PublicLayout>
  ),
});

const testimoniRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/testimoni',
  component: () => (
    <PublicLayout>
      <TestimoniPage />
    </PublicLayout>
  ),
});

const blogListRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/blog',
  component: () => (
    <PublicLayout>
      <BlogListPage />
    </PublicLayout>
  ),
});

const blogDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/blog/$slug',
  component: () => (
    <PublicLayout>
      <BlogDetailPage />
    </PublicLayout>
  ),
});

const kontakRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/kontak',
  component: () => (
    <PublicLayout>
      <KontakPage />
    </PublicLayout>
  ),
});

const simulasiKreditRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/simulasi-kredit',
  component: () => (
    <PublicLayout>
      <SimulasiKreditPage />
    </PublicLayout>
  ),
});

const routeTree = rootRoute.addChildren([
  berandaRoute,
  loginRoute,
  mobilKeluargaRoute,
  mobilKeluargaDetailRoute,
  mobilNiagaRoute,
  mobilNiagaCategoryRoute,
  mobilNiagaDetailRoute,
  promoRoute,
  testimoniRoute,
  blogListRoute,
  blogDetailRoute,
  kontakRoute,
  simulasiKreditRoute,
  adminRoute.addChildren([
    dashboardRoute,
    adminPassengerVehiclesRoute,
    adminCommercialVehiclesRoute,
    adminPromosRoute,
    adminTestimonialsRoute,
    adminBlogRoute,
    mediaRoute,
    leadsRoute,
    adminCreditSimulationsRoute,
    visitorStatsRoute,
    websiteSettingsRoute,
    adminUsersRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
