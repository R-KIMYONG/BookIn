'use client';

import { useEffect } from 'react';
import { createClient } from '@/shared/lib/supabase/client';
import { useAuth } from '@/shared/context/AuthContext';

const supabase = createClient();
export const AuthListener = () => {
  const { setUser } = useAuth();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser]);

  return null;
};
