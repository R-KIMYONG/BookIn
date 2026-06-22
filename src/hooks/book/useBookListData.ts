import { TargetTypes } from '@/shared/constants/category';
import { useQuery } from '@tanstack/react-query';
import { aladinKeys } from '@/shared/domain/aladin/queryKeys';
import { useSearchBooks } from '../search/useSearchBooks';
import getTotalPages from '@/shared/utils/pagination';
import { fetchAladinList } from '@/shared/lib/aladin/fetchAladinList.client';
import { MINUTE } from '@/shared/constants/time';
import useBookListUrlState from '../url/useBookListUrlState';
import { useRef } from 'react';
import { useDebounce } from '../common/useDebounce';
import { PagedResult, QueryType } from '@/shared/domain/aladin/types';
import { AladinBookInfo } from '@/shared/types/api';

type UseBookListDataProps = {
  target: TargetTypes;
  categoryId?: number;
  initialPage?: number;
  initialQueryType?: QueryType;
  initialList?: PagedResult<AladinBookInfo>;
};

export const useBookListData = ({
  target,
  categoryId,
  initialQueryType,
  initialPage,
  initialList,
}: UseBookListDataProps) => {
  const { page, queryType, searchKeyWord, searchQueryType, setListUrl } = useBookListUrlState({
    defaultTarget: target,
    defaultPage: initialPage,
    defaultQueryType: initialQueryType,
  });
  const lastTotalPagesRef = useRef(1);
  const isSearching = Boolean(searchKeyWord?.trim());

  const useLastPage = !isSearching && categoryId != null;

  const debouncedPage = useDebounce(page, 300);

  //리스트
  const {
    data: categoryList,
    isPending: categoryListPending,
    isFetching: catFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: aladinKeys.list({ queryType, page: debouncedPage, target, categoryId }),
    queryFn: ({ signal }) => fetchAladinList({ queryType, page: debouncedPage, target, categoryId, signal }),
    enabled: !isSearching,
    staleTime: 3 * MINUTE,
    initialData:
      initialList && debouncedPage === initialPage && queryType === initialQueryType ? initialList : undefined,
  });

  //검색 리스트
  const {
    data: searchData,
    isPending: searchPending,
    isFetching: searchFetching,
  } = useSearchBooks({ searchKeyWord, searchQueryType, page: debouncedPage, isSearching, target, categoryId });

  //카테고리에서 주는 페이크 총수->진짜 라스트페이지를 구함
  const { data: lastPageData } = useQuery({
    queryKey: aladinKeys.lastPage({ queryType, target, categoryId: categoryId ?? 0 }),
    queryFn: async () => {
      const params = new URLSearchParams({ QueryType: queryType, target, CategoryId: String(categoryId ?? 0) });
      const res = await fetch(`/api/aladin/last-page?${params.toString()}`);
      if (!res.ok) throw new Error('lastPage 실패');
      return res.json() as Promise<{ lastPage: number }>;
    },
    enabled: useLastPage,
    staleTime: 10 * MINUTE,
  });

  // 모드 선택·계산을 '딱 한 번'만
  const list = isSearching ? (searchData?.items ?? []) : (categoryList?.items ?? []);
  const listDataPending = isSearching ? searchPending : categoryListPending;
  const isFetching = isSearching ? searchFetching : catFetching;
  const searchTotal = searchData?.totalResults ?? 0;

  const searchTotalPage = getTotalPages(searchData?.totalResults ?? 0, searchData?.itemsPerPage ?? 20);

  const browseTotalPages =
    categoryId != null
      ? (lastPageData?.lastPage ?? 1) // 카테고리 페이지수
      : getTotalPages(categoryList?.totalResults ?? 0, categoryList?.itemsPerPage ?? 20); // 홈 페이지수

  const computedTotalPages = isSearching ? searchTotalPage : browseTotalPages;
  const hasListData = isSearching ? searchData != null : categoryList != null;

  if (hasListData && computedTotalPages > 0) {
    lastTotalPagesRef.current = computedTotalPages; // 확정값 기억
  }

  const totalPages = hasListData ? computedTotalPages : lastTotalPagesRef.current;
  return {
    isSearching,
    list,
    page,
    listDataPending,
    isFetching,
    totalPages,
    searchTotal,
    isError,
    error,
    refetch,
    queryType,
    searchKeyWord,
    searchQueryType,
    setListUrl,
  };
};
