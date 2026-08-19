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

describe('useLike훅 테스트', () => {
  it('성공하면 서버로 bookInfo를 보내고 onSuccess 콜백이 호출 테스트', async () => {
    const queryClient = createTestQueryClient();

    const wrapper = ({ children }: { children: React.ReactNode }) => {
      return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    };

    const { result: userAuthTest } = renderHook(() => useAuth(), { wrapper });

    expect(userAuthTest.current.user?.id).toBe('user-1');

    const bookInfo = {
      isbn13: '123',
      title: '테스트 제목',
      cover: 'img/jpeg',
      author: '홍길동',
      categoryId: 321,
      categoryName: '소설',
    };

    let isbnList;
    server.use(
      http.post('/api/like/user', async ({ request }) => {
        isbnList = await request.json();

        return HttpResponse.json(
          {
            isbn13: '123',
            liked: true,
          },
          { status: 200 }
        );
      })
    );

    const useLikeMutateOnSuccess = vi.fn();

    const { result: useLikeMutate } = renderHook(() => useLike(bookInfo), { wrapper });

    act(() =>
      useLikeMutate.current.toggle({
        onSuccess: (data, variables, context) => {
          useLikeMutateOnSuccess(data, variables, context);
        },
      })
    );

    await waitFor(() => expect(useLikeMutate.current.isLoading).toBe(false));

    expect(isbnList).toMatchObject(bookInfo);
    expect(useLikeMutateOnSuccess).toHaveBeenCalled();
    expect(useLikeMutateOnSuccess.mock.calls[0][0]).toStrictEqual({ isbn13: '123', liked: true });
  });

  it('optimistic으로 캐시가 {false,0} → {true,1}이 된다', async () => {
    const queryClient = createTestQueryClient();

    const bookInfo = {
      isbn13: '123',
      title: '테스트 제목',
      cover: 'img/jpeg',
      author: '홍길동',
      categoryId: 321,
      categoryName: '소설',
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => {
      return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    };

    const { result } = renderHook(() => useLike(bookInfo), { wrapper });

    queryClient.setQueryData(likeKeys.detail(bookInfo.isbn13), { isbn13: '123', liked: false, liked_count: 0 });
    act(() => result.current.toggle());

    await waitFor(() =>
      expect(queryClient.getQueryData(likeKeys.detail(bookInfo.isbn13))).toMatchObject({
        isbn13: '123',
        liked: true,
        liked_count: 1,
      })
    );
  });

  it('optimistic update 실패 시 롤백 여부 확인 테스트', async () => {
    const queryClient = createTestQueryClient();
    const bookInfo = {
      isbn13: '123',
      title: '테스트 제목',
      cover: 'img/jpeg',
      author: '홍길동',
      categoryId: 321,
      categoryName: '소설',
    };
    const wrapper = ({ children }: { children: React.ReactNode }) => {
      return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    };

    server.use(http.post('/api/like/user', () => HttpResponse.json({ error: 'fail' }, { status: 500 })));

    const { result } = renderHook(() => useLike(bookInfo), { wrapper });

    queryClient.setQueryData(likeKeys.detail(bookInfo.isbn13), { isbn13: '123', liked: false, liked_count: 0 });

    const seen: LikeCache[] = [];
    const queryCache = queryClient.getQueryCache();
    const unsubscribe = queryCache.subscribe((event) => {
      if (event.type !== 'updated') return;
      const eventQueryKey = JSON.stringify(event.query.queryKey);
      const testQueryKey = JSON.stringify(likeKeys.detail(bookInfo.isbn13));
      if (eventQueryKey === testQueryKey) {
        const eventData = queryClient.getQueryData(likeKeys.detail(bookInfo.isbn13)) as LikeCache;

        if (eventData) seen.push(eventData);
      }
    });
    act(() => result.current.toggle());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(seen[0]).toMatchObject({ isbn13: '123', liked: true, liked_count: 1 });
    expect(seen[1]).toMatchObject({ isbn13: '123', liked: false, liked_count: 0 });
    unsubscribe();
  });
});
