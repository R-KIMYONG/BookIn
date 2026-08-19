import { createClient } from '@/shared/lib/supabase/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { GET, POST } from '../route';
import { getRecommendations } from '@/shared/lib/server/entities/getRecommendations';
import { createAdminClient } from '@/shared/lib/supabase/admin';
import { SupabaseClient } from '@supabase/supabase-js';

vi.mock('@/shared/lib/supabase/server', () => {
  return { createClient: vi.fn() };
});

vi.mock('@/shared/lib/supabase/admin', () => {
  return { createAdminClient: vi.fn() };
});

vi.mock('@/shared/lib/server/entities/getRecommendations', () => {
  return { getRecommendations: vi.fn() };
});

const { mockCreate } = vi.hoisted(() => {
  return { mockCreate: vi.fn() };
});

vi.mock('@anthropic-ai/sdk', () => {
  return {
    default: class {
      messages = {
        create: mockCreate,
      };
    },
  };
});

describe('taste route GET test', () => {
  afterEach(() => vi.resetAllMocks());

  //GET auth정보 없을때 오류 반환여부 테스트
  //GET error throw할때 try/catch에서 받는지 테스트
  //GET success case 정상적으로 값을 반환여부 테스트

  it('GET/auth정보 없을때 오류 반환여부 테스트', async () => {
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

  it('error throw할때 try/catch에서 받는지 테스트', async () => {
    const fakeSupabase = {
      auth: {
        getUser: () => {
          return { data: { user: { id: 'user-1' } } };
        },
      },
    };
    vi.mocked(createClient).mockResolvedValue(fakeSupabase as any);
    vi.mocked(getRecommendations).mockRejectedValue(new Error('getRecommendation error'));

    const res = await GET();
    const result = await res.json();

    expect(res.status).toBe(500);
    expect(result).toEqual({ error: '불러오기 실패' });
  });
  it('success case 정상적으로 값을 반환여부 테스트', async () => {
    const fakeSupabase = {
      auth: {
        getUser: () => {
          return { data: { user: { id: 'user-1' } } };
        },
      },
    };

    vi.mocked(createClient).mockResolvedValue(fakeSupabase as any);
    vi.mocked(getRecommendations).mockResolvedValue({
      taste_summary: { taste_read: 'a', fun_fortune: 'b', one_line_meme: 'c', reading_style: 'd' },
    } as any);

    const res = await GET();
    const result = await res.json();

    expect(res.status).toBe(200);
    expect(result).toEqual({ taste_read: 'a', fun_fortune: 'b', one_line_meme: 'c', reading_style: 'd' });
  });
});

describe('taste route POST test', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.resetAllMocks();
    vi.useRealTimers();
  });

  // 1. 로그인 안 하면 401
  // 2. 쿨다운 중이면 429
  // 3. get_taste_distribution rpc 에러면 500
  // 4. total이 TASTE_UNLOCK 미만이면 409 (데이터 부족)
  // 5. get_signal_mix rpc 에러면 500
  // 6. upsert 에러면 500
  // 7. 성공하면 200과 taste_summary를 반환한다
  it('로그인 안 하면 401', async () => {
    const fakeSupabase = {
      auth: {
        getUser: () => {
          return { data: { user: null } };
        },
      },
    };
    vi.mocked(createClient).mockResolvedValue(fakeSupabase as any);
    const res = await POST();
    const result = await res.json();
    expect(res.status).toBe(401);
    expect(result).toEqual({ error: '로그인 필요합니다.' });
  });
  it('쿨다운 중이면 429', async () => {
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
                  single: () => {
                    return { data: { id: 'user-1', nickname: 'test_nickname' } };
                  },
                };
              },
            };
          },
        };
      }),
    };
    const baseTime = 600_000; //가짜 현재시간설정
    const elapsed = new Date(baseTime - 60_000).toISOString(); //현재시간보다 작아야 분기 통과하니까 1분을 뺌
    vi.setSystemTime(baseTime);

    vi.mocked(createClient).mockResolvedValue(fakeSupabase as any);
    vi.mocked(getRecommendations).mockResolvedValue({ taste_created_at: elapsed } as any);
    const COOLDOWN = 5 * 60 * 1000;
    const res = await POST();

    const result = await res.json();

    const leftMin = Math.ceil((COOLDOWN - (Date.now() - new Date(elapsed).getTime())) / 60000);

    expect(res.status).toBe(429);
    expect(result).toEqual({ error: `${leftMin}분 후에 다시 추천받을 수 있어요` });
  });
  it('get_taste_distribution rpc 에러면 500', async () => {
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
                  single: () => {
                    return { data: { nickname: 'test_user' } };
                  },
                };
              },
            };
          },
        };
      }),
    };

    const fakeAdminSupbase = {
      rpc: vi.fn((fnName) => {
        if (fnName === 'get_taste_distribution')
          return { data: null, error: { message: 'get_taste_distribution faill' } };
      }),
    };

    vi.mocked(createClient).mockResolvedValue(fakeSupabase as any);
    vi.mocked(createAdminClient).mockReturnValue(fakeAdminSupbase as any);
    const res = await POST();
    const result = await res.json();

    expect(fakeSupabase.from).toHaveBeenCalled();
    expect(fakeSupabase.from).toHaveBeenCalledWith('users');
    expect(fakeAdminSupbase.rpc).toHaveBeenCalled();
    expect(fakeAdminSupbase.rpc).toHaveBeenCalledWith('get_taste_distribution', { p_user_id: 'user-1' });
    expect(res.status).toBe(500);
    expect(result).toEqual({ error: '취향 분석 실패' });
  });
  it('total이 TASTE_UNLOCK 미만이면 409 (데이터 부족)', async () => {
    const rpcData = [
      { genre: '소설', cnt: 2 },
      { genre: '잡지', cnt: 1 },
      { genre: '에세이', cnt: 1 },
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
                  single: () => {
                    return { data: { nickname: 'test_user' } };
                  },
                };
              },
            };
          },
        };
      }),
    };
    const fakeAdminSupabase = {
      rpc: vi.fn((fnName) => {
        if (fnName === 'get_taste_distribution') return { data: rpcData, error: null };
      }),
    };

    vi.mocked(createClient).mockResolvedValue(fakeSupabase as any);
    vi.mocked(createAdminClient).mockReturnValue(fakeAdminSupabase as any);

    const res = await POST();
    const result = await res.json();
    expect(fakeSupabase.from).toHaveBeenCalled();
    expect(fakeAdminSupabase.rpc).toHaveBeenCalled();
    expect(fakeSupabase.from).toHaveBeenCalledWith('users');
    expect(fakeAdminSupabase.rpc).toHaveBeenCalledWith('get_taste_distribution', { p_user_id: 'user-1' });

    expect(res.status).toBe(409);
    expect(result).toEqual({ error: '데이터 부족' });
  });
  it('get_signal_mix rpc 에러면 500', async () => {
    const rpcData = [
      { genre: '소설', cnt: 5 },
      { genre: '잡지', cnt: 1 },
      { genre: '에세이', cnt: 1 },
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
                  single: () => {
                    return { data: { nickname: 'test_user' } };
                  },
                };
              },
            };
          },
        };
      }),
    };
    const fakeAdminSupabase = {
      rpc: vi.fn((fnName) => {
        if (fnName === 'get_taste_distribution') return { data: rpcData, error: null };
        if (fnName === 'get_signal_mix') return { error: 'get_signal_mix fail' };
        if (fnName === 'get_top_anchor') return { error: 'get_top_anchor fail' };
      }),
    };
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    vi.mocked(createClient).mockResolvedValue(fakeSupabase as any);
    vi.mocked(createAdminClient).mockReturnValue(fakeAdminSupabase as any);

    const res = await POST();
    const result = await res.json();
    expect(fakeSupabase.from).toHaveBeenCalled();
    expect(fakeAdminSupabase.rpc).toHaveBeenCalled();
    expect(fakeSupabase.from).toHaveBeenCalledWith('users');
    expect(fakeAdminSupabase.rpc).toHaveBeenCalledWith('get_taste_distribution', { p_user_id: 'user-1' });
    expect(fakeAdminSupabase.rpc).toHaveBeenLastCalledWith('get_signal_mix', { p_user_id: 'user-1' });

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith('anchor 선정 실패:', 'get_top_anchor fail');
    expect(res.status).toBe(500);
    expect(result).toEqual({ error: '행동 시그널 분석 실패' });
  });
  it('upsert 에러면 500', async () => {
    const rpcData = [
      { genre: '소설', cnt: 5 },
      { genre: '잡지', cnt: 1 },
      { genre: '에세이', cnt: 1 },
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
                  single: () => {
                    return { data: { nickname: 'test_user' } };
                  },
                };
              },
            };
          },
        };
      }),
    };
    const fakeAdminSupabase = {
      rpc: vi.fn((fnName) => {
        if (fnName === 'get_taste_distribution') return { data: rpcData, error: null };
        if (fnName === 'get_signal_mix') return { data: [{ likes: 1, bookmarks: 1, comments: 1, views: 1 }] };
        if (fnName === 'get_top_anchor') return { data: ['소설', '잡지', '에세이'] };
      }),
      from: vi.fn(() => {
        return {
          upsert: () => {
            return { error: 'upsert error' };
          },
        };
      }),
    };
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    vi.mocked(createClient).mockResolvedValue(fakeSupabase as any);
    vi.mocked(createAdminClient).mockReturnValue(fakeAdminSupabase as any);
    mockCreate.mockResolvedValue({
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            reading_style: 'a',
            taste_read: 'b',
            fun_fortune: 'c',
            one_line_meme: 'd',
          }),
        },
      ],
    });
    const res = await POST();
    const result = await res.json();
    expect(fakeSupabase.from).toHaveBeenCalled();
    expect(fakeAdminSupabase.rpc).toHaveBeenCalled();
    expect(fakeSupabase.from).toHaveBeenCalledWith('users');
    expect(fakeAdminSupabase.rpc).toHaveBeenCalledWith('get_taste_distribution', { p_user_id: 'user-1' });
    expect(fakeAdminSupabase.rpc).toHaveBeenLastCalledWith('get_signal_mix', { p_user_id: 'user-1' });
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith('taste 저장 실패', 'upsert error');
    expect(res.status).toBe(500);
    expect(result).toEqual({ error: '저장 실패' });
  });
  it.each([
    {
      test: '성공하면 200과 taste_summary를 반환한다',
      createText: { reading_style: 'a', taste_read: 'b', fun_fortune: 'c', one_line_meme: 'd' },
      expected: { reading_style: 'a', taste_read: 'b', fun_fortune: 'c', one_line_meme: 'd' },
    },
    {
      test: '실패하면 200과 taste_summary가 null로 반환한다',
      createText: null,
      expected: null,
    },
  ])('$test', async ({ createText, expected }) => {
    const rpcData = [
      { genre: '소설', cnt: 5 },
      { genre: '잡지', cnt: 4 },
      { genre: '에세이', cnt: 3 },
    ];
    const fakeSupabase = {
      auth: {
        getUser: () => {
          return { data: { user: { id: 'test_user_1' } } };
        },
      },
      from: vi.fn(() => {
        return {
          select: () => {
            return {
              eq: () => {
                return {
                  single: () => {
                    return { data: { nickname: 'test_user_nickname' } };
                  },
                };
              },
            };
          },
        };
      }),
    };
    const fakeAdminSupabase = {
      rpc: vi.fn((fnName) => {
        if (fnName === 'get_taste_distribution') return { data: rpcData };
        if (fnName === 'get_top_anchor') return { data: ['소설', '잡지', '에세이'] };
        if (fnName === 'get_signal_mix') return { data: [{ likes: 1, bookmarks: 1, comments: 1, views: 1 }] };
      }),
      from: vi.fn(() => {
        return {
          upsert: () => {
            return { error: null };
          },
        };
      }),
    };
    vi.mocked(createClient).mockResolvedValue(fakeSupabase as unknown as SupabaseClient);
    vi.mocked(createAdminClient).mockReturnValue(fakeAdminSupabase as unknown as SupabaseClient);
    mockCreate.mockResolvedValue({
      content: [
        {
          type: 'text',
          text: JSON.stringify(createText),
        },
      ],
    });
    const spy = vi.spyOn(console, 'error');

    const res = await POST();
    const result = await res.json();

    expect(fakeSupabase.from).toHaveBeenCalled();
    expect(fakeSupabase.from).toHaveBeenCalledWith('users');
    expect(spy).not.toHaveBeenCalled();
    expect(fakeAdminSupabase.rpc).toHaveBeenCalled();
    expect(fakeAdminSupabase.rpc).toHaveBeenCalledWith('get_taste_distribution', { p_user_id: 'test_user_1' });
    expect(fakeAdminSupabase.rpc).toHaveBeenLastCalledWith('get_signal_mix', { p_user_id: 'test_user_1' });
    expect(res.status).toBe(200);
    expect(result).toEqual({ taste_summary: expected });
  });
});
