import useUrlParams from './useUrlParams';
import { DEFAULT_QT, QUERY_TYPE_LIST, QueryType } from '@/shared/domain/aladin/constants';
import { DEFAULT_SEARCH_QT, SEARCH_QT_LIST, SearchQueryType } from '@/shared/constants/search';
import { TARGET_LIST, TargetTypes } from '@/shared/constants/category';

const useCategoryUrlState = (args: { categoryId: number; defaultTarget: TargetTypes }) => {
  const { getParams, getInt, setParams } = useUrlParams();

  const page = getInt('page', 1);
  const searchKeyWord = (getParams('search') ?? '').trim(); //검색키워드 추출

  const targetParam = (getParams('target') ?? '').trim(); //어느 대분류 예) 국내도서 외국도서 ebook중 하나
  const target: TargetTypes | '' = TARGET_LIST.includes(targetParam as TargetTypes) ? (targetParam as TargetTypes) : '';

  const qtParam = (getParams('qt') ?? '').trim(); //어느탭인지 구분 예)베스트셀러,새로 나온책,화제의책,베스트예감,편집자추천
  const queryType: QueryType = QUERY_TYPE_LIST.includes(qtParam as QueryType) ? (qtParam as QueryType) : DEFAULT_QT;

  const sqParam = (getParams('sq') ?? '').trim(); //이거는 뭘로 검색할건지 추철 제목,작가,출판사,키워드
  const searchQueryType: SearchQueryType = SEARCH_QT_LIST.includes(sqParam as SearchQueryType)
    ? (sqParam as SearchQueryType)
    : DEFAULT_SEARCH_QT;


  const effectiveTarget: TargetTypes = target || args.defaultTarget;

  const setCategoryUrl = (
    next: {
      page?: number;
      searchKeyWord?: string | null;
      target?: TargetTypes;
      queryType?: QueryType | null;
      searchQueryType?: SearchQueryType | null;
    },
    options?: { replace?: boolean; scroll?: boolean }
  ) => {
    //기존값
    const prevSearchKeyWord = searchKeyWord;
    const prevTarget = effectiveTarget;
    const prevSearchQuery = searchQueryType;

    //업데이트값
    const nextTarget = next.target ?? prevTarget;
    const nextQueryType = next.queryType === null ? DEFAULT_QT : (next.queryType ?? queryType);

    const nextSearchKeyWord = next.searchKeyWord === null ? '' : (next.searchKeyWord ?? prevSearchKeyWord).trim();
    const nextSearchQuery = next.searchQueryType === null ? 'Keyword' : (next.searchQueryType ?? prevSearchQuery);

    const qParam = nextSearchKeyWord ? nextSearchKeyWord : null;
    const sqParam = qParam ? nextSearchQuery : null;

    const shouldPageChange =
      nextQueryType !== queryType ||
      nextSearchKeyWord !== searchKeyWord ||
      nextTarget !== effectiveTarget ||
      nextSearchQuery !== prevSearchQuery;
    setParams(
      {
        qt: nextQueryType,
        q: qParam,
        sq: sqParam,
        page: shouldPageChange ? 1 : (next.page ?? page),
        target: nextTarget,
      },
      options
    );
  };

  return { page, searchKeyWord, target: effectiveTarget, searchQueryType, queryType, setCategoryUrl };
};

export default useCategoryUrlState;
