'use client';

import React, { createContext, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import AuthToastHandler from '@/components/common/AuthToastHandler';
import type { User } from '@supabase/supabase-js';
import { AuthListener } from './AuthListener';

export const UserContext = createContext<User | null>(null);

const QueryProvider = ({ children, initialUser }: { children: React.ReactNode; initialUser: User | null }) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <UserContext.Provider value={initialUser}>
        <AuthToastHandler />
        <AuthListener />
        {children}
        {process.env.NODE_ENV === 'development' ? <ReactQueryDevtools /> : null}
      </UserContext.Provider>
    </QueryClientProvider>
  );
};

export default QueryProvider;
