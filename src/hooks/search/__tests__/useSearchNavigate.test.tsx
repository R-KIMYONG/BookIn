import { createTestQueryClient } from '@/test/testQueryClient';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useSearchNavigate } from '../useSearchNavigate';
import { useRouter } from 'next/navigation';

vi.mock('next/navigation', () => {
  return { useRouter: vi.fn() };
});

describe('useSearchNavigate hook test', () => {
  let queryClient: QueryClient;
  let queryWrapper: ({ children }: { children: React.ReactNode }) => React.JSX.Element;

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = createTestQueryClient();

    queryWrapper = ({ children }) => {
      return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    };
  });

  it('키워드+조건으로 /search URL을 만들어 push한다', () => {
    const mockPush = {
      push: vi.fn(),
    };
    vi.mocked(useRouter).mockReturnValue(mockPush as any);
    const { result } = renderHook(() => useSearchNavigate(), { wrapper: queryWrapper });

    const urlPath = {
      keyword: 'test_keyword',
      sq: 'Title',
      target: 'Book',
      ci: '123',
    };

    result.current.setSearchUrl(urlPath as any);

    expect(mockPush.push).toHaveBeenCalled();
    expect(mockPush.push).toHaveBeenCalledWith('/search?q=test_keyword&sq=Title&target=Book&ci=123');
  });

  it('keyword 없으면 Push 안함', () => {
    const mockPush = {
      push: vi.fn(),
    };
    vi.mocked(useRouter).mockReturnValue(mockPush as any);

    const { result } = renderHook(() => useSearchNavigate(), { wrapper: queryWrapper });

    result.current.setSearchUrl({ keyword: '' } as any);
    expect(mockPush.push).not.toHaveBeenCalled();
  });
});
