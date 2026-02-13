'use client';

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { NextUIProvider } from '@nextui-org/react';
const QueryProvider = ({ children }: React.PropsWithChildren) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <NextUIProvider>
        {children}
        {process.env.NODE_ENV === 'development' ? <ReactQueryDevtools /> : null}
      </NextUIProvider>
    </QueryClientProvider>
  );
};

export default QueryProvider;
