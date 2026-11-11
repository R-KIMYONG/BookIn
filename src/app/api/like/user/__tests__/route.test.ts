import { afterEach, describe, expect, it, vi } from 'vitest';
import { GET, POST } from '../route';
import { createClient } from '@/shared/lib/supabase/server';
import { ensureBook } from '@/shared/lib/book/ensureBook';

vi.mock('@/shared/lib/supabase/server', () => {
  return { createClient: vi.fn() };
});

vi.mock('@/shared/lib/book/ensureBook', () => {
  return { ensureBook: vi.fn() };
});

const loggedIn = { auth: { getUser: () => ({ data: { user: { id: 'user-1' } } }) } };
const loggedOut = { auth: { getUser: () => ({ data: { user: null } }) } };

const postRequest = (body: unknown) =>
  new Request('http://localhost:3000/api/like/user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

describe('좋아요 GET/POST 테스트', () => {
  afterEach(() => vi.restoreAllMocks());

  it('GET / 1. bookIds 없이 요청하면 빈 배열', async () => {
    vi.mocked(createClient).mockResolvedValue(loggedIn as any);
    const req = { url: 'http://localhost:3000/api/like/user' } as any;

    const res = await GET(req);

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([]);
  });

  it.each([
    {
      test: 'GET / 2. 좋아요한 책(1)만 liked:true',
      likes: [{ item_id: 1 }],
      expected: [
        { itemId: 1, liked: true },
        { itemId: 2, liked: false },
        { itemId: 3, liked: false },
      ],
    },
    {
      test: 'GET / 3. 요청에 없는 책(4)만 좋아요했다면 전부 liked:false',
      likes: [{ item_id: 4 }],
      expected: [
        { itemId: 1, liked: false },
        { itemId: 2, liked: false },
        { itemId: 3, liked: false },
      ],
    },
  ])('$test', async ({ likes, expected }) => {
    const fakeSupabase = {
      ...loggedIn,
      from: () => ({
        select: () => ({
          eq: () => ({
            in: async () => ({ data: likes }),
          }),
        }),
      }),
    };

    vi.mocked(createClient).mockResolvedValue(fakeSupabase as any);

    // 잘못된 id(abc)는 걸러짐
    const req = { url: 'http://localhost:3000/api/like/user?bookIds=1,2,3,abc' } as any;

    const res = await GET(req);

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(expected);
  });

  it('POST / 1. 로그인 안 했으면 401', async () => {
    vi.mocked(createClient).mockResolvedValue(loggedOut as any);

    const res = await POST(postRequest({ itemId: 1 }) as any);

    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: 'Unauthorized' });
  });

  it('POST / 2. itemId가 올바르지 않으면 400', async () => {
    vi.mocked(createClient).mockResolvedValue(loggedIn as any);

    const res = await POST(postRequest({ itemId: 'abc' }) as any);

    expect(res.status).toBe(400);
  });

  it('POST / 3. YES24에도 없는 책이면 404', async () => {
    vi.mocked(createClient).mockResolvedValue(loggedIn as any);
    vi.mocked(ensureBook).mockResolvedValue(null);

    const res = await POST(postRequest({ itemId: 1 }) as any);

    expect(res.status).toBe(404);
  });

  it.each([
    {
      test: 'POST / 4. 이미 좋아요 → 삭제 성공 → liked:false',
      existing: true,
      dbError: null,
      status: 200,
      expected: { itemId: 1, liked: false },
    },
    {
      test: 'POST / 5. 좋아요 없음 → 추가 성공 → liked:true',
      existing: false,
      dbError: null,
      status: 200,
      expected: { itemId: 1, liked: true },
    },
    {
      test: 'POST / 6. 삭제 실패 → 500',
      existing: true,
      dbError: { message: 'fail' },
      status: 500,
      expected: { error: 'fail' },
    },
    {
      test: 'POST / 7. 추가 실패 → 500',
      existing: false,
      dbError: { message: 'fail' },
      status: 500,
      expected: { error: 'fail' },
    },
  ])('$test', async ({ existing, expected, dbError, status }) => {
    const insert = vi.fn(async () => ({ error: dbError }));
    const fakeSupabase = {
      ...loggedIn,
      from: () => ({
        select: () => ({
          eq: () => ({
            eq: () => ({
              maybeSingle: async () => ({ data: existing ? { id: 'like-1' } : null }),
            }),
          }),
        }),
        delete: () => ({
          eq: () => ({
            eq: async () => ({ error: dbError }),
          }),
        }),
        insert,
      }),
    };

    vi.mocked(createClient).mockResolvedValue(fakeSupabase as any);
    vi.mocked(ensureBook).mockResolvedValue('book-uuid');

    const res = await POST(postRequest({ itemId: 1 }) as any);

    expect(res.status).toBe(status);
    expect(await res.json()).toEqual(expected);
    if (!existing) {
      expect(insert).toHaveBeenCalledWith({ user_id: 'user-1', book_id: 'book-uuid', item_id: 1 });
    }
  });
});
