import { server } from '@/test/msw/server';
import { createTestQueryClient } from '@/test/testQueryClient';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useMyStatus } from '../useMyStatus';
import { likeKeys } from '@/shared/domain/like/queryKeys';
import { bookmarkKeys } from '@/shared/domain/bookmark/queryKeys';
import { useAuth } from '@/shared/context/AuthContext';
import { User } from '@supabase/supabase-js';

vi.mock('@/shared/context/AuthContext', () => {
  return {
    useAuth: vi.fn(),
  };
});

describe('useMyStatus훅 테스트', () => {
  let queryClient: QueryClient;
  let queryWrapper: ({ children }: { children: React.ReactNode }) => React.JSX.Element;

  beforeEach(() => {
    queryClient = createTestQueryClient();
    queryWrapper = ({ children }: { children: React.ReactNode }) => {
      return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    };
    vi.mocked(useAuth).mockReturnValue({ user: { id: 'user-1' } as User, setUser: vi.fn() });
  });
  it('요청 성공 시 isbnList가 likeKeys,bookmarkKeys쿼리키에 데이터 캐시여부 검증', async () => {
    const useMyStatusProps = ['a', 'b', 'c'];
    const useMyStatusResult = [
      { isbn13: 'a', liked: true, bookmarked: true, memoExists: true },
      { isbn13: 'b', liked: true, bookmarked: true, memoExists: true },
      { isbn13: 'c', liked: true, bookmarked: true, memoExists: true },
    ];
    const queryKeys = ['myStatus', [...useMyStatusProps].sort().join(',')];
    queryClient.setQueryData(likeKeys.detail('a'), { isbn13: 'a', liked: true, liked_count: 5 });
    let resultCapture;
    server.use(
      http.get('/api/my-status', ({ request }) => {
        resultCapture = new URL(request.url).searchParams.get('ids');

        return HttpResponse.json(useMyStatusResult, { status: 200 });
      })
    );

    renderHook(() => useMyStatus(useMyStatusProps), { wrapper: queryWrapper });

    await waitFor(() => expect(queryClient.getQueryData(queryKeys)).toBeDefined()); //데이터 도착할때까지 대기

    expect(resultCapture).toBe('a,b,c'); //핸들러내부로 요청 성공 검증
    expect(queryClient.getQueryData(queryKeys)).toEqual(useMyStatusResult); // 핸들러의 응답이 제대로 쿼리캐시에 저장여부 검증

    const likeCache = useMyStatusProps.map((i) => queryClient.getQueryData(likeKeys.detail(i)));
    const bookmarkCache = useMyStatusProps.map((i) => queryClient.getQueryData(bookmarkKeys.detail(i)));

    expect(likeCache).toEqual([
      //훅내부 성공 케이스에 의하여 likeKeys 쿼리키에 데이터 저장여부 검증
      {
        isbn13: 'a',
        liked: true,
        liked_count: 5,
      },
      {
        isbn13: 'b',
        liked: true,
        liked_count: 0,
      },
      {
        isbn13: 'c',
        liked: true,
        liked_count: 0,
      },
    ]);
    expect(bookmarkCache).toEqual([
      //bookmarkkeys에 데이터 캐시 여부 검증
      { isbn13: 'a', bookmarked: true, memoExists: true },
      { isbn13: 'b', bookmarked: true, memoExists: true },
      { isbn13: 'c', bookmarked: true, memoExists: true },
    ]);
  });

  it('빈isbnList시 쿼리 작동여부 테스트', () => {
    const useMyStatusProps = [] as string[];

    server.use(
      http.get('/api/my-status', () => {
        return HttpResponse.json(null, { status: 500 });
      })
    );

    const { result } = renderHook(() => useMyStatus(useMyStatusProps), { wrapper: queryWrapper });

    expect(result.current.isEnabled).toBe(false);
  });

  it('요청 실패 시 throw Error여부 테스트', async () => {
    const useMyStatusProps = ['a', 'b'];

    const queryKeys = ['myStatus', [...useMyStatusProps].sort().join(',')];

    let call = false;
    server.use(
      http.get('/api/my-status', () => {
        call = true;
        return HttpResponse.json({ error: 'myStatus fetch 실패' }, { status: 500 });
      })
    );

    renderHook(() => useMyStatus(useMyStatusProps), { wrapper: queryWrapper });

    await waitFor(() => {
      return expect(queryClient.getQueryState(queryKeys)?.status).toBe('error');
    });

    expect(call).toBe(true);
    expect(queryClient.getQueryState(queryKeys)?.error).toBeInstanceOf(Error);

    expect(queryClient.getQueryState(queryKeys)?.error?.message).toBe('myStatus fetch 실패');
  });
  it('useAuth없을때 쿼리 작동X 테스트', () => {
    vi.mocked(useAuth).mockReturnValue({ user: null, setUser: vi.fn() });

    let call = false;
    server.use(
      http.get('/api/my-status', () => {
        call = true;
        return HttpResponse.json(null, { status: 500 });
      })
    );

    const mockData = ['a'];
    const { result } = renderHook(() => useMyStatus(mockData), { wrapper: queryWrapper });

    expect(call).toBe(false); //핸들러로 가지못함
    expect(result.current.isEnabled).toBe(false); //핸들러로 가지못했으니 useAuth가 없어서 못한거임
  });
});
