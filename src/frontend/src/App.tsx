import { useInternetIdentity } from './hooks/useInternetIdentity';

export default function App() {
  const { identity, loginStatus } = useInternetIdentity();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">
            Mitsubishi Srikandi Subang
          </h1>
          <p className="text-xl text-muted-foreground">
            Phase 1: Foundation Infrastructure
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-8 space-y-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-card-foreground">
              Sistem Sedang Dalam Tahap Pembangunan
            </h2>
            <p className="text-muted-foreground">
              Backend infrastructure dan database architecture sedang dibangun.
            </p>
          </div>

          <div className="pt-4 space-y-2 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Status Sistem:</p>
            <ul className="space-y-1 text-left max-w-md mx-auto">
              <li>✓ IC Canister Architecture</li>
              <li>✓ Blob Storage Integration</li>
              <li>✓ Authorization System</li>
              <li>⏳ Stable Storage Migration</li>
              <li>⏳ Vehicle Data Architecture</li>
              <li>⏳ Lifecycle Hooks</li>
            </ul>
          </div>

          {identity && (
            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Status Autentikasi: <span className="text-foreground font-medium">Terhubung</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Principal: {identity.getPrincipal().toString().slice(0, 20)}...
              </p>
            </div>
          )}

          {loginStatus === 'initializing' && (
            <div className="pt-4">
              <p className="text-sm text-muted-foreground">
                Menginisialisasi sistem...
              </p>
            </div>
          )}
        </div>

        <footer className="pt-8 text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Mitsubishi Srikandi Subang
          </p>
          <p className="mt-2">
            Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
