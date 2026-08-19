import { afterEach, describe, expect, it, vi } from 'vitest';
import { GET } from '../route';
import { createClient } from '@/shared/lib/supabase/server';
vi.mock('@/shared/lib/supabase/server', () => {
  return { createClient: vi.fn() };
});

describe('api/my-status route test', () => {
  afterEach(() => vi.restoreAllMocks());
  it('빈배열로 Request로 넘길 시 빈배열 반환여부 테스트', async () => {
    const req = { url: 'http://localhost:3000/api/my-status' } as any; //ids없이 그냥 넘기기

    const res = await GET(req);

    const result = await res.json();

    expect(result).toEqual([]);
  });

  it('auth 인증 실패 시 기대된 값으로 반환여부 테스트', async () => {
    const fakeSupabase = {
      auth: {
        getUser: () => {
          return {
            data: { user: null },
            error: { message: '인증오류' },
          };
        },
      },
    };

    vi.mocked(createClient).mockResolvedValue(fakeSupabase as any);
    const req = { url: 'http://localhost:3000/api/my-status?ids=a,b,c' } as any;
    const res = await GET(req);

    const result = await res.json();
    expect(res.status).toBe(401);

    expect(result).toEqual(
      expect.arrayContaining([{ isbn13: 'a', liked: false, bookmarked: false, memoExists: false }])
    );
  });

  it('route 요청 성공 시 기대값 일치 여부 테스트', async () => {
    const fakeSupabase = {
      auth: {
        getUser: () => {
          return {
            data: { user: 'user-1' },
          };
        },
      },
      from: (table: string) => {
        return {
          select: () => {
            return {
              eq: () => {
                return {
                  in: async () => {
                    if (table === 'likes') return { data: [{ isbn13: 'a' }] };
                    if (table === 'bookmarks') return { data: [{ isbn13: 'a', memo: '<p>메모</p>' }] };
                  },
                };
              },
            };
          },
        };
      },
    };

    vi.mocked(createClient).mockResolvedValue(fakeSupabase as any);

    const req = { url: 'http://localhost:3000/api/my-status?ids=a,b,c' } as any;

    const res = await GET(req);

    const result = await res.json();

    expect(res.status).toBe(200);

    expect(result).toMatchObject([
      { isbn13: 'a', liked: true, bookmarked: true, memoExists: true },
      { isbn13: 'b', liked: false, bookmarked: false, memoExists: false },
      { isbn13: 'c', liked: false, bookmarked: false, memoExists: false },
    ]);
  });
  it('route 요청 실패 시 기대값 일치 여부 테스트', async () => {
    const fakeSupabase = {
      auth: {
        getUser: () => {
          return {
            data: { user: 'user-1' },
          };
        },
      },
      from: (table: string) => {
        return {
          select: () => {
            return {
              eq: () => {
                return {
                  in: async () => {
                    if (table === 'likes') return { data: null };
                    if (table === 'bookmarks') return { data: [{ isbn13: 'a', memo: '<p>메모</p>' }] };
                  },
                };
              },
            };
          },
        };
      },
    };

    vi.mocked(createClient).mockResolvedValue(fakeSupabase as any);

    const req = { url: 'http://localhost:3000/api/my-status?ids=a,b' } as any;

    const res = await GET(req);

    expect(res.status).toBe(200);

    const result = await res.json();

    //likes테이블요청된 isbn13값이 없으니 전부 false 
    //isbn13 : a 가 bookmarks 테이블에 조회된거니까 isbn13 : a 만 있음
    expect(result).toEqual([
      { isbn13: 'a', liked: false, bookmarked: true, memoExists: true },  
      { isbn13: 'b', liked: false, bookmarked: false, memoExists: false },
    ]);
  });
});
