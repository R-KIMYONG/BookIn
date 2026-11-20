import { afterEach, describe, expect, it, vi } from 'vitest';
import { GET } from '../route';
import { createAdminClient } from '@/shared/lib/supabase/admin';
import { getCurrentUser } from '@/shared/lib/auth/getCurrentUser';

vi.mock('@/shared/lib/supabase/admin', () => {
  return {
    createAdminClient: vi.fn(),
  };
});
vi.mock('@/shared/lib/auth/getCurrentUser', () => {
  return {
    getCurrentUser: vi.fn(),
  };
});
describe('user/me route 테스트', () => {
  afterEach(() => vi.resetAllMocks());
  it('!user status 200 반환 테스트', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(null);

    const response = await GET();
    expect(response.status).toBe(200);

    expect(await response.json()).toBeNull();
    expect(createAdminClient).not.toHaveBeenCalled();
  });

  it('public user table get user info success', async () => {
    const fakeAdmin = {
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

    vi.mocked(getCurrentUser).mockResolvedValue({ id: 'user-1', nickname: 'kim' } as any);
    vi.mocked(createAdminClient).mockReturnValue(fakeAdmin as any);

    const response = await GET();

    const userData = await response.json();
    expect(response.status).toBe(200);

    expect(userData).toEqual({ id: 'user-1', nickname: 'kim' });
  });

  it('public user table get user info error', async () => {
    const fakeAdmin = {
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
    vi.mocked(getCurrentUser).mockResolvedValue({ id: 'user-1', user: 'kim' } as any);
    vi.mocked(createAdminClient).mockReturnValue(fakeAdmin as any);

    const response = await GET();
    const error = await response.json();
    expect(response.status).toBe(500);

    expect(error).toEqual({ message: '사용자 정보를 조회하지 못했습니다.' });
  });
  it('catch error', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    vi.mocked(getCurrentUser).mockRejectedValue(new Error('server error'));

    const response = await GET();
    const error = await response.json();

    expect(response.status).toBe(500);

    expect(error).toEqual({ message: '서버 오류가 발생했습니다.' });
    expect(spy).toHaveBeenCalledWith(expect.any(Error));
  });
});
