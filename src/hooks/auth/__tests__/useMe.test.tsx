import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import useMe from '../useMe';
import { createWrapper } from '@/test/testQueryClient';
import { server } from '@/test/msw/server';
import { http, HttpResponse } from 'msw';

describe('useMe훅 테스트', () => {
  it('성공하면 유저정보를 반환한다.', async () => {
    server.use(http.get('/api/user/me', () => HttpResponse.json({ id: 'user1', nickname: 'kim' }, { status: 200 })));
    const { result } = renderHook(() => useMe(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.data).toMatchObject({ id: 'user1', nickname: 'kim' }));
  });

  it('실패하면 error를 던진다. ', async () => {
    server.use(http.get('/api/user/me', () => HttpResponse.json({ message: 'fail' }, { status: 500 })));

    const { result } = renderHook(() => useMe(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(Error);

    expect(result.current.error?.message).toBe('유저 정보 조회 실패');
  });
});
