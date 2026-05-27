'use client';

import { useEffect } from 'react';
import { createClient } from '@/shared/lib/supabase/client';
import { useAuth } from '@/shared/context/AuthContext';
import { useQueryClient } from '@tanstack/react-query';

export const AuthListener = () => {
  const { setUser } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      switch (event) {
        case 'SIGNED_IN':

        case 'TOKEN_REFRESHED':
          setUser(session?.user ?? null);

          break;

        case 'SIGNED_OUT':
          setUser(null);
          queryClient.clear();
          break;
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, queryClient]);

  return null;
};
