'use client';
import { SEARCH_FIELD_DEFAULT } from '@/shared/domain/mybooks/search';
import { SORT_DEFAULT } from '@/shared/domain/mybooks/sort';
import { MyPageQuery } from '@/shared/domain/mybooks/types';
import { MYBOOKS_DEFAULT_TAB } from '@/shared/domain/mypage/tab';
import { useCallback, useMemo } from 'react';
import { buildParams } from './buildParams';
import { parseQueryFromParams } from './parseQueryFromParams';
import useUrlParams from '../url/useUrlParams';

export const useMypageQueryState = () => {
  const { setParams, getAllParams } = useUrlParams();

  const query = useMemo(() => {
    const params = getAllParams();

    return parseQueryFromParams(params);
  }, [getAllParams]);

  const setQuery = useCallback(
    (partial: Partial<MyPageQuery>) => {
      const params = getAllParams();

      const current = parseQueryFromParams(params);
      const next = {
        ...current,
        ...partial,
      };

      //section이 변경되면 리셋해야할것들
      if (partial.section !== undefined) {
        next.tab = MYBOOKS_DEFAULT_TAB;
        next.search = '';
        next.searchField = SEARCH_FIELD_DEFAULT[MYBOOKS_DEFAULT_TAB];
        next.sort = SORT_DEFAULT;
        next.filter = undefined;
        next.tagId = undefined;
      }

      //탭이 변경되면 리셋해야할것들
      if (partial.tab !== undefined) {
        next.search = '';
        next.sort = SORT_DEFAULT;
        next.searchField = SEARCH_FIELD_DEFAULT[partial.tab];
        next.page = 1;
      }

      //북마크 아닐때 숨겨야할것들
      if (next.tab !== 'bookmark') {
        next.filter = undefined;
        next.tagId = undefined;
      }

      // page reset 조건
      const shouldResetPage =
        partial.search !== undefined ||
        partial.sort !== undefined ||
        partial.filter !== undefined ||
        partial.tagId !== undefined ||
        partial.searchField !== undefined ||
        partial.tab !== undefined ||
        partial.section !== undefined;

      if (shouldResetPage) {
        next.page = 1;
      }

      setParams(buildParams(next), { shallow: true });
    },
    [getAllParams, setParams]
  );

  return { query, setQuery };
};
