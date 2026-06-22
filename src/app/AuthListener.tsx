'use client';

import { useEffect } from 'react';
import { createClient } from '@/shared/lib/supabase/client';
import { useAuth } from '@/shared/context/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { likeKeys } from '@/shared/domain/like/queryKeys';
import { bookmarkKeys } from '@/shared/domain/bookmark/queryKeys';

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

        case 'TOKEN_REFRESHED': {
          const nextUser = session?.user ?? null;
          setUser((prev) => (prev?.id === nextUser?.id ? prev : nextUser));
          break;
        }

        case 'SIGNED_OUT':
          setUser(null);
          queryClient.removeQueries({ queryKey: likeKeys.all });
          queryClient.removeQueries({ queryKey: bookmarkKeys.all });
          queryClient.removeQueries({ queryKey: ['myStatus'] });
          break;
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, queryClient]);

  return null;
};
