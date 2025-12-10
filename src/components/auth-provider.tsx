'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User, auth } from '@/lib/firebase';
import { usePathname, useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // NOTE: This is a mock implementation for demonstration.
  // In a real app with Firebase connected, `onAuthStateChanged` would handle user state.
  // Here, we simulate a logged-in user to allow access to the dashboard.
  useEffect(() => {
    // This simulates a logged-in user. Remove this block when using real Firebase auth.
    setUser({ uid: 'mock-user-uid' } as User);
    setLoading(false);
    
    // This is the real implementation you would use.
    // const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    //   setUser(currentUser);
    //   setLoading(false);
    // });
    // return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
