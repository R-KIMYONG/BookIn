import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useMypageQueryState } from '../useMypageQueryState';
import { MYPAGE_DEFAULT_SECTION } from '@/shared/domain/mypage/section';
import useUrlParams from '@/hooks/url/useUrlParams';

vi.mock('@/hooks/url/useUrlParams', () => {
  return { default: vi.fn() };
});

const setup = (params: Record<string, string | null> = {}) => {
  const setParams = vi.fn();
  vi.mocked(useUrlParams).mockReturnValue({
    getAllParams: () => params,
    getInt: vi.fn(),
    setParams,
    getParams: vi.fn(),
  });

  const view = renderHook(() => useMypageQueryState());
  return { ...view, setParams };
};

describe('useMypageQueryState훅 테스트', () => {
  beforeEach(() => vi.clearAllMocks());
  it('초기값 셋팅 검증 테스트', () => {
    const { result } = setup({ section: MYPAGE_DEFAULT_SECTION });

    expect(result.current.query).toMatchObject({ section: 'myBooks', tab: 'like' });
  });
  it('tab 변경하면 리셋된 params로 호출여부 테스트', () => {
    const { result, setParams } = setup({ section: 'myBooks', tab: 'like', page: '2' });

    result.current.setQuery({ tab: 'bookmark' });

    expect(setParams).toHaveBeenCalledWith(expect.objectContaining({ tab: 'bookmark', search: null, page: 1 }), {
      shallow: true,
      replace: false,
    });
  });

  it('section변경하면 Page 0 여부 테스트', () => {
    const { result, setParams } = setup({ section: 'myBooks' });

    result.current.setQuery({ section: 'recommend' });

    expect(setParams).toHaveBeenCalledWith(
      expect.objectContaining({ section: 'recommend', page: 0 }),
      expect.anything()
    );
  });

  it('nav중에 search변경일때 replace:true', () => {
    const { result, setParams } = setup({ section: 'myBooks', tab: 'like' });

    result.current.setQuery({ search: '구멍청' });
    expect(setParams).toHaveBeenCalledWith(expect.objectContaining({ search: '구멍청', page: 1 }), {
      shallow: true,
      replace: true,
    });
  });

  it('bookmark 탭이 아니게되면 filter/tagId null이 된다.', () => {
    const { result, setParams } = setup({ section: 'myBooks', tab: 'bookmark', filter: 'read', tagId: 't1' });

    result.current.setQuery({ tab: 'comment' });

    expect(setParams).toHaveBeenCalledWith(expect.objectContaining({ tab: 'comment', filter: null, tagId: null }), {
      shallow: true,
      replace: false,
    });
  });
});
