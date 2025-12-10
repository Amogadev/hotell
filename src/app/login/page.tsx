'use client';

import { useState, FormEvent, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthContext } from '@/components/auth-provider';
import { signInWithEmailAndPassword, auth } from '@/lib/firebase';
import { HotelIcon } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

export default function LoginPage() {
  const [email, setEmail] = useState('manager@hotel.com');
  const [password, setPassword] = useState('password123');
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

    try {
        await signInWithEmailAndPassword(auth, email, password);
        toast({
            title: 'Login Successful',
            description: 'Welcome back, Hotel Manager!',
        });
        router.push('/');
    } catch (err: any) {
        let errorMessage = 'An unknown error occurred.';
        if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
            errorMessage = 'Invalid credentials. Please try again.';
        } else if (err.code === 'auth/invalid-email') {
            errorMessage = 'Please enter a valid email address.';
        }
        setError(errorMessage);
        toast({
            variant: 'destructive',
            title: 'Login Failed',
            description: errorMessage,
        });
    } finally {
        setIsLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, 'manager@hotel.com', 'password123');
      toast({
          title: 'Login Successful',
          description: 'Viewing dashboard as a guest.',
      });
      router.push('/');
    } catch (err) {
       toast({
            variant: 'destructive',
            title: 'Guest Login Failed',
            description: 'Could not log in as guest. Please try again.',
        });
    } finally {
        setIsLoading(false);
    }
  }


  if (loading || user) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="text-center">
                <p>Loading...</p>
            </div>
        </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary">
      <Card className="w-full max-w-md mx-4 shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center mb-4">
            <HotelIcon className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">HotelVerse</CardTitle>
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
            {error && <p className="text-sm text-destructive pt-2">{error}</p>}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
            <div className="relative w-full">
                <Separator className="absolute top-1/2 -translate-y-1/2" />
                <p className="text-xs text-center bg-card px-2 text-muted-foreground relative w-fit mx-auto">OR</p>
            </div>
            <Button variant="outline" className="w-full" onClick={handleGuestLogin} disabled={isLoading}>Continue as Guest</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
