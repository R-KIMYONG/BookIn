import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useDeleteRecentBooks } from '../useDeleteRecentBook';
import { createTestQueryClient } from '@/test/testQueryClient';
import { server } from '@/test/msw/server';
import { http, HttpResponse } from 'msw';
import { recentbookKeys } from '@/shared/domain/recentbooks/queryKeys';
import { QueryClientProvider } from '@tanstack/react-query';

describe('useDeleteRecentBook훅 테스트', () => {
  it('성공하면 DELETE 요청을 보내고 recent-books를 무효화한다', async () => {
    const client = createTestQueryClient();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    );

    const spy = vi.spyOn(client, 'invalidateQueries');
    let deleteTarget;
    server.use(
      http.delete('/api/recent-books', async ({ request }) => {
        deleteTarget = new URL(request.url).searchParams.get('isbn13');
        return HttpResponse.json({ ok: true });
      })
    );
    const { result } = renderHook(() => useDeleteRecentBooks(), { wrapper });

    act(() => result.current.mutate('a'));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(deleteTarget).toBe('a');

    expect(spy).toHaveBeenCalledWith({ queryKey: recentbookKeys.list() });
  });

  it('실패하면 error 상태가 되고 invalidate하지 않는다', async () => {
    const queryClient = createTestQueryClient();

    const wrapper = ({ children }: { children: React.ReactNode }) => {
      return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    };

    const spy = vi.spyOn(queryClient, 'invalidateQueries');

    server.use(
      http.delete('/api/recent-books', () => {
        return HttpResponse.json({ message: 'fail' }, { status: 500 });
      })
    );

    const { result } = renderHook(() => useDeleteRecentBooks(), { wrapper });

    act(() => result.current.mutate('a'));

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toBe('최근 본 책 삭제실패');

    expect(spy).not.toHaveBeenCalled();
  });

  it('성공하면 muatte에 넘긴 onSuccess 콜백이 호출된다.', async () => {
    const queryClient = createTestQueryClient();

    const wrapper = ({ children }: { children: React.ReactNode }) => {
      return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    };

    server.use(
      //성공을 가정한다.
      http.delete('/api/recent-books', () => {
        return HttpResponse.json({ ok: true }, { status: 200 });
      })
    );

    const { result } = renderHook(() => useDeleteRecentBooks(), { wrapper });

    const onSuccessTestFn = vi.fn();
    act(() =>
      result.current.mutate('a', {
        onSuccess: (data, variables, context) => {
          onSuccessTestFn(data, variables, context);
        },
      })
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(onSuccessTestFn).toHaveBeenCalled();
    expect(onSuccessTestFn.mock.calls[0]).toStrictEqual([undefined, 'a', undefined]);
  });
});
