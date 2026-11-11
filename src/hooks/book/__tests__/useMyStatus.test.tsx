import { server } from '@/test/msw/server';
import { createTestQueryClient } from '@/test/testQueryClient';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useMyStatus } from '../useMyStatus';
import { likeKeys } from '@/shared/domain/like/queryKeys';
import { bookmarkKeys } from '@/shared/domain/bookmark/queryKeys';
import { myStatusKeys } from '@/shared/domain/book/queryKeys';
import { ItemId } from '@/shared/domain/book/ids';
import { useAuth } from '@/shared/context/AuthContext';
import { User } from '@supabase/supabase-js';

vi.mock('@/shared/context/AuthContext', () => {
  return {
    useAuth: vi.fn(),
  };
});

const ids = (...nums: number[]) => nums as ItemId[];

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
  it('요청 성공 시 likeKeys, bookmarkKeys 캐시에 itemId별로 채워진다', async () => {
    const itemIds = ids(1, 2, 3);
    const response = [
      { itemId: 1, liked: true, bookmarked: true, memoExists: true },
      { itemId: 2, liked: true, bookmarked: true, memoExists: true },
      { itemId: 3, liked: true, bookmarked: true, memoExists: true },
    ];
    const queryKey = myStatusKeys.batch(itemIds);
    queryClient.setQueryData(likeKeys.detail(itemIds[0]), { itemId: 1, liked: true, liked_count: 5 });
    let requestedIds;
    server.use(
      http.get('/api/my-status', ({ request }) => {
        requestedIds = new URL(request.url).searchParams.get('ids');

        return HttpResponse.json(response, { status: 200 });
      })
    );

    renderHook(() => useMyStatus(itemIds), { wrapper: queryWrapper });

    await waitFor(() => expect(queryClient.getQueryData(queryKey)).toBeDefined());

    expect(requestedIds).toBe('1,2,3');
    expect(queryClient.getQueryData(queryKey)).toEqual(response);

    const likeCache = itemIds.map((i) => queryClient.getQueryData(likeKeys.detail(i)));
    const bookmarkCache = itemIds.map((i) => queryClient.getQueryData(bookmarkKeys.detail(i)));

    // 기존 좋아요 수(5)는 유지하고 liked만 갱신
    expect(likeCache).toEqual([
      { itemId: 1, liked: true, liked_count: 5 },
      { itemId: 2, liked: true, liked_count: 0 },
      { itemId: 3, liked: true, liked_count: 0 },
    ]);
    expect(bookmarkCache).toEqual([
      { itemId: 1, bookmarked: true, memoExists: true },
      { itemId: 2, bookmarked: true, memoExists: true },
      { itemId: 3, bookmarked: true, memoExists: true },
    ]);
  });

  it('빈 itemIds면 쿼리가 비활성', () => {
    server.use(
      http.get('/api/my-status', () => {
        return HttpResponse.json(null, { status: 500 });
      })
    );

    const { result } = renderHook(() => useMyStatus([]), { wrapper: queryWrapper });

    expect(result.current.isEnabled).toBe(false);
  });

  it('요청 실패 시 에러 상태', async () => {
    const itemIds = ids(1, 2);

    const queryKey = myStatusKeys.batch(itemIds);

    let call = false;
    server.use(
      http.get('/api/my-status', () => {
        call = true;
        return HttpResponse.json({ error: 'myStatus fetch 실패' }, { status: 500 });
      })
    );

    renderHook(() => useMyStatus(itemIds), { wrapper: queryWrapper });

    await waitFor(() => {
      return expect(queryClient.getQueryState(queryKey)?.status).toBe('error');
    });

    expect(call).toBe(true);
    expect(queryClient.getQueryState(queryKey)?.error).toBeInstanceOf(Error);
    expect(queryClient.getQueryState(queryKey)?.error?.message).toBe('myStatus fetch 실패');
  });
  it('로그인 안 했으면 쿼리가 비활성', () => {
    vi.mocked(useAuth).mockReturnValue({ user: null, setUser: vi.fn() });

    let call = false;
    server.use(
      http.get('/api/my-status', () => {
        call = true;
        return HttpResponse.json(null, { status: 500 });
      })
    );

    const { result } = renderHook(() => useMyStatus(ids(1)), { wrapper: queryWrapper });

    expect(call).toBe(false);
    expect(result.current.isEnabled).toBe(false);
  });
});
