import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useDebounce } from '../useDebounce';
import { act, renderHook } from '@testing-library/react';

describe('useDebounce 테스트진행', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('useDebounce훅의 XXX 테스트', () => {
    const { result, rerender } = renderHook(
      ({ value }) => {
        return useDebounce(value, 300);
      },
      { initialProps: { value: 'a' } }
    );

    rerender({ value: 'b' });
    act(() => {
      vi.advanceTimersByTime(299);
    });

    expect(result.current).toBe('a');
  });

  it('useDebounce훅의 DDD 테스트', () => {
    const { result, rerender } = renderHook(
      ({ value }) => {
        return useDebounce(value, 300);
      },
      { initialProps: { value: 'a' } }
    );

    rerender({ value: 'b' });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe('b');
  });

  it('delay 내에 값이 여러 번 바뀌면 마지막 값만 반영된다', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), { initialProps: { value: 'a' } });

    rerender({ value: 'b' });
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe('a');

    rerender({ value: 'c' });
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe('a');

    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe('c');
  });
});
