import { TargetTypes } from '@/shared/constants/category';
import { useQuery } from '@tanstack/react-query';
import { aladinKeys } from '@/shared/domain/aladin/queryKeys';
import { useSearchBooks } from '../search/useSearchBooks';
import getTotalPages from '@/shared/utils/pagination';
import { fetchAladinList } from '@/shared/lib/aladin/fetchAladinList.client';
import { MINUTE } from '@/shared/constants/time';
import useBookListUrlState from '../url/useBookListUrlState';

type UseBookListDataProps = {
  target: TargetTypes;
  page: number;
  categoryId?: number;
};

export const useBookListData = ({ target, page, categoryId }: UseBookListDataProps) => {
  const { queryType, searchKeyWord, searchQueryType, setListUrl } = useBookListUrlState({ defaultTarget: target });
  const isSearching = Boolean(searchKeyWord?.trim());

  const useLastPage = !isSearching && categoryId != null;

  //리스트
  const {
    data: categoryList,
    isPending: categoryListPending,
    isFetching: catFetching,
    isError,
    error,
  } = useQuery({
    queryKey: aladinKeys.list({ queryType, page, target, categoryId }),
    queryFn: () => fetchAladinList({ queryType, page, target, categoryId }),
    enabled: !isSearching,
    staleTime: 3 * MINUTE,
  });

  //검색 리스트
  const {
    data: searchData,
    isPending: searchPending,
    isFetching: searchFetching,
  } = useSearchBooks({ searchKeyWord, searchQueryType, page, isSearching, target, categoryId });

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

  const totalPages = isSearching ? searchTotalPage : browseTotalPages;

  return {
    isSearching,
    list,
    listDataPending,
    isFetching,
    totalPages,
    searchTotal,
    isError,
    error,
    queryType,
    searchKeyWord,
    searchQueryType,
    setListUrl,
  };
};
