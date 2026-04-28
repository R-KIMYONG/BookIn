import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';
import { COMMENTS_PAGE_SIZE } from '@/constants/pagination';
import { BookmarkFilter, BookmarkSort, MyBooksTabType } from '@/types/useMypageUrlState.type';
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
  sort?: BookmarkSort,
  memoFilter?: BookmarkFilter
) => {
  const supabase = createClient();
  const bookmarkSortKey = tab === 'bookmark' ? (sort ?? 'created_desc') : undefined;
  const bookmarkFilterKey = tab === 'bookmark' ? memoFilter : null;
  const query = useQuery<MyBooksQueryResult>({
    queryKey: ['myBooks', tab, userId, page, bookmarkSortKey, bookmarkFilterKey],
    queryFn: async () => {
      if (tab === 'comment') {
        const res = await getCommentBooks({ supabase, userId, page, pageSize: COMMENTS_PAGE_SIZE });
        return { tab: 'comment', ...res };
      }
      if (tab === 'like') {
        const res = await getLikeBooks({ supabase, userId, page, pageSize: COMMENTS_PAGE_SIZE });
        return { tab: 'like', ...res };
      }
      const res = await getBookmarkBooks({
        supabase,
        userId,
        page,
        pageSize: COMMENTS_PAGE_SIZE,
        sort: sort ?? 'created_desc',
        memoFilter: memoFilter ?? 'all',
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
