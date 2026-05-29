import { useQuery } from '@tanstack/react-query';
import { DEFAULT_PAGE_SIZE } from '@/shared/constants/pagination';
import { MyBooksQueryResult } from '@/shared/domain/mybooks/types';
import { MyBooksTabType } from '@/shared/domain/mypage/tab';
import { MyBooksSort, SORT_DEFAULT } from '@/shared/domain/mybooks/sort';
import { FILTER_DEFAULT, MyBooksFilter } from '@/shared/domain/mybooks/filter';
import { SearchField } from '@/shared/domain/mybooks/search';
import { MINUTE } from '@/shared/constants/time';
import { myBooksKeys } from '@/shared/domain/mybooks/queryKeys';
import { fetchMyBooksClient } from '@/hooks/mybooks/fetchMyBooksClient';
import { normalizeMyBooksKey } from '@/shared/domain/mybooks/normalizeMyBooksKey';

export const useMyBooks = (
  tab: MyBooksTabType,
  page: number,
  sort?: MyBooksSort,
  memoFilter?: MyBooksFilter,
  search?: string,
  searchField?: SearchField,
  tagId?: string
) => {
  const query = useQuery<MyBooksQueryResult>({
    queryKey: myBooksKeys.list(
      normalizeMyBooksKey({
        tab,
        page,
        sort: sort ?? SORT_DEFAULT,
        filter: tab === 'bookmark' ? memoFilter : undefined,
        search,
        searchField,
        tagId: tab === 'bookmark' ? tagId : undefined,
      })
    ),
    queryFn: () =>
      fetchMyBooksClient({
        tab,
        page,
        pageSize: DEFAULT_PAGE_SIZE,
        sort: sort ?? SORT_DEFAULT,
        memoFilter: memoFilter ?? FILTER_DEFAULT,
        search,
        searchField,
        tagId,
      }),
    staleTime: 5 * MINUTE, //3분
    placeholderData: (prev, prevQuery) => {
      // 같은 탭 내 전환(페이지/정렬/필터/검색)에서만 이전 목록 유지 → 깜빡임 방지
      // 탭이 바뀌면 undefined → isPending → 스켈레톤 노출
      const prevTab = (prevQuery?.queryKey[1] as { tab?: MyBooksTabType } | undefined)?.tab;
      return prevTab === tab ? prev : undefined;
    },
  });
  return {
    ...query,
    result: query.data,
  };
};
