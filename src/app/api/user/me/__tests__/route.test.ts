import { createClient } from '@/shared/lib/supabase/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { GET } from '../route';

vi.mock('@/shared/lib/supabase/server', () => {
  return {
    createClient: vi.fn(),
  };
});
describe('user/me route 테스트', () => {
  afterEach(() => vi.restoreAllMocks());
  it('인증실패 401 테스트', async () => {
    const fakeSupabase = {
      auth: {
        getUser: async () => {
          return {
            data: { user: null },
            error: { message: '인증실패' },
          };
        },
      },
    };

    vi.mocked(createClient).mockResolvedValue(fakeSupabase as any);

    const response = await GET();
    expect(response.status).toBe(401);

    expect(await response.json()).toEqual({ message: '인증 정보를 확인할 수 없습니다.' });
  });

  it('!user status 200 반환 테스트', async () => {
    const fakeSupabase = {
      auth: {
        getUser: () => {
          return {
            data: { user: null },
            error: null,
          };
        },
      },
    };

    vi.mocked(createClient).mockResolvedValue(fakeSupabase as any);

    const response = await GET();

    expect(response.status).toBe(200);
    expect(await response.json()).toBeNull();
  });

  it('public user table get user info success', async () => {
    const fakeSupabase = {
      auth: {
        getUser: () => {
          return {
            data: { user: 'user-1' },
            error: null,
          };
        },
      },
      from: () => {
        return {
          select: () => {
            return {
              eq: () => {
                return {
                  single: async () => {
                    return { data: { id: 'user-1', nickname: 'kim' }, error: null };
                  },
                };
              },
            };
          },
        };
      },
    };

    vi.mocked(createClient).mockResolvedValue(fakeSupabase as any);

    const response = await GET();

    const userData = await response.json();

    expect(response.status).toBe(200);

    expect(userData).toEqual({ id: 'user-1', nickname: 'kim' });
  });

  it('public user table get user info error', async () => {
    const fakeSupabase = {
      auth: {
        getUser: () => {
          return {
            data: { user: 'user-1' },
            error: null,
          };
        },
      },
      from: () => {
        return {
          select: () => {
            return {
              eq: () => {
                return {
                  single: async () => {
                    return { data: null, error: { message: '유저정보 조회 실패' } };
                  },
                };
              },
            };
          },
        };
      },
    };

    vi.mocked(createClient).mockResolvedValue(fakeSupabase as any);

    const response = await GET();
    const error = await response.json();
    expect(response.status).toBe(500);

    expect(error).toEqual({ message: '사용자 정보를 조회하지 못했습니다.' });
  });
  it('catch error', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    vi.mocked(createClient).mockRejectedValue(new Error('server error'));

    const response = await GET();
    const error = await response.json();
    expect(response.status).toBe(500);
    expect(error).toEqual({ message: '서버 오류가 발생했습니다.' });
    expect(spy).toHaveBeenCalledWith(expect.any(Error));
  });
});
