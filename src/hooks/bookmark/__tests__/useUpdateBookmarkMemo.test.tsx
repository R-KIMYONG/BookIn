import { server } from '@/test/msw/server';
import { createTestQueryClient } from '@/test/testQueryClient';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useUpdateBookmarkMemo } from '../useUpdateBookmarkMemo';
import { act, renderHook, waitFor } from '@testing-library/react';
import { bookmarkKeys } from '@/shared/domain/bookmark/queryKeys';
import { myBooksKeys } from '@/shared/domain/mybooks/queryKeys';

describe('useUpdateBookmarkMemo훅 테스트', () => {
  let queryClient: QueryClient;
  let queryWrapper: ({ children }: { children: React.ReactNode }) => React.JSX.Element;

  beforeEach(() => {
    queryClient = createTestQueryClient();
    queryWrapper = ({ children }) => {
      return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    };
  });

  it('메모 업데이트와 무효화 성공 여부 테스트', async () => {
    let call = false;
    server.use(
      http.patch('/api/bookmark/memo', async ({ request }) => {
        call = true;
        const result = await request.json();
        const bookmarkId = 'bookmark-a';
        const message = 'new message';

        const data = Object.assign(result || {}, { bookmarkId, message });

        return HttpResponse.json(data, { status: 200 });
      })
    );

    const spy = vi.spyOn(queryClient, 'invalidateQueries');

    const userId = 'user-1';
    const memo = 'memo-new';
    const prevMemo = 'memo-prev';
    const tags = [{ id: 'new', name: 'tag-new', color: 'white', slug: '시리즈' }];
    const prevTags = [{ id: 'prev', name: 'tag-prev', color: 'black', slug: '선물' }];
    const bookKey = 'a123';

    const prevResult = {
      bookmarkId: 'bookmark-1',
      isbn13: bookKey,
      memo: prevMemo,
      tags: prevTags,
      message: 'prev message',
    };

    queryClient.setQueryData(bookmarkKeys.memo(userId, bookKey), prevResult); // prev값 셋팅-> 안그럼 분기 통과 못함

    const { result } = renderHook(() => useUpdateBookmarkMemo(userId, bookKey), { wrapper: queryWrapper });
    act(() => result.current.mutate({ memo, tags }));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(queryClient.getQueryData(bookmarkKeys.memo(userId, bookKey))).toMatchObject({
      memo,
      tags,
    });

    expect(call).toBe(true);

    //총 몇개의 쿼리키가 무효화 됬나?
    expect(spy.mock.calls.length).toBe(4); //4이면 userId 분기 포함해서 전체 4개를 무효화함
    //어떤 쿼리키가 무효화 진행했나?
    //userId 분기내의 키 무효화 확실히 했나?
    expect(spy).toHaveBeenCalledWith({ queryKey: myBooksKeys.all });
    expect(spy).toHaveBeenCalledWith({ queryKey: bookmarkKeys.tags.user() });

    //기타 무효화 진행여부 확인
    expect(spy).toHaveBeenCalledWith({ queryKey: bookmarkKeys.memo(userId, bookKey) });
    expect(spy).toHaveBeenCalledWith({ queryKey: bookmarkKeys.tags.detail(userId, bookKey) });
  });

  it('기존 캐시가 없으면 memo 캐시를 쓰지 않는다', async () => {
    let call = false;
    server.use(
      http.patch('/api/bookmark/memo', async ({ request }) => {
        call = true;
        const result = await request.json();
        const bookmarkId = 'bookmark-a';
        const message = 'new message';

        const data = Object.assign(result || {}, { bookmarkId, message });

        return HttpResponse.json(data, { status: 200 });
      })
    );

    const userId = 'user-1';
    const memo = 'memo-new';
    const tags = [{ id: 'new', name: 'tag-new', color: 'white', slug: '시리즈' }];
    const bookKey = 'a123';

    const { result } = renderHook(() => useUpdateBookmarkMemo(userId, bookKey), { wrapper: queryWrapper });

    act(() => result.current.mutate({ memo, tags })); //mutation 실행으로 상태업데이트 필요

    await waitFor(() => expect(result.current.isSuccess).toBe(true)); //mutation 완료될때까지 대기
    expect(call).toBe(true); //server로 진입 했음을 검증

    expect(queryClient.getQueryData(bookmarkKeys.memo(userId, bookKey))).toBeUndefined(); //기존데이터를 심지않았으니 Undefined로 남음
  });

  it('userId가 없으면 조건부 무효화 2개를 건너뛴다', async () => {
    let call = false;
    server.use(
      http.patch('/api/bookmark/memo', async ({ request }) => {
        call = true;
        const result = await request.json();
        const bookmarkId = 'bookmark-a';
        const message = 'new message';

        const data = Object.assign(result || {}, { bookmarkId, message });

        return HttpResponse.json(data, { status: 200 });
      })
    );

    const userId = '';
    const memo = 'memo-new';
    const tags = [{ id: 'new', name: 'tag-new', color: 'white', slug: '시리즈' }];
    const bookKey = 'a123';

    const spy = vi.spyOn(queryClient, 'invalidateQueries');
    const { result } = renderHook(() => useUpdateBookmarkMemo(userId, bookKey), { wrapper: queryWrapper });

    act(() => result.current.mutate({ memo, tags }));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(spy.mock.calls.length).toBe(2);
    expect(spy).toHaveBeenCalledWith({ queryKey: bookmarkKeys.memo(userId, bookKey) });
    expect(spy).toHaveBeenCalledWith({ queryKey: bookmarkKeys.tags.detail(userId, bookKey) });
  });
});
