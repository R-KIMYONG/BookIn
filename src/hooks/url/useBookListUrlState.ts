'use client';

import { DEFAULT_QT, QUERY_TYPE_LIST, APP_QUERY_KEYS } from '@/shared/domain/aladin/constants';
import { SearchQueryType } from '@/shared/domain/search/types';
import { DEFAULT_TARGET, TARGET_LIST, TargetTypes } from '@/shared/constants/category';
import { QueryType } from '@/shared/domain/aladin/types';
import { DEFAULT_SEARCH_QT, SEARCH_QT_LIST } from '@/shared/domain/search/constants';
import useUrlParams from './useUrlParams';

// 도서 리스트 화면(홈 / 카테고리)에서 공통으로 사용하는 URL 키

type SetOptions = { replace?: boolean; scroll?: boolean };

type SetInput = {
  page?: number;
  searchKeyWord?: string | null;
  target?: TargetTypes;
  queryType?: QueryType | null;
  searchQueryType?: SearchQueryType | null;
};

type UseBookListUrlStateOptions = {
  defaultTarget?: TargetTypes;
};

const useBookListUrlState = (options?: UseBookListUrlStateOptions) => {
  const fallbackTarget = options?.defaultTarget ?? DEFAULT_TARGET;
  const { getParams, getInt, setParams } = useUrlParams();

  const page = getInt(APP_QUERY_KEYS.page, 1);
  const searchKeyWord = (getParams(APP_QUERY_KEYS.searchKeyWord) ?? '').trim();

  const targetParam = (getParams(APP_QUERY_KEYS.target) ?? '').trim() as TargetTypes;
  const target: TargetTypes = TARGET_LIST.includes(targetParam) ? targetParam : fallbackTarget;

  const qtParam = (getParams(APP_QUERY_KEYS.queryType) ?? '').trim() as QueryType;
  const queryType: QueryType = QUERY_TYPE_LIST.includes(qtParam) ? qtParam : DEFAULT_QT;

  const sqParam = (getParams(APP_QUERY_KEYS.searchQueryType) ?? '').trim() as SearchQueryType;
  const searchQueryType: SearchQueryType = SEARCH_QT_LIST.includes(sqParam) ? sqParam : DEFAULT_SEARCH_QT;

  const setListUrl = (next: SetInput, opts?: SetOptions) => {
    // null로 명시하면 default로 리셋, undefined면 기존값 유지
    const nextQueryType = next.queryType === null ? DEFAULT_QT : (next.queryType ?? queryType);
    const nextTarget = next.target ?? target;
    const nextSearchKeyWord = next.searchKeyWord === null ? '' : (next.searchKeyWord ?? searchKeyWord).trim();
    const nextSearchQuery =
      next.searchQueryType === null ? DEFAULT_SEARCH_QT : (next.searchQueryType ?? searchQueryType);

    // 검색어 없으면 q / sq 모두 URL에서 제거
    const qOut = nextSearchKeyWord ? nextSearchKeyWord : null;
    const sqOut = qOut ? nextSearchQuery : null;

    // 필터/검색이 바뀌면 page 1로 리셋
    const shouldResetPage =
      nextQueryType !== queryType ||
      nextSearchKeyWord !== searchKeyWord ||
      nextTarget !== target ||
      nextSearchQuery !== searchQueryType;

    setParams(
      {
        [APP_QUERY_KEYS.queryType]: nextQueryType,
        [APP_QUERY_KEYS.target]: nextTarget,
        [APP_QUERY_KEYS.searchKeyWord]: qOut,
        [APP_QUERY_KEYS.searchQueryType]: sqOut,
        [APP_QUERY_KEYS.page]: shouldResetPage ? 1 : (next.page ?? page),
      },
      opts
    );
  };

  return { page, target, queryType, searchKeyWord, searchQueryType, setListUrl };
};

export default useBookListUrlState;
