import { useEffect } from 'react';
import useUrlParams from './useUrlParams';
import { QT_LIST, QueryType } from '@/types/useListUrlState.type';
import { SEARCH_QT_LIST, SearchQueryType } from '@/types/searchBar.type';
import { TARGET_LIST, TargetTypes } from '@/types/category.type';


const DEFAULT_QT: QueryType = 'Bestseller';
const useCategoryUrlState = (args: { categoryId: number; defaultTarget: TargetTypes }) => {
  const { getParams, getInt, setParams } = useUrlParams();

  const page = getInt('page', 1);
  const searchKeyWord = (getParams('q') ?? '').trim();
  const targetParam = (getParams('target') ?? '').trim();
  const target: TargetTypes | '' = TARGET_LIST.includes(targetParam as TargetTypes) ? (targetParam as TargetTypes) : '';

  const qtParam = (getParams('qt') ?? '').trim();
  const queryType: QueryType = QT_LIST.includes(qtParam as QueryType) ? (qtParam as QueryType) : DEFAULT_QT;

  const sqParam = (getParams('sq') ?? '').trim();
  const searchQueryType: SearchQueryType = SEARCH_QT_LIST.includes(sqParam as SearchQueryType)
    ? (sqParam as SearchQueryType)
    : 'Keyword';

  useEffect(() => {
    if (!target) {
      setParams({ target: args.defaultTarget, page: page || 1 }, { replace: true, scroll: false });
    }
  }, [target, args.defaultTarget, args.categoryId, page, setParams]);

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
