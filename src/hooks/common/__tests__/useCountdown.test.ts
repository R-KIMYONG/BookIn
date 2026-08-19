import { afterEach, describe, expect, it, vi } from 'vitest';
import useNow from '../useNow';
import { renderHook } from '@testing-library/react';
import useCountdown from '../useCountdown';

vi.mock('@/hooks/common/useNow', () => {
  return { default: vi.fn() };
});

describe('useCountdown훅 테스트', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('만료 전이면 남은 초/포맷/미만료를 반환한다', () => {
    vi.mocked(useNow).mockReturnValue(1_000_000); //useNow에 1,000초 가짜 현재 시간을 줌

    const { result } = renderHook(
      ({ value }) => {
        return useCountdown(value);
      },
      { initialProps: { value: 1_005_000 } } // 현재시간에서 5초만 더줘서 props에 넣기
    );

    expect(result.current.remainingSec).toBe(5); // 카운트가 5초인지 검증
    expect(result.current.countDownText).toBe('00:00:05'); //5초의 문자열이 맞는지 검증
    expect(result.current.isExpired).toBe(false); //만료여부를 검증
  });

  it('이미 만료됬으면 0초/00:00:00/만료됨을 반환한다.', () => {
    vi.mocked(useNow).mockReturnValue(1_000_000);
    const { result } = renderHook(() => useCountdown(1_000_000));

    expect(result.current.remainingSec).toBe(0);
    expect(result.current.countDownText).toBe('00:00:00');
    expect(result.current.isExpired).toBe(true);
  });

  it('expiresAtMs가 없으면 전부 null로 반환여부 테스트', () => {
    vi.mocked(useNow).mockReturnValue(1_000_000);
    const { result } = renderHook(() => useCountdown(null));

    expect(result.current.remainingSec).toBeNull();
    expect(result.current.countDownText).toBeNull();
    expect(result.current.isExpired).toBe(false);
  });

  it('시/분/초 가 올바른 포맷여부 테스트', () => {
    vi.mocked(useNow).mockReturnValue(0); //현재시간을 0으로 설정 -> 만약에 해당 값을 1로 지정하면 1초이니까

    const { result } = renderHook(() => useCountdown(3_661_000)); //시간으로 환산하면 1시 1분 1초 -> 만약에 현재시간이 1초이면 그럼 1시간1분0초 출발이 1초이니까

    expect(result.current.countDownText).toBe('01:01:01');
  });
});
