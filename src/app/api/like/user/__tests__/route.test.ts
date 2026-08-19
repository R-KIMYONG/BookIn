import { afterEach, describe, expect, it, vi } from 'vitest';
import { GET, POST } from '../route';
import { createClient } from '@/shared/lib/supabase/server';

vi.mock('@/shared/lib/supabase/server', () => {
  return { createClient: vi.fn() };
});

vi.mock('@/shared/lib/book/upsertBook', () => {
  return { upsertBook: vi.fn() };
});

describe('좋아요 GET/POST 테스트', () => {
  afterEach(() => vi.restoreAllMocks());
  it('GET / 1. 빈배열로 GET에 인자로 요청 시 반환값 테스트', async () => {
    const req = { url: 'http://localhost:3000/api/like/user' } as any;

    const res = await GET(req);

    const result = await res.json();
    expect(res.status).toBe(200);
    expect(result).toEqual({ likedIds: [] });
  });
  it.each([
    {
      test: 'GET / 2.조회된 isbn(a)만 liked:true',
      likes: [{ isbn13: 'a' }],
      expected: [
        { isbn13: 'a', liked: true },
        { isbn13: 'b', liked: false },
        { isbn13: 'c', liked: false },
      ],
    },
    {
      test: 'GET / 3.조회 안 된 isbn(d)면 전부 liked:false',
      likes: [{ isbn13: 'd' }],
      expected: [
        { isbn13: 'a', liked: false },
        { isbn13: 'b', liked: false },
        { isbn13: 'c', liked: false },
      ],
    },
  ])('$test', async ({ likes, expected }) => {
    const fakeSupabase = {
      auth: {
        getUser: () => {
          return {
            data: { user: 'user-1' },
          };
        },
      },
      from: () => {
        return {
          select: () => {
            return {
              eq: () => {
                return {
                  in: async () => {
                    return { data: likes };
                  },
                };
              },
            };
          },
        };
      },
    };

    vi.mocked(createClient).mockResolvedValue(fakeSupabase as any);

    const req = { url: 'http://localhost:3000/api/like/user?bookIds=a,b,c' } as any;

    const res = await GET(req);

    const result = await res.json();

    expect(res.status).toBe(200);

    expect(result).toEqual(expected);
  });

  it('POST 1.auth 정보 없을 시 request 테스트 ', async () => {
    const fakeSupabase = {
      auth: {
        getUser: () => {
          return {
            data: { user: null },
          };
        },
      },
    };

    vi.mocked(createClient).mockResolvedValue(fakeSupabase as any);

    const requestData = {
      isbn13: 'a',
      title: 'test',
      cover: 'img',
      author: 'anyone',
      categoryId: '123',
      categoryName: 'test_categoryName',
    };
    const req = new Request('http://localhost:3000/api/like/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData),
    });

    const res = await POST(req as any);
    const result = await res.json();
    expect(res.status).toBe(401);
    expect(result).toEqual({ error: 'Unauthorized' });
  });

  it.each([
    {
      test: 'POST/2. existing→delete 성공→liked:false',
      existing: true,
      dbError: null,
      status: 200,
      expected: { isbn13: 'a', liked: false },
    },
    {
      test: 'POST/3. 없음→insert 성공→liked:true',
      existing: false,
      dbError: null,
      status: 200,
      expected: { isbn13: 'a', liked: true },
    },
    {
      test: 'POST/4. delete 실패→500',
      existing: true,
      dbError: { message: 'fail' },
      status: 500,
      expected: { error: 'fail' },
    },
    {
      test: 'POST/5. insert 실패→500',
      existing: false,
      dbError: { message: 'fail' },
      status: 500,
      expected: { error: 'fail' },
    },
  ])('$test', async ({ existing, expected, dbError, status }) => {
    const fakeSupabase = {
      auth: {
        getUser: () => {
          return { data: { user: 'user-1' } };
        },
      },
      from: () => {
        return {
          select: () => {
            return {
              eq: () => {
                return {
                  eq: () => {
                    return {
                      maybeSingle: async () => {
                        return { data: existing ? { id: 'like-1' } : null };
                      },
                    };
                  },
                };
              },
            };
          },
          delete: () => {
            return {
              eq: () => {
                return {
                  eq: async () => {
                    return { error: dbError };
                  },
                };
              },
            };
          },
          insert: async () => {
            return { error: dbError };
          },
        };
      },
    };
    const reqData = {
      isbn13: 'a',
      title: 'test',
      cover: 'img',
      author: 'anyone',
      categoryId: '123',
      categoryName: 'test_categoryName',
    };

    vi.mocked(createClient).mockResolvedValue(fakeSupabase as any);

    const requestData = new Request('http://localhost:3000/api/like/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reqData),
    });

    const res = await POST(requestData as any);
    const result = await res.json();
    expect(res.status).toBe(status);
    expect(result).toEqual(expected);
  });
});
