import { useAuth } from '@/shared/context/AuthContext';
import { server } from '@/test/msw/server';
import { createTestQueryClient } from '@/test/testQueryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { describe, expect, it, vi } from 'vitest';
import { useLike } from '../useLike';
import { act } from 'react';
import { likeKeys } from '@/shared/domain/like/queryKeys';
import { LikeCache } from '@/shared/domain/like/types';
import { ItemId } from '@/shared/domain/book/ids';

vi.mock('@/shared/context/AuthContext', () => {
  return {
    useAuth: () => {
      return {
        user: { id: 'user-1' },
        setUser: vi.fn(),
      };
    },
  };
});

const ITEM_ID = 123 as ItemId;

describe('useLike훅 테스트', () => {
  it('성공하면 서버로 itemId만 보내고 onSuccess 콜백이 호출 테스트', async () => {
    const queryClient = createTestQueryClient();

    const wrapper = ({ children }: { children: React.ReactNode }) => {
      return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    };

    const { result: userAuthTest } = renderHook(() => useAuth(), { wrapper });

    expect(userAuthTest.current.user?.id).toBe('user-1');

    let requestBody;
    server.use(
      http.post('/api/like/user', async ({ request }) => {
        requestBody = await request.json();

        return HttpResponse.json({ itemId: ITEM_ID, liked: true }, { status: 200 });
      })
    );

    const useLikeMutateOnSuccess = vi.fn();

    const { result: useLikeMutate } = renderHook(() => useLike(ITEM_ID), { wrapper });

    act(() =>
      useLikeMutate.current.toggle({
        onSuccess: (data, variables, context) => {
          useLikeMutateOnSuccess(data, variables, context);
        },
      })
    );

    await waitFor(() => expect(useLikeMutate.current.isLoading).toBe(false));

    // 책 정보 없이 itemId만 전송
    expect(requestBody).toStrictEqual({ itemId: ITEM_ID });
    expect(useLikeMutateOnSuccess).toHaveBeenCalled();
    expect(useLikeMutateOnSuccess.mock.calls[0][0]).toStrictEqual({ itemId: ITEM_ID, liked: true });
  });

  it('optimistic으로 캐시가 {false,0} → {true,1}이 된다', async () => {
    const queryClient = createTestQueryClient();

    const wrapper = ({ children }: { children: React.ReactNode }) => {
      return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    };

    const { result } = renderHook(() => useLike(ITEM_ID), { wrapper });

    queryClient.setQueryData(likeKeys.detail(ITEM_ID), { itemId: ITEM_ID, liked: false, liked_count: 0 });
    act(() => result.current.toggle());

    await waitFor(() =>
      expect(queryClient.getQueryData(likeKeys.detail(ITEM_ID))).toMatchObject({
        itemId: ITEM_ID,
        liked: true,
        liked_count: 1,
      })
    );
  });

  it('optimistic update 실패 시 롤백 여부 확인 테스트', async () => {
    const queryClient = createTestQueryClient();
    const wrapper = ({ children }: { children: React.ReactNode }) => {
      return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    };

    server.use(http.post('/api/like/user', () => HttpResponse.json({ error: 'fail' }, { status: 500 })));

    const { result } = renderHook(() => useLike(ITEM_ID), { wrapper });

    queryClient.setQueryData(likeKeys.detail(ITEM_ID), { itemId: ITEM_ID, liked: false, liked_count: 0 });

    const seen: LikeCache[] = [];
    const queryCache = queryClient.getQueryCache();
    const unsubscribe = queryCache.subscribe((event) => {
      if (event.type !== 'updated') return;
      const eventQueryKey = JSON.stringify(event.query.queryKey);
      const testQueryKey = JSON.stringify(likeKeys.detail(ITEM_ID));
      if (eventQueryKey === testQueryKey) {
        const eventData = queryClient.getQueryData(likeKeys.detail(ITEM_ID)) as LikeCache;

        if (eventData) seen.push(eventData);
      }
    });
    act(() => result.current.toggle());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(seen[0]).toMatchObject({ itemId: ITEM_ID, liked: true, liked_count: 1 });
    expect(seen[1]).toMatchObject({ itemId: ITEM_ID, liked: false, liked_count: 0 });
    unsubscribe();
  });
});
