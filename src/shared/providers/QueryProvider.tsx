'use client';

import React, { createContext, useEffect, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import AuthToastHandler from '@/components/common/AuthToastHandler';
import type { User } from '@supabase/supabase-js';
import { AuthContext } from '@/shared/context/AuthContext';
import { AuthListener } from '@/app/AuthListener';

type QueryProviderProps = {
  children: React.ReactNode;
  initialUser: User | null;
};

export const UserContext = createContext<User | null>(null);

const QueryProvider = ({ children, initialUser }: QueryProviderProps) => {
  const [queryClient] = useState(() => new QueryClient());

  const [user, setUser] = useState<User | null>(initialUser);
  useEffect(() => {
    setUser((prev) => (prev?.id === initialUser?.id ? prev : initialUser));
  }, [initialUser]);
  const value = useMemo(() => ({ user, setUser }), [user]);
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={value}>
        <AuthToastHandler />
        <AuthListener />
        {children}
        {process.env.NODE_ENV === 'development' ? <ReactQueryDevtools /> : null}
      </AuthContext.Provider>
    </QueryClientProvider>
  );
};

export default QueryProvider;
