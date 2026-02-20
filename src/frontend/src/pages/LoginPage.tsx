import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loginStatus, identity } = useInternetIdentity();
  const [error, setError] = useState<string>('');

  // Redirect if already authenticated
  useEffect(() => {
    if (identity && loginStatus === 'success') {
      console.log('[LoginPage] User authenticated, redirecting to dashboard');
      navigate({ to: '/admin/dashboard' });
    }
  }, [identity, loginStatus, navigate]);

  const handleLogin = async () => {
    try {
      setError('');
      console.log('[LoginPage] Starting login process');
      await login();
      // Navigation will happen via useEffect after identity is set
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
            Admin Panel - Masuk ke sistem
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="blankster2024@gmail.com"
              disabled
              value="blankster2024@gmail.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              disabled
              value="dewi4more"
            />
          </div>

          <Button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : (
              'Masuk dengan Internet Identity'
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Sistem menggunakan Internet Identity untuk autentikasi yang aman
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
