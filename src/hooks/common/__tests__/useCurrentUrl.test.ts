import { renderHook } from '@testing-library/react';
import { usePathname, useSearchParams } from 'next/navigation';
import { afterEach, describe, expect, it, vi } from 'vitest';
import useCurrentUrl from '../useCurrentUrl';

vi.mock('next/navigation', () => {
  return {
    usePathname: vi.fn(),
    useSearchParams: vi.fn(),
  };
});

describe('useCurrentUrl훅 테스트 코드', () => {
  afterEach(() => vi.clearAllMocks());
  it('쿼리스트링이 없으면 pathname만 반환한다', () => {
    vi.mocked(usePathname).mockReturnValue('/books');
    vi.mocked(useSearchParams).mockReturnValue(new URLSearchParams('') as any);

    const { result } = renderHook(() => useCurrentUrl());
    expect(result.current).toBe('/books');
  });

  it('쿼리 스트링이 있으면 pathname?query 형태로 반환한다.', () => {
    vi.mocked(usePathname).mockReturnValue('/books');
    vi.mocked(useSearchParams).mockReturnValue(new URLSearchParams('search=123') as any);

    const { result } = renderHook(() => useCurrentUrl());

    expect(useSearchParams).toHaveBeenCalled();
    expect(useSearchParams).toHaveBeenCalledTimes(1);

    console.log(result.current);
    expect(result.current).toBe('/books?search=123');
  });
});
