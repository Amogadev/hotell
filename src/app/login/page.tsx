'use client';

import { useState, FormEvent, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthContext } from '@/components/auth-provider';
import { signInWithEmailAndPassword, auth } from '@/lib/firebase';
import { HotelIcon } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user, loading } = useContext(AuthContext);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Dummy validation for demo purposes.
    if (email === 'manager@hotel.com' && password === 'password123') {
        try {
            // In a real app, you would use Firebase Auth.
            // Since we don't have credentials, we'll simulate a successful login.
            toast({
                title: 'Login Successful',
                description: 'Welcome back, Hotel Manager!',
            });
            // This is a mock login, we just redirect. 
            // The AuthProvider will see no user and redirect back.
            // To make this work for demo, we can use a trick.
            // We'll just push to the dashboard. The AuthGuard is set to be permissive for this demo.
            router.push('/');
        } catch (err: any) {
            setError(err.message);
            setIsLoading(false);
        }
    } else {
        // Simulating Firebase auth error
        setTimeout(() => {
            setError('Invalid credentials. Please try again.');
            toast({
                variant: 'destructive',
                title: 'Login Failed',
                description: 'Invalid credentials. Please try again.',
            });
            setIsLoading(false);
        }, 1000);
    }
  };

  if (loading || user) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <p>Loading...</p>
            </div>
        </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center mb-4">
            <HotelIcon className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">HotelVerse</CardTitle>
          <CardDescription>Welcome back, Manager. Please sign in.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="manager@hotel.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="password123"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <p className="text-muted-foreground">Demo credentials:</p>
            <p>Email: <span className="font-medium">manager@hotel.com</span></p>
            <p>Password: <span className="font-medium">password123</span></p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
