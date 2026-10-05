import React, { createContext, useContext, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase, supabaseConfigured } from '../lib/supabase';

// sourced from a previous project

type Result = { error: string | null };

interface AuthContextValue {
  isLoggedIn: boolean;
  signIn: (email: string, password: string) => Promise<Result>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const OFFLINE = "We couldn't reach the internet. Check your connection and try again.";

function friendlyError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes('network') || m.includes('fetch') || m.includes('failed to')) return OFFLINE;
  if (m.includes('already registered') || m.includes('already been registered')) {
    return 'We could not create that account. Try signing in instead.';
  }
  if (m.includes('password') && m.includes('at least')) return 'Please choose a longer password (8 or more characters).';
  if (m.includes('rate limit')) return 'Too many attempts. Please wait a minute and try again.';
  return 'Something went wrong. Please try again.';
}


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