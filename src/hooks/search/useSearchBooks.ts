import { TargetTypes } from '@/shared/constants/category';
import { SearchQueryType } from '@/shared/domain/search/types';
import { MINUTE } from '@/shared/constants/time';
import { APP_QUERY_KEYS } from '@/shared/domain/aladin/constants';
import { aladinKeys } from '@/shared/domain/aladin/queryKeys';
import { PagedResult } from '@/shared/domain/aladin/types';
import { normalizeBook } from '@/shared/lib/book/normalizeBook';
import { Item, SearchResult } from '@/shared/types/api';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
type useSearchBooksType = {
  searchKeyWord?: string | null;
  searchQueryType: SearchQueryType;
  page: number;
  isSearching: boolean;
  target: TargetTypes;
  categoryId?: number | null;
};
const emptyPaged = <T>(itemsPerPage = 20): PagedResult<T> => ({
  items: [],
  totalResults: 0,
  itemsPerPage,
});

export const useSearchBooks = ({
  searchKeyWord,
  searchQueryType,
  page,
  isSearching,
  target,
  categoryId = 0,
}: useSearchBooksType) => {
  return useQuery({
    queryKey: aladinKeys.search({ searchKeyWord, searchQueryType, page, target, categoryId }),

    queryFn: async () => {
      if (!searchKeyWord?.trim()) return emptyPaged<Item>(20);

      const params = new URLSearchParams({
        [APP_QUERY_KEYS.searchKeyWord]: searchKeyWord,
        [APP_QUERY_KEYS.page]: String(page),
        [APP_QUERY_KEYS.searchQueryType]: searchQueryType,
        [APP_QUERY_KEYS.target]: target,
        [APP_QUERY_KEYS.categoryId]: String(categoryId ?? 0),
      });

      const url = `/api/aladin/search?${params.toString()}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('검색 실패');
      const data: SearchResult = await res.json();
      return {
        items: (data.item ?? []).map(normalizeBook),
        totalResults: Number(data.totalResults ?? 0),
        itemsPerPage: Number(data.itemsPerPage ?? 20),
      };
    },
    staleTime: 1 * MINUTE,
    placeholderData: keepPreviousData,
    enabled: isSearching,
  });
};
