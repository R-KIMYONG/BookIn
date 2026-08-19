import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';

export const createTestQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Infinity,
      },
      mutations: {
        retry: false,
      },
    },
  });
};

export const createWrapper = () => {
  const client = createTestQueryClient();

  return ({ children }: { children: React.ReactNode }) => {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  };
};

export const renderWithClient = (ui: React.ReactElement, client?: QueryClient) => {
  const queryClient = client ?? createTestQueryClient();
  return {
    queryClient,
    ...render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>),
  };
};
