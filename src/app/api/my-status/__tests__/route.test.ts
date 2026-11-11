import { afterEach, describe, expect, it, vi } from 'vitest';
import { GET } from '../route';
import { createClient } from '@/shared/lib/supabase/server';
vi.mock('@/shared/lib/supabase/server', () => {
  return { createClient: vi.fn() };
});

const fakeSupabaseWith = (likes: unknown, bookmarks: unknown) => ({
  auth: {
    getUser: () => ({ data: { user: { id: 'user-1' } } }),
  },
  from: (table: string) => ({
    select: () => ({
      eq: () => ({
        in: async () => {
          if (table === 'likes') return { data: likes };
          if (table === 'bookmarks') return { data: bookmarks };
        },
      }),
    }),
  }),
});

describe('api/my-status route test', () => {
  afterEach(() => vi.restoreAllMocks());
  it('ids 없이 요청하면 빈 배열', async () => {
    const fakeSupabase = { auth: { getUser: () => ({ data: { user: null } }) } };
    vi.mocked(createClient).mockResolvedValue(fakeSupabase as any);
    const req = { url: 'http://localhost:3000/api/my-status' } as any;

    const res = await GET(req);

    expect(await res.json()).toEqual([]);
  });

  it('로그인 안 했으면 401과 전부 false', async () => {
    const fakeSupabase = {
      auth: {
        getUser: () => ({ data: { user: null }, error: { message: '인증오류' } }),
      },
    };

    vi.mocked(createClient).mockResolvedValue(fakeSupabase as any);
    const req = { url: 'http://localhost:3000/api/my-status?ids=1,2,3' } as any;
    const res = await GET(req);

    expect(res.status).toBe(401);
    expect(await res.json()).toEqual(
      expect.arrayContaining([{ itemId: 1, liked: false, bookmarked: false, memoExists: false }])
    );
  });

  it('좋아요·북마크·메모 상태를 itemId별로 합친다 (잘못된 id는 걸러짐)', async () => {
    vi.mocked(createClient).mockResolvedValue(
      fakeSupabaseWith([{ item_id: 1 }], [{ item_id: 1, memo: '<p>메모</p>' }]) as any
    );

    const req = { url: 'http://localhost:3000/api/my-status?ids=1,2,3,abc' } as any;

    const res = await GET(req);

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([
      { itemId: 1, liked: true, bookmarked: true, memoExists: true },
      { itemId: 2, liked: false, bookmarked: false, memoExists: false },
      { itemId: 3, liked: false, bookmarked: false, memoExists: false },
    ]);
  });

  it('likes 조회 결과가 없으면 liked는 전부 false', async () => {
    vi.mocked(createClient).mockResolvedValue(fakeSupabaseWith(null, [{ item_id: 1, memo: '<p>메모</p>' }]) as any);

    const req = { url: 'http://localhost:3000/api/my-status?ids=1,2' } as any;

    const res = await GET(req);

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([
      { itemId: 1, liked: false, bookmarked: true, memoExists: true },
      { itemId: 2, liked: false, bookmarked: false, memoExists: false },
    ]);
  });
});
