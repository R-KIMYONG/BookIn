// src/test/useLike.test.tsx
import { describe, expect, it, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { server } from '@/test/msw/server';
import { http, HttpResponse } from 'msw';

import { createTestQueryClient } from '@/test/testQueryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

import { useLike, type LikeCache } from '@/hooks/like/useLike';

const wrapperWith = (client: any) => {
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client }, children);
};
vi.mock('@/hooks/useUser', () => {
  return {
    default: () => ({
      data: { id: 'user-1' }, // 로그인된 유저처럼
      isLoading: false,
      isError: false,
    }),
  };
});

describe('useLike', () => {
  const bookInfo = { isbn13: 'X', title: 't', cover: 'c', author: 'a' };

  it('서버 에러면 optimistic을 rollback 한다', async () => {
    // 이번 테스트만 POST 실패하도록
    server.use(
      http.post('/api/like', async () => {
        return HttpResponse.json({ message: 'fail' }, { status: 500 });
      })
    );

    const queryClient = createTestQueryClient();

    queryClient.setQueryData<LikeCache>(['like', bookInfo.isbn13], {
      isbn13: bookInfo.isbn13,
      liked: false,
      liked_count: 0,
    });

    //  캐시 변화 구독해서 상태 흐름을 기록
    const seen: LikeCache[] = [];
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (event?.type !== 'updated') return;
      const q = event.query;
      if (q.queryKey[0] === 'like' && q.queryKey[1] === bookInfo.isbn13) {
        const v = queryClient.getQueryData<LikeCache>(['like', bookInfo.isbn13]);
        if (v) seen.push(v);
      }
    });

    const { result } = renderHook(() => useLike(bookInfo), {
      wrapper: wrapperWith(queryClient),
    });

    act(() => {
      result.current.toggle(false);
    });

    // optimistic이 "한 번이라도" 발생했는지
    await waitFor(() => {
      expect(seen.some((v) => v.liked === true && v.liked_count === 1)).toBe(true);
    });

    // 최종적으로 rollback 되었는지
    await waitFor(() => {
      const last = queryClient.getQueryData<LikeCache>(['like', bookInfo.isbn13]);
      expect(last?.liked).toBe(false);
      expect(last?.liked_count).toBe(0);
    });

    unsubscribe();
  });
  //성공 시: optimistic → 최종 확정값 반영
  //연속 토글: POST 다음 바로 DELETE
  //count 0 이하 방지
});
