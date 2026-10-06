import React, { useState, useEffect } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase, supabaseConfigured } from '../lib/supabase';

// sourced from a previous project

type Result = { error: string | null; needsConfirmation?: boolean };

interface AuthContextValue {
  session: Session | null;
  isLoggedIn: boolean;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<Result>;
  signIn: (email: string, password: string) => Promise<Result>;
  signOut: () => Promise<void>;
}

const OFFLINE = "We couldn't reach the internet. Check your connection and try again.";

function friendlyError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes('network') || m.includes('fetch') || m.includes('failed to')) return OFFLINE;
  if (m.includes('already registered') || m.includes('already been registered')) {
    return 'We could not create that account. Try signing in instead.';
  }
  if (m.includes('password') && m.includes('at least')) return 'Please choose a longer password (8 or more characters).';
  if (m.includes('rate limit')) return 'Too many attempts. Please wait a minute and try again.';
  if (m.includes('invalid login')) return 'Incorrect email or password.';
  if (m.includes('not confirmed')) return 'Please confirm your email first, then sign in.';
  return 'Something went wrong. Please try again.';
}

const NOT_CONFIGURED = 'Something is wrong w the Supabase settings. Check .env';

export function AuthProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!supabaseConfigured) {
      setLoading(false);
      return;
    }
    // restore a saved session on launch
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    // stays in sync with sign in, sign out, and token refresh
    const { data } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => data.subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string): Promise<Result> => {
    if (!supabaseConfigured) return { error: NOT_CONFIGURED };
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { error: friendlyError(error.message) };
    // with "Confirm email" on, there is no session until they click the email link
    return { error: null, needsConfirmation: !data.session };
  };

  const signIn = async (email: string, password: string): Promise<Result> => {
    if (!supabaseConfigured) return { error: NOT_CONFIGURED };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error ? friendlyError(error.message) : null };
  };

  const signOut = async (): Promise<void> => {
    await supabase.auth.signOut();
  };

  const value: AuthContextValue = {
    session,
    isLoggedIn: session !== null,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}