import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';
import { COMMENTS_PAGE_SIZE } from '@/constants/pagination';
import {
  FILTER_DEFAULT,
  MyBooksFilter,
  MyBooksSort,
  MyBooksTabType,
  SearchField,
  SORT_DEFAULT,
} from '@/types/useMypageUrlState.type';
import { getCommentBooks } from '@/app/lib/mybooks/getCommentBooks';
import { getLikeBooks } from '@/app/lib/mybooks/getLikeBooks';
import { getBookmarkBooks } from '@/app/lib/mybooks/getBookmarkBooks';
import { BookmarkBook, CommentBook, LikeBook } from '@/types/myBooks.type';

type MyBooksQueryResult =
  | { tab: 'comment'; data: CommentBook[]; total: number }
  | { tab: 'like'; data: LikeBook[]; total: number }
  | { tab: 'bookmark'; data: BookmarkBook[]; total: number };

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
    queryKey: [
      'myBooks',
      {
        tab,
        userId,
        page,
        sort: sort ?? SORT_DEFAULT,
        filter: tab === 'bookmark' ? (memoFilter ?? FILTER_DEFAULT) : undefined,
        search: search ?? '',
        searchField,
        tagSlug: tab === 'bookmark' ? tagId : undefined,
      },
    ],
    queryFn: async () => {
      if (tab === 'comment') {
        const res = await getCommentBooks({
          supabase,
          userId,
          page,
          pageSize: COMMENTS_PAGE_SIZE,
          sort,
          search,
          searchField,
        });
        return { tab: 'comment', ...res };
      }
      if (tab === 'like') {
        const res = await getLikeBooks({
          supabase,
          userId,
          page,
          pageSize: COMMENTS_PAGE_SIZE,
          sort,
          search,
          searchField,
        });
        return { tab: 'like', ...res };
      }
      const res = await getBookmarkBooks({
        supabase,
        userId,
        page,
        pageSize: COMMENTS_PAGE_SIZE,
        sort: sort ?? 'created_desc',
        memoFilter: memoFilter ?? 'all',
        search,
        searchField,
        tagId,
      });
      return { tab: 'bookmark', ...res };
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 3, //3분
  });
  return {
    ...query,
    result: query.data,
  };
};
