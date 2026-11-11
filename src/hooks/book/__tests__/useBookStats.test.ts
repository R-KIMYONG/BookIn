import { server } from '@/test/msw/server';
import { renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { useBookStats } from '../useBookStats';
import { createWrapper } from '@/test/testQueryClient';
import { ItemId } from '@/shared/domain/book/ids';

describe('useBookStats 훅 테스트', () => {
  it('itemId 목록을 쿼리스트링으로 보내고 stats를 받는다', async () => {
    let requestedIds;
    server.use(
      http.get('/api/book-stats', async ({ request }) => {
        requestedIds = new URL(request.url).searchParams.get('ids');

        return HttpResponse.json({
          1: { view_count: 1, comment_count: 1, like_count: 1 },
          2: { view_count: 2, comment_count: 2, like_count: 2 },
        });
      })
    );

    const { result } = renderHook(() => useBookStats([1, 2] as ItemId[]), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(requestedIds).toBe('1,2');
    expect(result.current.data).toEqual({
      1: { view_count: 1, comment_count: 1, like_count: 1 },
      2: { view_count: 2, comment_count: 2, like_count: 2 },
    });
  });

  it('빈 배열이면 fetch하지 않는다 (enabled: false)', () => {
    let call = '작동 안했다';
    server.use(
      http.get('/api/book-stats', () => {
        call = '작동 했다';

        return HttpResponse.json({});
      })
    );

    const { result } = renderHook(() => useBookStats([]), { wrapper: createWrapper() });

    expect(result.current.status).toBe('pending');
    expect(result.current.fetchStatus).toBe('idle');
    expect(result.current.isEnabled).toBe(false);
    expect(call).toBe('작동 안했다');
  });
});
