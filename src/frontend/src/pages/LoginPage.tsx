import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loginStatus, identity, clear } = useInternetIdentity();
  const [error, setError] = useState<string>('');

  // Redirect if already authenticated
  useEffect(() => {
    if (identity && !identity.getPrincipal().isAnonymous() && loginStatus === 'success') {
      navigate({ to: '/admin/dashboard' });
    }
  }, [identity, loginStatus, navigate]);

  const handleLogin = async () => {
    try {
      setError('');
      
      // Clear any stale session first
      if (identity) {
        await clear();
        // Wait a bit for cleanup
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      await login();
    } catch (err: any) {
      console.error('[LoginPage] Login error:', err);
      setError(err.message || 'Login gagal. Silakan coba lagi.');
    }
  };

  const isLoading = loginStatus === 'logging-in' || loginStatus === 'initializing';

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Mitsubishi Srikandi Subang
          </CardTitle>
          <CardDescription className="text-center">
            Admin Panel - Login dengan Internet Identity
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="text-sm text-muted-foreground text-center">
              Klik tombol di bawah untuk login menggunakan Internet Identity
            </div>

            <Button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                'Login dengan Internet Identity'
              )}
            </Button>

            <div className="text-xs text-muted-foreground text-center">
              Internet Identity adalah sistem autentikasi aman yang dibangun di Internet Computer
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
