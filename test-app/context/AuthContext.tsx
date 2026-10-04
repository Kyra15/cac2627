import React, { createContext, useContext, useState } from 'react';

// In-memory auth state for the prototype — no backend/session persistence
// yet. Swap the body of signIn/signOut for real calls once there's an auth
// endpoint, and everything downstream (HomeScreen, LoginScreen) keeps working
// unchanged since they only ever talk to this hook.

interface AuthContextValue {
  isLoggedIn: boolean;
  signIn: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const value: AuthContextValue = {
    isLoggedIn,
    signIn: () => setIsLoggedIn(true),
    signOut: () => setIsLoggedIn(false),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}