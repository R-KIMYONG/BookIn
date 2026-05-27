import { DEFAULT_QT, QUERY_TYPE_LIST, QueryType } from '@/shared/domain/aladin/constants';
import useUrlParams from './useUrlParams';
import { DEFAULT_SEARCH_QT, SEARCH_QT_LIST, SearchQueryType } from '@/shared/constants/search';
import { ALLOWED_TARGETS, DEFAULT_TARGET, TargetTypes } from '@/shared/constants/category';

const useHomeListUrlState = () => {
  const { getParams, getInt, setParams } = useUrlParams();
  const queryTypeParam = getParams('qt'); //현재 URL상 qt(queryType을 가져와라)
  const page = getInt('page', 1);
  const searchKeyWord = (getParams('q') ?? '').trim(); //현재 URL상 검색키워드 가져와인데 없으면 빈칸 + 앞뒤 빈칸 지우기
  const targetParam = getParams('target');

  const queryType: QueryType = QUERY_TYPE_LIST.includes(queryTypeParam as QueryType)
    ? (queryTypeParam as QueryType)
    : DEFAULT_QT;

  const sqParam = (getParams('sq') ?? '').trim();
  const searchQueryType: SearchQueryType = SEARCH_QT_LIST.includes(sqParam as SearchQueryType)
    ? (sqParam as SearchQueryType)
    : DEFAULT_SEARCH_QT;

  const target = ALLOWED_TARGETS.includes(targetParam as TargetTypes) ? (targetParam as TargetTypes) : DEFAULT_TARGET;

  const setHomeUrl = (next: {
    queryType?: QueryType;
    page?: number;
    searchKeyWord?: string | null;
    searchQueryType?: SearchQueryType | null;
    target?: TargetTypes;
  }) => {
    //기존값 (파라미터에 들어온값이 없으면 기존값으로 유지용)
    const prevQueryType = queryType;
    const prevSearchKeyWord = searchKeyWord;
    const prevSearchQuery = searchQueryType;
    const prevTarget = target;

    //업데이트값
    const nextQueryType = next.queryType === null ? DEFAULT_QT : (next.queryType ?? prevQueryType);
    const nextSearchKeyWord = next.searchKeyWord === null ? '' : (next.searchKeyWord ?? prevSearchKeyWord).trim();
    const nextSearchQuery =
      next.searchQueryType === null ? DEFAULT_SEARCH_QT : (next.searchQueryType ?? prevSearchQuery);

    const qParam = nextSearchKeyWord ? nextSearchKeyWord : null;
    const nextTarget = next.target ?? prevTarget;

    const shouldPageChange =
      prevQueryType !== nextQueryType ||
      prevSearchKeyWord !== nextSearchKeyWord ||
      prevSearchQuery !== nextSearchQuery ||
      prevTarget !== nextTarget;

    setParams({
      qt: nextQueryType,
      target: nextTarget,
      q: qParam,
      sq: nextSearchQuery,
      page: shouldPageChange ? 1 : (next.page ?? page),
    });
  };
  return { queryType, page, target, searchKeyWord, searchQueryType, setHomeUrl };
};

export default useHomeListUrlState;
