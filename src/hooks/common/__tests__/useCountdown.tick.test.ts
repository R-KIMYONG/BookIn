import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import useCountdown from '../useCountdown';

describe('useCountdown 실시간 틱', () => {
  beforeEach(() => vi.useFakeTimers()); //테스트 진행 시 가짜시간으로 설정하고 시작
  afterEach(() => vi.useRealTimers()); // 테스트 완료이후 다시 실제시간으로 되돌리기

  it('1초마다 remainingsec가 3->2->1->0으로 줄어드는지 테스트', () => {
    const base = 1_000_000; //1000초
    vi.setSystemTime(base);
    const expiresAt = base + 3000; //3초뒤에 만료

    const { result } = renderHook(() => useCountdown(expiresAt));
    expect(result.current.remainingSec).toBe(3); //1초 감기 전이니 3초남음

    act(() => {
      vi.advanceTimersByTime(1000); //1초 진행
    });

    expect(result.current.remainingSec).toBe(2); // 2초남음
    expect(result.current.countDownText).toBe('00:00:02'); //1초 경과했으니 2초남음
    expect(result.current.isExpired).toBe(false); //만료안됨

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.countDownText).toBe('00:00:01');
    expect(result.current.isExpired).toBe(false);

    act(() => {
      vi.advanceTimersByTime(1000); //1초 또 진행
    });

    expect(result.current.countDownText).toBe('00:00:00');
    expect(result.current.isExpired).toBe(true); //이제 만료됨
  });
});
