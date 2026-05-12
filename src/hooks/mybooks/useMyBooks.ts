import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/shared/lib/supabase/client';
import { DEFAULT_PAGE_SIZE } from '@/shared/constants/pagination';
import { MyBooksQueryResult } from '@/shared/domain/mybooks/types';
import { MyBooksTabType } from '@/shared/domain/mypage/tab';
import { MyBooksSort, SORT_DEFAULT } from '@/shared/domain/mybooks/sort';
import { FILTER_DEFAULT, MyBooksFilter } from '@/shared/domain/mybooks/filter';
import { SearchField } from '@/shared/domain/mybooks/search';
import { MINUTE } from '@/shared/constants/time';
import { myBooksKeys } from '@/shared/domain/mybooks/queryKeys';
import { fetchMyBooks } from '@/hooks/mybooks/fetchMyBooks';

export const useMyBooks = (
  tab: MyBooksTabType,
  userId: string,
  page: number,
  sort?: MyBooksSort,
  memoFilter?: MyBooksFilter,
  search?: string,
  searchField?: SearchField,
  tagId?: string
) => {
  const supabase = createClient();

  const query = useQuery<MyBooksQueryResult>({
    queryKey: myBooksKeys.list({
      tab,
      userId,
      page,
      sort: sort ?? SORT_DEFAULT,
      filter: tab === 'bookmark' ? memoFilter : undefined,
      search,
      searchField,
      tagId,
    }),
    queryFn: () =>
      fetchMyBooks({
        tab,
        supabase,
        userId,
        page,
        pageSize: DEFAULT_PAGE_SIZE,
        sort: sort ?? SORT_DEFAULT,
        memoFilter: memoFilter ?? FILTER_DEFAULT,
        search,
        searchField,
        tagId,
      }),
    enabled: !!userId,
    staleTime: 3 * MINUTE, //3분
  });
  return {
    ...query,
    result: query.data,
  };
};
