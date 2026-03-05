import { QT_LIST, QueryType } from '@/types/useListUrlState.type';
import useUrlParams from './useUrlParams';
import { SEARCH_QT_LIST, SearchQueryType } from '@/types/searchBar.type';

const useHomeListUrlState = () => {
  const { getParams, getInt, setParams } = useUrlParams();

  const queryTypeParam = getParams('qt'); //현재 URL상 qt(queryType을 가져와라)
  const page = getInt('page', 1); //현재 URL상 page를  가져오는데 없으면 1로 fallback
  const searchKeyWord = (getParams('q') ?? '').trim(); //현재 URL상 검색키워드 가져와인데 없으면 빈칸 + 앞뒤 빈칸 지우기

  const queryType: QueryType | null = QT_LIST.includes(queryTypeParam as QueryType)
    ? (queryTypeParam as QueryType)
    : 'Bestseller';

  const sqParam = (getParams('sq') ?? '').trim();
  const searchQueryType: SearchQueryType = SEARCH_QT_LIST.includes(sqParam as SearchQueryType)
    ? (sqParam as SearchQueryType)
    : 'Keyword';

  const setHomeUrl = (next: {
    queryType?: QueryType;
    page?: number;
    searchKeyWord?: string | null;
    searchQueryType?: SearchQueryType | null;
  }) => {
    //기존값 (파라미터에 들어온값이 없으면 기존값으로 유지용)
    const prevQueryType = queryType;
    const prevSearchKeyWord = searchKeyWord;
    const prevSearchQuery = searchQueryType;

    //업데이트값
    const nextQueryType = next.queryType === null ? 'Bestseller' : (next.queryType ?? prevQueryType);
    const nextSearchKeyWord = next.searchKeyWord === null ? '' : (next.searchKeyWord ?? prevSearchKeyWord).trim();
    const nextSearchQuery = next.searchQueryType === null ? 'Keyword' : (next.searchQueryType ?? prevSearchQuery);

    const qParam = nextSearchKeyWord ? nextSearchKeyWord : null;

    const shouldPageChange =
      prevQueryType !== nextQueryType || prevSearchKeyWord !== nextSearchKeyWord || prevSearchQuery !== nextSearchQuery;

    setParams({ qt: nextQueryType, q: qParam, sq: nextSearchQuery, page: shouldPageChange ? 1 : (next.page ?? page) });
  };
  return { queryType, page, searchKeyWord, searchQueryType, setHomeUrl };
};

export default useHomeListUrlState;
