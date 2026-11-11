import { createTestQueryClient } from '@/test/testQueryClient';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useSearchNavigate } from '../useSearchNavigate';
import { useRouter } from 'next/navigation';
import { SEARCH_DEFAULT_SORT } from '@/shared/lib/yes24/constants';

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

    result.current.setSearchUrl({ keyword: 'test_keyword', target: 'Book', sort: 'RECENT', page: 2 });

    expect(mockPush.push).toHaveBeenCalled();
    expect(mockPush.push).toHaveBeenCalledWith('/search?q=test_keyword&target=Book&sort=RECENT&page=2');
  });

  it('기본 정렬·1페이지·target 없음이면 URL에 붙이지 않는다', () => {
    const mockPush = {
      push: vi.fn(),
    };
    vi.mocked(useRouter).mockReturnValue(mockPush as any);
    const { result } = renderHook(() => useSearchNavigate(), { wrapper: queryWrapper });

    result.current.setSearchUrl({ keyword: 'test_keyword', sort: SEARCH_DEFAULT_SORT, page: 1 });

    expect(mockPush.push).toHaveBeenCalledWith('/search?q=test_keyword');
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
