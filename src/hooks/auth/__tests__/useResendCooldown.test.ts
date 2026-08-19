import { RESEND_COOLDOWN_MS } from '@/shared/constants/auth';
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import useResendCooldown from '../useResendCooldown';

describe('useResendCooldown훅 테스트', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it.each([
    {
      test: '1. reset 만료전 아직 canRetry불가 즉 false 테스트',
      base: 3600000,
      elapsedTime: 3000,
      expected: { remainSec: 57, canRetry: false },
    },
    {
      test: '2. reset 만료됨 canRetry불가 즉 true 테스트',
      base: 3600000,
      elapsedTime: 60000,
      expected: { remainSec: 0, canRetry: true },
    },
  ])('$test', ({ base, elapsedTime, expected }) => {
    //requestTime는 메일전송 시작을 의미함
    //현재시간을 가짜로 하고 -> requestTime을 1분이내 갭으로 설정하면 만료전 됨
    // console.log(new Date(base).toISOString()); //새벽한시
    vi.setSystemTime(base); //base를 현재시간으로 가정함 (단위 MS임)
    const requestTime = base - elapsedTime; //과거 현재 시간 기준 3초만 더하면 3초 경과했다는 현재 시간 1분이내이니 만료전임

    const { result } = renderHook(() => useResendCooldown({ requestTime, cooldownMs: RESEND_COOLDOWN_MS }));

    expect(result.current).toEqual(expected);
  });

  it('requestTime이 없으면 canRetry true', () => {
    const { result } = renderHook(() => useResendCooldown({ requestTime: null, cooldownMs: RESEND_COOLDOWN_MS }));
    expect(result.current).toEqual({ remainSec: 0, canRetry: true });
  });
  it('tick:시간 흐르면 remainSec줄어듬', () => {
    const base = 3_600_000;
    vi.setSystemTime(base);

    const { result } = renderHook(() => useResendCooldown({ requestTime: base, cooldownMs: RESEND_COOLDOWN_MS }));

    expect(result.current).toEqual({ remainSec: 60, canRetry: false });
    act(() => vi.advanceTimersByTime(10000)); //10초 감기

    expect(result.current).toEqual({ remainSec: 50, canRetry: false });

    act(() => vi.advanceTimersByTime(50000)); //50초 감기

    expect(result.current).toEqual({ remainSec: 0, canRetry: true });
  });
});
