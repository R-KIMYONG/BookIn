import { afterEach, describe, expect, it, vi } from 'vitest';
import { GET } from '../route';
import { createClient } from '@/shared/lib/supabase/server';
import { createAdminClient } from '@/shared/lib/supabase/admin';

vi.mock('@/shared/lib/supabase/server', () => {
  return { createClient: vi.fn() };
});
vi.mock('@/shared/lib/supabase/admin', () => {
  return { createAdminClient: vi.fn() };
});

describe('', () => {
  //1. auth정보 없을때 테스트 -> done
  //2. rpc가 Error일때 리턴값 테스트 ->done
  //3. total>=TASTE_UNLOCK 통과 못할때 테스트
  //4. total>=TASTE_UNLOCK 통과할때 그리고 내부 분기도 통과하는데 오류날때
  //5. total>=TASTE_UNLOCK 통과할때 그리고 내부 분기도 통과하는데 오류안날때
  afterEach(() => vi.restoreAllMocks());
  it('auth정보 없을때 401 반환여부 테스트', async () => {
    const fakeSupabase = {
      auth: {
        getUser: () => {
          return { data: { user: null } };
        },
      },
    };

    vi.mocked(createClient).mockResolvedValue(fakeSupabase as any);
    const res = await GET();
    const result = await res.json();
    expect(res.status).toBe(401);

    expect(result).toEqual({ error: '로그인 필요합니다.' });
  });
  it('rpc가 Error일때 리턴값 테스트', async () => {
    const fakeSupabase = {
      auth: {
        getUser: () => {
          return { data: { user: { id: 'user-1' } } };
        },
      },
    };
    vi.mocked(createClient).mockResolvedValue(fakeSupabase as any);

    const fakeAdminSupabase = {
      rpc: vi.fn().mockReturnValue({ data: null, error: { message: 'database rpc error' } }),
    };

    vi.mocked(createAdminClient).mockReturnValue(fakeAdminSupabase as any);

    const res = await GET();
    const result = await res.json();
    expect(res.status).toBe(500);
    expect(fakeAdminSupabase.rpc).toHaveBeenCalled();
    expect(fakeAdminSupabase.rpc).toHaveBeenCalledWith('get_taste_distribution', { p_user_id: 'user-1' });
    expect(result).toEqual({ error: '취향 분석 실패' });
  });
  it('total>=TASTE_UNLOCK 통과 못할때 테스트', async () => {
    const fakeSupabase = {
      auth: {
        getUser: () => {
          return { data: { user: { id: 'user-1' } } };
        },
      },
      from: vi.fn(),
    };
    const rpcData = [
      { genre: '국내/소설', cnt: 2 },
      { genre: '해외/과학', cnt: 1 },
      { genre: '국내/잡지', cnt: 1 },
    ];

    const fakeAdminSupabase = {
      rpc: vi.fn().mockReturnValue({
        data: rpcData,
      }),
      from: vi.fn(),
    };

    vi.mocked(createClient).mockResolvedValue(fakeSupabase as any);
    vi.mocked(createAdminClient).mockReturnValue(fakeAdminSupabase as any);

    const res = await GET();
    const result = await res.json();

    expect(res.status).toBe(200);
    expect(result.genres).toEqual(rpcData);

    //아래 테스트로 total>=TASTE_UNLOCK 분기 통과 못함을 검증
    expect(fakeSupabase.from).not.toHaveBeenCalled(); //userRow도 호출안됨
    expect(fakeAdminSupabase.from).not.toHaveBeenCalled(); //update 호출안됨
  });
  it('total>=TASTE_UNLOCK 통과할때 그리고 내부 분기도 통과하는데 오류날때', async () => {
    const rpcData = [
      { genre: '국내/소설', cnt: 3 },
      { genre: '해외/과학', cnt: 2 },
      { genre: '국내/잡지', cnt: 1 },
    ];
    const fakeSupabase = {
      auth: {
        getUser: () => {
          return { data: { user: { id: 'user-1' } } };
        },
      },
      from: vi.fn(() => {
        return {
          select: () => {
            return {
              eq: () => {
                return {
                  maybeSingle: () => {
                    return { data: null };
                  },
                };
              },
            };
          },
        };
      }),
    };

    const fakeAdminSupbase = {
      rpc: vi.fn().mockReturnValue({ data: rpcData }),
      from: vi.fn(() => {
        return {
          update: () => {
            return {
              eq: () => {
                return { data: null, error: { message: 'persona save fail' } };
              },
            };
          },
        };
      }),
    };

    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    vi.mocked(createClient).mockResolvedValue(fakeSupabase as any);
    vi.mocked(createAdminClient).mockReturnValue(fakeAdminSupbase as any);

    const res = await GET();

    const result = await res.json();

    expect(fakeSupabase.from).toHaveBeenCalled();
    expect(fakeAdminSupbase.from).toHaveBeenCalled();

    expect(res.status).toBe(200);

    expect(result.genres).toEqual(rpcData);

    expect(spy).toHaveBeenCalledWith('persona 저장 실패:', { message: 'persona save fail' });
  });
  it('total>=TASTE_UNLOCK 통과할때 그리고 내부 분기도 통과하는데 오류안날때', async () => {
    const rpcData = [
      { genre: '국내/소설', cnt: 4 },
      { genre: '해외/과학', cnt: 3 },
      { genre: '에세이', cnt: 2 },
    ];
    const fakeSupabase = {
      auth: {
        getUser: () => {
          return { data: { user: { id: 'user-1' } } };
        },
      },
      from: vi.fn(() => {
        return {
          select: () => {
            return {
              eq: () => {
                return {
                  maybeSingle: () => {
                    return { data: null };
                  },
                };
              },
            };
          },
        };
      }),
    };

    const fakeAdminSupabase = {
      rpc: vi.fn().mockReturnValue({ data: rpcData }),
      from: vi.fn(() => {
        return {
          update: () => {
            return {
              eq: () => {
                return { error: null };
              },
            };
          },
        };
      }),
    };

    const spy = vi.spyOn(console, 'error');
    vi.mocked(createClient).mockResolvedValue(fakeSupabase as any);
    vi.mocked(createAdminClient).mockReturnValue(fakeAdminSupabase as any);

    const res = await GET();
    const result = await res.json();

    expect(res.status).toBe(200);
    expect(fakeSupabase.from).toHaveBeenCalled();
    expect(fakeAdminSupabase.from).toHaveBeenCalled();

    expect(result.genres).toEqual(rpcData);

    expect(spy).not.toHaveBeenCalled();
  });
});
